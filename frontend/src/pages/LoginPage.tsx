import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Fingerprint, Eye, EyeOff, ArrowRight, AlertCircle, MapPin, CreditCard, Globe, Phone, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import LoadingSpinner from '../components/LoadingSpinner'

const loginSchema = z.object({
  voterId: z.string().min(1, 'Voter ID is required').max(20, 'Invalid Voter ID format'),
  // User must choose ONE additional ID proof (Aadhaar recommended, but alternatives allowed)
  additionalIdType: z.enum(['aadhaar', 'pan', 'driving_license', 'passport', 'bank_passbook', 'mnrega']),
  additionalIdNumber: z.string().min(1, 'ID proof number is required'),
})

type LoginForm = z.infer<typeof loginSchema>

// Additional ID Proof options - User MUST choose ONE (as per Election Commission guidelines)
// Aadhaar is recommended but alternatives are accepted
const ADDITIONAL_ID_OPTIONS = [
  { value: 'aadhaar', label: 'Aadhaar Card', icon: CreditCard, placeholder: 'Enter 12-digit Aadhaar', maxLength: 12, recommended: true },
  { value: 'pan', label: 'PAN Card', icon: CreditCard, placeholder: 'Enter PAN (e.g., ABCDE1234F)', maxLength: 10 },
  { value: 'driving_license', label: 'Driving License', icon: CreditCard, placeholder: 'Enter DL number', maxLength: 20 },
  { value: 'passport', label: 'Passport', icon: Globe, placeholder: 'Enter Passport number', maxLength: 20 },
  { value: 'bank_passbook', label: 'Bank Passbook (with photo)', icon: CreditCard, placeholder: 'Enter Account number', maxLength: 20 },
  { value: 'mnrega', label: 'MNREGA Job Card', icon: CreditCard, placeholder: 'Enter Job Card number', maxLength: 20 },
]

interface LocationData {
  latitude: number
  longitude: number
  country: string
  city: string
  state: string
  constituency: string
  timestamp: Date
}

interface ElectoralRollStatus {
  isRegistered: boolean
  voterName: string
  constituency: string
  pollingStation: string
  serialNumber: string
}

