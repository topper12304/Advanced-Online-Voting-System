"""
Authentication Helper Functions
Provides JWT token creation and verification utilities.
"""

import jwt
from datetime import datetime, timedelta
from django.conf import settings


def create_jwt_token(voter_id, session_id):
    """
    Create a JWT token for authenticated user.
    
    Args:
        voter_id (str): Unique voter identifier
        session_id (str): Current session identifier
    
    Returns:
        str: Encoded JWT token
    """
    # Set token expiration time
    expiration = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    
    # Create payload with user information
    payload = {
        'voterId': voter_id,
        'sessionId': session_id,
        'exp': expiration,
        'iat': datetime.utcnow()
    }
    
    # Encode and return JWT token
    token = jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return token


def verify_jwt_token(token):
    """
    Verify and decode a JWT token.
    
    Args:
        token (str): JWT token to verify
    
    Returns:
        dict: Decoded token payload
    
    Raises:
        jwt.ExpiredSignatureError: If token has expired
        jwt.InvalidTokenError: If token is invalid
    """
    try:
        # Decode and verify token
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')
