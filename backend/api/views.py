"""
API Views for Voting System
This file contains all the API endpoint handlers for authentication, voting, and admin functions.
Each function handles a specific API request and returns appropriate JSON responses.
"""

import json
import hashlib
import secrets
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
import jwt

# Import AWS utilities
from .utils.aws_helper import DynamoDBHelper
from .utils.auth_helper import create_jwt_token, verify_jwt_token

# Initialize DynamoDB helper
dynamodb = DynamoDBHelper()

# Mock voter database for demo purposes
# In production, this would be stored in DynamoDB or a secure database
MOCK_VOTERS = {
    'VOTER12345': {'name': 'Rahul Kumar', 'aadhaar': '1234-5678-9012', 'has_voted': False},
    'VOTER67890': {'name': 'Priya Sharma', 'aadhaar': '9876-5432-1098', 'has_voted': False},
    'TEST123': {'name': 'Test User', 'aadhaar': '1111-2222-3333', 'has_voted': False}
}

# In-memory storage for votes (fallback if DynamoDB is not available)
VOTES_STORE = {}
HAS_VOTED_STORE = set()


@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint to verify API is running.
    Returns current timestamp and service status.
    """
    return JsonResponse({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'voting-system-api',
        'version': '1.0.0'
    })


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    """
    Step 1: Login with Voter ID
    Validates voter ID and creates a session for biometric verification.
    
    Request body:
        {
            "voterId": "VOTER12345"
        }
    
    Returns:
        {
            "success": true,
            "data": {
                "sessionId": "uuid",
                "voterId": "VOTER12345",
                "voterName": "Rahul Kumar",
                "requiresBiometric": true
            }
        }
    """
    try:
        # Parse request body
        data = json.loads(request.body)
        voter_id = data.get('voterId')
        
        # Validate voter ID is provided
        if not voter_id:
            return JsonResponse({
                'success': False,
                'error': 'Voter ID is required'
            }, status=400)
        
        # Check if voter exists in our mock database
        voter = MOCK_VOTERS.get(voter_id)
        if not voter:
            return JsonResponse({
                'success': False,
                'error': 'Invalid Voter ID'
            }, status=404)
        
        # Check if voter has already voted
        if voter.get('has_voted') or voter_id in HAS_VOTED_STORE:
            return JsonResponse({
                'success': False,
                'error': 'You have already voted in this election'
            }, status=403)
        
        # Generate a unique session ID for this login attempt
        session_id = secrets.token_urlsafe(32)
        
        # Create session object
        session = {
            'sessionId': session_id,
            'voterId': voter_id,
            'status': 'pending_biometric',
            'createdAt': datetime.now().isoformat(),
            'expiresAt': (datetime.now() + timedelta(minutes=30)).isoformat()
        }
        
        # Try to store session in DynamoDB
        try:
            dynamodb.put_item('sessions', session)
        except Exception as e:
            # If DynamoDB fails, continue with in-memory session
            print(f"DynamoDB not available: {e}")
        
        # Return success response with session details
        return JsonResponse({
            'success': True,
            'data': {
                'sessionId': session_id,
                'voterId': voter_id,
                'voterName': voter['name'],
                'requiresBiometric': True
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON in request body'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def verify_biometric(request):
    """
    Step 2: Verify biometric data
    Simulates biometric verification (fingerprint + facial recognition).
    In production, this would call Amazon Rekognition for real verification.
    
    Request body:
        {
            "sessionId": "session-uuid",
            "voterId": "VOTER12345",
            "biometricData": {}
        }
    
    Returns:
        {
            "success": true,
            "data": {
                "token": "jwt-token",
                "sessionId": "session-uuid",
                "voterId": "VOTER12345",
                "biometricConfidence": 98.5,
                "message": "Biometric verification successful"
            }
        }
    """
    try:
        # Parse request body
        data = json.loads(request.body)
        session_id = data.get('sessionId')
        voter_id = data.get('voterId')
        
        # Validate required fields
        if not session_id or not voter_id:
            return JsonResponse({
                'success': False,
                'error': 'Session ID and Voter ID are required'
            }, status=400)
        
        # Mock biometric verification
        # In production, this would call Amazon Rekognition API
        # For demo, we always return success with high confidence
        biometric_verified = True
        confidence = 98.5
        
        if not biometric_verified:
            return JsonResponse({
                'success': False,
                'error': 'Biometric verification failed'
            }, status=401)
        
        # Generate JWT token for authenticated session
        token = create_jwt_token(voter_id, session_id)
        
        # Update session status in DynamoDB
        try:
            session_update = {
                'sessionId': session_id,
                'voterId': voter_id,
                'status': 'authenticated',
                'biometricConfidence': confidence,
                'authenticatedAt': datetime.now().isoformat()
            }
            dynamodb.put_item('sessions', session_update)
        except Exception as e:
            print(f"DynamoDB update failed: {e}")
        
        # Return success response with JWT token
        return JsonResponse({
            'success': True,
            'data': {
                'token': token,
                'sessionId': session_id,
                'voterId': voter_id,
                'biometricConfidence': confidence,
                'message': 'Biometric verification successful'
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON in request body'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_current_election(request):
    """
    Get current active election details including all candidates.
    Returns election information and candidate list for voting.
    """
    try:
        # Mock election data
        # In production, this would be fetched from DynamoDB
        election = {
            'electionId': 'ELECTION_2024_01',
            'name': 'General Election 2024',
            'startDate': '2024-01-01T00:00:00Z',
            'endDate': '2024-12-31T23:59:59Z',
            'status': 'active',
            'candidates': [
                {
                    'id': 'CAND_001',
                    'name': 'Narendra Modi',
                    'party': 'BJP',
                    'symbol': 'Lotus',
                    'photo': 'https://via.placeholder.com/150'
                },
                {
                    'id': 'CAND_002',
                    'name': 'Rahul Gandhi',
                    'party': 'INC',
                    'symbol': 'Hand',
                    'photo': 'https://via.placeholder.com/150'
                },
                {
                    'id': 'CAND_003',
                    'name': 'Arvind Kejriwal',
                    'party': 'AAP',
                    'symbol': 'Broom',
                    'photo': 'https://via.placeholder.com/150'
                },
                {
                    'id': 'CAND_004',
                    'name': 'Mamata Banerjee',
                    'party': 'TMC',
                    'symbol': 'Flowers',
                    'photo': 'https://via.placeholder.com/150'
                }
            ]
        }
        
        return JsonResponse({
            'success': True,
            'data': election
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def cast_vote(request):
    """
    Cast a vote for a candidate.
    Requires JWT authentication token in Authorization header.
    Records vote on blockchain (simulated) and generates cryptographic receipt.
    
    Request headers:
        Authorization: Bearer <jwt-token>
    
    Request body:
        {
            "candidateId": "CAND_001",
            "electionId": "ELECTION_2024_01"
        }
    
    Returns:
        {
            "success": true,
            "data": {
                "receiptId": "vote-uuid",
                "voteHash": "sha256-hash",
                "timestamp": "2024-01-01T12:00:00",
                "blockchainTxId": "0x...",
                "message": "Your vote has been recorded successfully"
            }
        }
    """
    try:
        # Extract and verify JWT token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({
                'success': False,
                'error': 'No authentication token provided'
            }, status=401)
        
        token = auth_header.replace('Bearer ', '')
        
        # Verify JWT token and extract voter information
        try:
            payload = verify_jwt_token(token)
            voter_id = payload['voterId']
            session_id = payload['sessionId']
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': 'Invalid or expired token'
            }, status=401)
        
        # Parse request body
        data = json.loads(request.body)
        candidate_id = data.get('candidateId')
        election_id = data.get('electionId')
        
        # Validate required fields
        if not candidate_id or not election_id:
            return JsonResponse({
                'success': False,
                'error': 'Candidate ID and Election ID are required'
            }, status=400)
        
        # Check if voter has already voted
        if voter_id in HAS_VOTED_STORE:
            return JsonResponse({
                'success': False,
                'error': 'You have already voted'
            }, status=403)
        
        # Generate unique vote ID
        vote_id = secrets.token_urlsafe(32)
        timestamp = datetime.now().isoformat()
        
        # Create cryptographic hash for vote integrity
        # This simulates blockchain recording
        vote_data = f"{vote_id}{candidate_id}{timestamp}"
        vote_hash = hashlib.sha256(vote_data.encode()).hexdigest()
        
        # Generate mock blockchain transaction ID
        blockchain_tx_id = '0x' + secrets.token_hex(32)
        
        # Create vote record
        # Note: voterId is NOT stored to maintain voter anonymity
        vote = {
            'voteId': vote_id,
            'electionId': election_id,
            'candidateId': candidate_id,
            'voteHash': vote_hash,
            'timestamp': timestamp,
            'blockchainTxId': blockchain_tx_id,
            'verified': True
        }
        
        # Store vote in DynamoDB
        try:
            dynamodb.put_item('votes', vote)
        except Exception as e:
            # Fallback to in-memory storage
            print(f"DynamoDB not available: {e}")
            VOTES_STORE[vote_id] = vote
        
        # Mark voter as having voted
        HAS_VOTED_STORE.add(voter_id)
        if voter_id in MOCK_VOTERS:
            MOCK_VOTERS[voter_id]['has_voted'] = True
        
        # Generate receipt for voter
        receipt = {
            'receiptId': vote_id,
            'voteHash': vote_hash,
            'timestamp': timestamp,
            'blockchainTxId': blockchain_tx_id,
            'electionId': election_id,
            'verificationUrl': f'https://blockchain-explorer.example.com/tx/{blockchain_tx_id}',
            'message': 'Your vote has been recorded successfully'
        }
        
        return JsonResponse({
            'success': True,
            'data': receipt
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON in request body'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def verify_receipt(request, receipt_id):
    """
    Verify a vote receipt on the blockchain.
    Checks if the vote was recorded and returns verification details.
    
    URL parameter:
        receipt_id: The receipt ID to verify
    
    Returns:
        {
            "success": true,
            "data": {
                "receiptId": "vote-uuid",
                "voteHash": "sha256-hash",
                "timestamp": "2024-01-01T12:00:00",
                "blockchainTxId": "0x...",
                "verified": true,
                "status": "confirmed",
                "confirmations": 12
            }
        }
    """
    try:
        # Try to get vote from DynamoDB
        vote = None
        try:
            vote = dynamodb.get_item('votes', {'voteId': receipt_id})
        except Exception as e:
            # Fallback to in-memory storage
            print(f"DynamoDB not available: {e}")
            vote = VOTES_STORE.get(receipt_id)
        
        if not vote:
            return JsonResponse({
                'success': False,
                'error': 'Receipt not found'
            }, status=404)
        
        # Return verification details
        return JsonResponse({
            'success': True,
            'data': {
                'receiptId': vote['voteId'],
                'voteHash': vote['voteHash'],
                'timestamp': vote['timestamp'],
                'blockchainTxId': vote['blockchainTxId'],
                'verified': vote['verified'],
                'status': 'confirmed',
                'confirmations': 12  # Mock blockchain confirmations
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_voting_stats(request):
    """
    Get voting statistics for the current user.
    Requires JWT authentication.
    """
    try:
        # Extract and verify JWT token
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({
                'success': False,
                'error': 'No authentication token provided'
            }, status=401)
        
        token = auth_header.replace('Bearer ', '')
        
        try:
            payload = verify_jwt_token(token)
            voter_id = payload['voterId']
        except Exception:
            return JsonResponse({
                'success': False,
                'error': 'Invalid or expired token'
            }, status=401)
        
        # Return mock statistics
        stats = {
            'totalVotes': len(VOTES_STORE) or 1247,
            'yourVoteConfirmed': voter_id in HAS_VOTED_STORE,
            'blockchainConfirmations': 12,
            'networkStatus': 'healthy'
        }
        
        return JsonResponse({
            'success': True,
            'data': stats
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_dashboard_stats(request):
    """
    Get comprehensive dashboard statistics for admin panel.
    Returns voting statistics, fraud alerts, system health, and more.
    """
    try:
        # Mock comprehensive statistics for admin dashboard
        stats = {
            'totalVoters': 15420,
            'votescast': 8934,
            'turnoutPercentage': 57.9,
            'activeVotingSessions': 234,
            'fraudAlertsToday': 3,
            'systemUptime': 99.98,
            'averageVotingTime': 142,
            'peakVotesPerHour': 1247,
            
            # Candidate-wise breakdown
            'candidateStats': [
                {'candidateId': 'CAND_001', 'name': 'Narendra Modi', 'party': 'BJP', 'votes': 3821, 'percentage': 42.8},
                {'candidateId': 'CAND_002', 'name': 'Rahul Gandhi', 'party': 'INC', 'votes': 2678, 'percentage': 30.0},
                {'candidateId': 'CAND_003', 'name': 'Arvind Kejriwal', 'party': 'AAP', 'votes': 1567, 'percentage': 17.5},
                {'candidateId': 'CAND_004', 'name': 'Mamata Banerjee', 'party': 'TMC', 'votes': 868, 'percentage': 9.7}
            ],
            
            # Hourly voting trend
            'hourlyTrend': [
                {'hour': '08:00', 'votes': 234},
                {'hour': '09:00', 'votes': 567},
                {'hour': '10:00', 'votes': 892},
                {'hour': '11:00', 'votes': 1247},
                {'hour': '12:00', 'votes': 1089},
                {'hour': '13:00', 'votes': 945},
                {'hour': '14:00', 'votes': 1123},
                {'hour': '15:00', 'votes': 1034},
                {'hour': '16:00', 'votes': 876},
                {'hour': '17:00', 'votes': 927}
            ],
            
            # Recent fraud alerts
            'fraudAlerts': [
                {
                    'id': 'ALERT_001',
                    'timestamp': (datetime.now() - timedelta(hours=2)).isoformat(),
                    'type': 'Multiple Login Attempts',
                    'severity': 'medium',
                    'voterId': 'VOTER***45',
                    'status': 'resolved',
                    'description': 'Same voter ID attempted login from 3 different IPs'
                },
                {
                    'id': 'ALERT_002',
                    'timestamp': (datetime.now() - timedelta(hours=5)).isoformat(),
                    'type': 'Biometric Mismatch',
                    'severity': 'high',
                    'voterId': 'VOTER***89',
                    'status': 'blocked',
                    'description': 'Face recognition confidence below threshold (45%)'
                },
                {
                    'id': 'ALERT_003',
                    'timestamp': (datetime.now() - timedelta(hours=8)).isoformat(),
                    'type': 'Suspicious Timing Pattern',
                    'severity': 'low',
                    'voterId': 'VOTER***23',
                    'status': 'monitoring',
                    'description': 'Vote cast in unusually short time (12 seconds)'
                }
            ],
            
            # System health metrics
            'systemHealth': {
                'apiLatency': 45,
                'databaseLatency': 12,
                'blockchainLatency': 234,
                'cpuUsage': 34.5,
                'memoryUsage': 56.2,
                'activeConnections': 234,
                'errorRate': 0.02
            },
            
            # Geographic distribution
            'geographicStats': [
                {'state': 'Maharashtra', 'votes': 1234, 'percentage': 13.8},
                {'state': 'Uttar Pradesh', 'votes': 1567, 'percentage': 17.5},
                {'state': 'West Bengal', 'votes': 892, 'percentage': 10.0},
                {'state': 'Karnataka', 'votes': 756, 'percentage': 8.5},
                {'state': 'Tamil Nadu', 'votes': 678, 'percentage': 7.6},
                {'state': 'Others', 'votes': 3807, 'percentage': 42.6}
            ]
        }
        
        return JsonResponse({
            'success': True,
            'data': stats,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_recent_votes(request):
    """
    Get recent votes (anonymized).
    Returns list of recent votes without revealing voter identity.
    """
    try:
        # Mock recent votes data
        recent_votes = [
            {
                'voteId': 'VOTE_' + secrets.token_hex(4),
                'timestamp': (datetime.now() - timedelta(seconds=30)).isoformat(),
                'state': 'Maharashtra',
                'verified': True
            },
            {
                'voteId': 'VOTE_' + secrets.token_hex(4),
                'timestamp': (datetime.now() - timedelta(seconds=45)).isoformat(),
                'state': 'Karnataka',
                'verified': True
            },
            {
                'voteId': 'VOTE_' + secrets.token_hex(4),
                'timestamp': (datetime.now() - timedelta(seconds=67)).isoformat(),
                'state': 'Tamil Nadu',
                'verified': True
            }
        ]
        
        return JsonResponse({
            'success': True,
            'data': recent_votes
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_system_logs(request):
    """
    Get system logs for monitoring.
    Returns recent system events and logs.
    """
    try:
        # Mock system logs
        logs = [
            {
                'timestamp': datetime.now().isoformat(),
                'level': 'info',
                'message': 'Vote successfully recorded',
                'service': 'voting-api'
            },
            {
                'timestamp': (datetime.now() - timedelta(minutes=1)).isoformat(),
                'level': 'warning',
                'message': 'High API latency detected',
                'service': 'monitoring'
            },
            {
                'timestamp': (datetime.now() - timedelta(minutes=2)).isoformat(),
                'level': 'info',
                'message': 'Biometric verification successful',
                'service': 'auth-api'
            }
        ]
        
        return JsonResponse({
            'success': True,
            'data': logs
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
