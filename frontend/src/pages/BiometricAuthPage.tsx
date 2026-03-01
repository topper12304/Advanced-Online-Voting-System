import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fingerprint, Eye, Camera, CheckCircle, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

type AuthStep = 'fingerprint' | 'facial' | 'processing' | 'success' | 'error'

export default function BiometricAuthPage() {
  const [currentStep, setCurrentStep] = useState<AuthStep>('fingerprint')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate biometric capture process
    if (currentStep === 'processing') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            setCurrentStep('success')
            return 100
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(timer)
    }
  }, [currentStep])

  const handleFingerprintCapture = () => {
    // Simulate fingerprint capture
    setTimeout(() => {
      setCurrentStep('facial')
    }, 2000)
  }

  const handleFacialCapture = () => {
    // Simulate facial recognition
    setTimeout(() => {
      setCurrentStep('processing')
    }, 2000)
  }

  const handleSuccess = () => {
    navigate('/vote')
  }

  const handleRetry = () => {
    setCurrentStep('fingerprint')
    setProgress(0)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Fingerprint className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Biometric Authentication
          </h1>
          <p className="text-gray-600">
            Secure multi-factor biometric verification
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className={currentStep === 'fingerprint' ? 'text-primary-600 font-medium' : ''}>
              Fingerprint
            </span>
            <span className={currentStep === 'facial' ? 'text-primary-600 font-medium' : ''}>
              Facial Scan
            </span>
            <span className={currentStep === 'processing' ? 'text-primary-600 font-medium' : ''}>
              Verification
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: currentStep === 'fingerprint' ? '33%' : 
                       currentStep === 'facial' ? '66%' : '100%' 
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Fingerprint Step */}
          {currentStep === 'fingerprint' && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <Fingerprint className="w-16 h-16 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Place Your Finger
              </h2>
              <p className="text-gray-600 mb-6">
                Place your registered finger on the scanner and hold steady
              </p>
              <button
                onClick={handleFingerprintCapture}
                className="btn-primary w-full"
              >
                Start Fingerprint Scan
              </button>
            </div>
          )}

          {/* Facial Recognition Step */}
          {currentStep === 'facial' && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Look at the Camera
              </h2>
              <p className="text-gray-600 mb-6">
                Position your face in the camera frame and look directly ahead
              </p>
              <button
                onClick={handleFacialCapture}
                className="btn-primary w-full"
              >
                Start Facial Recognition
              </button>
            </div>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Verifying Identity
              </h2>
              <p className="text-gray-600 mb-6">
                Processing biometric data and matching against registered templates
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {progress}% complete
              </p>
            </div>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Successful
              </h2>
              <p className="text-gray-600 mb-6">
                Your identity has been verified. You can now proceed to vote.
              </p>
              <button
                onClick={handleSuccess}
                className="btn-success w-full"
              >
                Proceed to Voting
              </button>
            </div>
          )}

          {/* Error Step */}
          {currentStep === 'error' && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'Unable to verify your identity. Please try again.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="btn-primary w-full"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary w-full"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Privacy Protected
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Your biometric data is encrypted and processed locally. 
                No raw biometric data is transmitted or stored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}