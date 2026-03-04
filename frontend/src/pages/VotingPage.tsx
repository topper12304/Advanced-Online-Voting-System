import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVotingStore } from '../stores/votingStore'
import { useAuthStore } from '../stores/authStore'
import { useAccessibilityStore } from '../stores/accessibilityStore'
import { 
  Vote, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Mic,
  Eye,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import CandidateCard from '../components/CandidateCard'
import VoteConfirmationModal from '../components/VoteConfirmationModal'

export default function VotingPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentStep, setCurrentStep] = useState<'loading' | 'candidates' | 'confirmation' | 'completed'>('loading')
  
  const { user } = useAuthStore()
  const { voiceEnabled } = useAccessibilityStore()
  const {
    currentElection,
    currentSession,
    selectedCandidate,
    hasVoted,
    canVote,
    votingStatus,
    isLoading,
    error,
    loadElection,
    startVotingSession,
    selectCandidate,
    confirmVote,
    checkVotingStatus,
    clearError
  } = useVotingStore()
  
  const navigate = useNavigate()

  useEffect(() => {
    const initializeVoting = async () => {
      if (!user) return

      try {
        // For demo, we'll use a mock election ID
        const mockElectionId = 'election-2024-general'
        
        // Check voting status first
        await checkVotingStatus(user.voterId, mockElectionId)
        
        // Load election details
        await loadElection(mockElectionId)
        
        setCurrentStep('candidates')
      } catch (error) {
        console.error('Failed to initialize voting:', error)
      }
    }

    initializeVoting()
  }, [user, loadElection, checkVotingStatus])

  const handleCandidateSelect = async (candidate: any) => {
    try {
      if (!currentSession) {
        // Start voting session if not already started
        await startVotingSession(currentElection!.electionId)
      }
      
      await selectCandidate(candidate)
      setCurrentStep('confirmation')
    } catch (error) {
      console.error('Failed to select candidate:', error)
    }
  }

  const handleConfirmVote = async () => {
    try {
      const receipt = await confirmVote()
      setCurrentStep('completed')
      
      // Navigate to receipt page after a short delay
      setTimeout(() => {
        navigate(`/receipt/${receipt.receiptId}`)
      }, 2000)
    } catch (error) {
      console.error('Failed to confirm vote:', error)
    }
  }

  const handleVoiceVoting = () => {
    navigate('/vote/voice')
  }

  if (isLoading && currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading election details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Election
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={clearError}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vote Already Cast
          </h2>
          <p className="text-gray-600 mb-6">
            You have already voted in this election. Thank you for participating in democracy!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (!canVote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Vote
          </h2>
          <p className="text-gray-600 mb-6">
            {votingStatus || 'You are not eligible to vote in this election.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vote Successfully Cast!
          </h2>
          <p className="text-gray-600 mb-6">
            Your vote has been securely recorded on the blockchain. 
            You will be redirected to your receipt shortly.
          </p>
          <LoadingSpinner size="md" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentElection?.name || 'General Election 2024'}
            </h1>
            <p className="text-gray-600">
              Constituency: {user?.constituency}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              Session expires in 14:32
            </div>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Authenticated as {user?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Voting Option */}
      {voiceEnabled && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mic className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-medium text-purple-900">
                  Voice-Assisted Voting Available
                </h3>
                <p className="text-sm text-purple-700">
                  Use voice commands to navigate and cast your vote
                </p>
              </div>
            </div>
            <button
              onClick={handleVoiceVoting}
              className="btn-primary bg-purple-600 hover:bg-purple-700"
            >
              Use Voice Interface
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Select Candidate</span>
          <span>Confirm Vote</span>
          <span>Receipt</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: currentStep === 'candidates' ? '33%' : 
                     currentStep === 'confirmation' ? '66%' : '100%' 
            }}
          />
        </div>
      </div>

      {/* Candidate Selection */}
      {currentStep === 'candidates' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Select Your Candidate
            </h2>
            <div className="text-sm text-gray-500">
              {currentElection?.candidates?.length || 0} candidates
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentElection?.candidates?.map((candidate) => (
              <CandidateCard
                key={candidate.candidateId}
                candidate={candidate}
                isSelected={selectedCandidate?.candidateId === candidate.candidateId}
                onSelect={() => handleCandidateSelect(candidate)}
              />
            )) || (
              // Mock candidates for demo
              [
                // Mock candidate data for demonstration purposes
                {
                  candidateId: '1',
                  name: 'Rajesh Kumar',
                  party: 'Democratic Party',
                  symbol: 'DP',
                  constituency: user?.constituency || 'Demo Constituency',
                  biography: 'Experienced leader with 15 years in public service',
                  photoUrl: '/api/placeholder/candidate1.jpg'
                },
                {
                  candidateId: '2',
                  name: 'Priya Sharma',
                  party: 'Progressive Alliance',
                  symbol: 'PA',
                  constituency: user?.constituency || 'Demo Constituency',
                  biography: 'Young leader focused on technology and education',
                  photoUrl: '/api/placeholder/candidate2.jpg'
                },
                {
                  candidateId: '3',
                  name: 'Mohammed Ali',
                  party: 'Unity Party',
                  symbol: 'UP',
                  constituency: user?.constituency || 'Demo Constituency',
                  biography: 'Community organizer with focus on social justice',
                  photoUrl: '/api/placeholder/candidate3.jpg'
                }
              ].map((candidate) => (
                <CandidateCard
                  key={candidate.candidateId}
                  candidate={candidate}
                  isSelected={selectedCandidate?.candidateId === candidate.candidateId}
                  onSelect={() => handleCandidateSelect(candidate)}
                />
              ))
            )}
          </div>

          {selectedCandidate && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setCurrentStep('confirmation')}
                className="btn-primary btn-lg inline-flex items-center"
              >
                Continue to Confirmation
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vote Confirmation */}
      {currentStep === 'confirmation' && selectedCandidate && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirm Your Vote
            </h2>
            <p className="text-gray-600">
              Please review your selection carefully. Once confirmed, your vote cannot be changed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border-2 border-primary-200 p-6 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                {selectedCandidate.symbol}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedCandidate.name}
              </h3>
              <p className="text-gray-600 mb-2">
                {selectedCandidate.party}
              </p>
              <p className="text-sm text-gray-500">
                {selectedCandidate.constituency}
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep('candidates')}
              className="flex-1 btn-secondary inline-flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Candidates
            </button>
            
            <button
              onClick={handleConfirmVote}
              disabled={isLoading}
              className="flex-1 btn-success btn-lg inline-flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Vote className="mr-2 w-5 h-5" />
                  Confirm Vote
                </>
              )}
            </button>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Important Notice
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your vote will be encrypted and recorded on the blockchain. 
                  You will receive a cryptographic receipt that proves your vote 
                  was counted without revealing your choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Help */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/accessibility')}
          className="text-sm text-primary-600 hover:text-primary-500 inline-flex items-center"
        >
          <Eye className="mr-1 w-4 h-4" />
          Need accessibility assistance?
        </button>
      </div>
    </div>
  )
}