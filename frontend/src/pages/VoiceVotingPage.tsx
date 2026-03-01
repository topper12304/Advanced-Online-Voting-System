import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Volume2, ArrowLeft, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

export default function VoiceVotingPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [currentStep, setCurrentStep] = useState<'intro' | 'listening' | 'processing' | 'confirmation'>('intro')
  const navigate = useNavigate()

  const startListening = () => {
    setIsListening(true)
    setCurrentStep('listening')
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript('I want to vote for Rajesh Kumar from Democratic Party')
      setCurrentStep('processing')
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
    setCurrentStep('confirmation')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/vote')}
          className="inline-flex items-center text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="mr-1 w-4 h-4" />
          Back to Visual Voting
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mic className="w-10 h-10 text-purple-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Voice-Assisted Voting
        </h1>

        {currentStep === 'intro' && (
          <div>
            <p className="text-gray-600 mb-8">
              Use voice commands to select and confirm your vote. 
              The system supports 22 Indian languages.
            </p>
            <button
              onClick={startListening}
              className="btn-primary btn-lg inline-flex items-center"
            >
              <Mic className="mr-2 w-5 h-5" />
              Start Voice Voting
            </button>
          </div>
        )}

        {currentStep === 'listening' && (
          <div>
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Mic className="w-16 h-16 text-red-600" />
            </div>
            <p className="text-lg text-gray-900 mb-4">Listening...</p>
            <p className="text-gray-600 mb-8">
              Say "I want to vote for [candidate name]" or ask for candidate information
            </p>
            <button
              onClick={stopListening}
              className="btn-secondary inline-flex items-center"
            >
              <MicOff className="mr-2 w-4 h-4" />
              Stop Listening
            </button>
          </div>
        )}

        {currentStep === 'processing' && (
          <div>
            <LoadingSpinner size="lg" />
            <p className="text-lg text-gray-900 mb-2 mt-4">Processing your request...</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">You said: "{transcript}"</p>
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <p className="text-lg text-gray-900 mb-4">Voice command processed successfully!</p>
            <button
              onClick={() => navigate('/vote')}
              className="btn-primary"
            >
              Continue to Confirmation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}