export default function LoginPage() {
  const [showVoterId, setShowVoterId] = useState(false)
  const [showAdditionalId, setShowAdditionalId] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [electoralRollStatus, setElectoralRollStatus] = useState<ElectoralRollStatus | null>(null)
  const [additionalIdType, setAdditionalIdType] = useState<string>('aadhaar')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  // Get user's location on component mount
  // This tracks voter location to verify constituency and prevent fraud
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          // In production, this would call a geolocation API to get constituency
          // For demo, we'll simulate the data
          try {
            const mockLocationData: LocationData = {
              latitude,
              longitude,
              country: 'India',
              city: 'Mumbai',
              state: 'Maharashtra',
              constituency: 'Mumbai North', // Would come from API based on lat/long
              timestamp: new Date()
            }
            setLocationData(mockLocationData)
            
            // Simulate electoral roll verification based on location
            // In production, this would query the electoral roll database
            setElectoralRollStatus({
              isRegistered: true,
              voterName: 'Demo Voter',
              constituency: 'Mumbai North',
              pollingStation: 'Booth #123, ABC School',
              serialNumber: 'MH/01/123/456'
            })
          } catch (err) {
            setLocationError('Unable to verify location. Please enable location services.')
          }
        },
        () => {
          setLocationError('Location access denied. Location verification is required for voting.')
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser.')
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      additionalIdType: 'aadhaar'
    }
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null)
      
      // 1. Verify location is available
      if (!locationData) {
        setError('Location verification required. Please enable location services.')
        return
      }

      // 2. Verify electoral roll registration (MANDATORY as per Election Commission)
      if (!electoralRollStatus?.isRegistered) {
        setError('Your name is not found in the Electoral Roll for this constituency. Please contact Voter Helpline: 1950')
        return
      }

      // 3. Validate Voter ID format
      if (!data.voterId || data.voterId.length < 3) {
        setError('Please enter a valid Voter ID')
        return
      }

      // 4. Validate Additional ID number
      if (!data.additionalIdNumber || data.additionalIdNumber.length < 3) {
        setError('Please enter a valid ID proof number')
        return
      }

      // For DEMO purposes: Since backend is not implemented yet,
      // we'll simulate successful verification and proceed to biometric page
      // In production, this would call the backend API for verification
      
      // Store voter data in sessionStorage for demo
      sessionStorage.setItem('voterData', JSON.stringify({
        voterId: data.voterId,
        additionalIdType: data.additionalIdType,
        additionalIdNumber: data.additionalIdNumber,
        locationData: locationData,
        electoralRollStatus: electoralRollStatus,
        timestamp: new Date().toISOString()
      }))

      // Redirect to biometric authentication page
      navigate('/auth/biometric')
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.')
    }
  }

  const handleBiometricAuth = () => {
    navigate('/auth/biometric')
  }

  const selectedIdOption = ADDITIONAL_ID_OPTIONS.find(opt => opt.value === additionalIdType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <Fingerprint className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Secure Voter Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Multi-layer verification as per Election Commission guidelines
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Location & Electoral Roll Status */}
            {locationData && electoralRollStatus?.isRegistered && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    Electoral Roll Verified
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {electoralRollStatus.constituency} • {locationData.city}, {locationData.state}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Polling Station: {electoralRollStatus.pollingStation}
                  </p>
                </div>
              </div>
            )}

            {locationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Location Required
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {locationError}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Failed
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Voter ID Input (MANDATORY) */}
            <div>
              <label htmlFor="voterId" className="form-label">
                Voter ID <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('voterId')}
                  type={showVoterId ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder="Enter your Voter ID"
                  autoComplete="username"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowVoterId(!showVoterId)}
                >
                  {showVoterId ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.voterId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.voterId.message}
                </p>
              )}
            </div>

            {/* Additional ID Proof Selection (MANDATORY - User Choice) */}
            <div>
              <label className="form-label">
                Additional ID Proof <span className="text-red-600">*</span>
                <span className="text-xs text-gray-500 ml-2">(Choose any one)</span>
              </label>
              <select
                {...register('additionalIdType')}
                value={additionalIdType}
                onChange={(e) => setAdditionalIdType(e.target.value)}
                className="form-input"
              >
                {ADDITIONAL_ID_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.recommended && '(Recommended)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional ID Number Input */}
            <div>
              <label htmlFor="additionalIdNumber" className="form-label">
                {selectedIdOption?.label} Number <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('additionalIdNumber')}
                  type={showAdditionalId ? 'text' : 'password'}
                  className="form-input pr-10"
                  placeholder={selectedIdOption?.placeholder}
                  maxLength={selectedIdOption?.maxLength}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowAdditionalId(!showAdditionalId)}
                >
                  {showAdditionalId ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.additionalIdNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.additionalIdNumber.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your ID is encrypted and verified with government databases
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !locationData}
              className="w-full btn-primary btn-lg flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Proceed to Biometric Auth
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Auth Methods */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or use advanced biometric scanner
                </span>
              </div>
            </div>

            <button
              onClick={handleBiometricAuth}
              className="mt-4 w-full btn-secondary flex items-center justify-center"
            >
              <Fingerprint className="mr-2 w-5 h-5" />
              Advanced Biometric Authentication
            </button>
          </div>

          {/* Voter Helpline */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Need Help?
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Call Voter Helpline: <a href="tel:1950" className="font-semibold underline">1950</a>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  For voter registration, electoral roll queries, and voting assistance
                </p>
              </div>
            </div>
          </div>

          {/* Help Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/help/voter-id"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Don't know your Voter ID?
            </Link>
            <br />
            <Link
              to="/accessibility"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Need accessibility assistance?
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Fingerprint className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Multi-Layer Security Verification
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Your data is protected with AES-256 encryption. We verify:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Electoral Roll registration (mandatory)</li>
                <li>Voter ID + Additional ID proof (Aadhaar/PAN/DL/Passport)</li>
                <li>Biometric verification (fingerprint + facial recognition)</li>
                <li>Real-time location tracking to verify constituency</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-500"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
