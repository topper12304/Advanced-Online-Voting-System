import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()

  // Security features displayed on homepage
  const securityFeatures = [
    {
      title: 'Biometric Lock',
      description: 'Face & ID verification to ensure original voters',
      gradient: 'from-blue-500 to-blue-600',
      icon: 'lock'
    },
    {
      title: 'Blockchain Ledger',
      description: 'Votes are immutable; no one can edit them',
      gradient: 'from-indigo-500 to-indigo-600',
      icon: 'chain'
    },
    {
      title: 'Real-time Fraud Detection',
      description: 'AI monitors suspicious login patterns',
      gradient: 'from-red-500 to-red-600',
      icon: 'alert'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navbar */}
      <nav className="bg-[#1a2b4c] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold">SecureVote</div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="hover:text-[#2563eb] transition-colors">
                How it Works
              </a>
              <a href="#security" className="hover:text-[#2563eb] transition-colors">
                Security
              </a>
              <a href="#results" className="hover:text-[#2563eb] transition-colors">
                Results
              </a>
              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  className="hover:text-[#2563eb] transition-colors"
                >
                  Login
                </Link>
              )}
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Emergency Report
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1a2b4c] to-[#2563eb] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                The Future of Secure Democracy
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Powered by AI & Blockchain to eliminate voter impersonation and ensure every vote counts
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/vote"
                    className="bg-white text-[#1a2b4c] hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center justify-center transition-colors shadow-xl"
                  >
                    Continue Voting →
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-white text-[#1a2b4c] hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center justify-center transition-colors shadow-xl"
                  >
                    Get Started →
                  </Link>
                )}
                <Link
                  to="/accessibility"
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-[#1a2b4c] px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center justify-center transition-colors"
                >
                  Accessibility Options
                </Link>
              </div>
            </div>

            {/* 3D Illustration Placeholder */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-80 h-80">
                {/* Decorative security illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20"></div>
                <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-6xl font-bold text-[#1a2b4c]">SECURE</div>
                </div>
                <div className="absolute top-0 right-0 bg-green-500 rounded-full p-4 shadow-xl">
                  <div className="text-2xl font-bold text-white">✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div id="security" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a2b4c] mb-4">
              Triple-Layer Security System
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your vote is protected by cutting-edge technology at every step
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg text-white text-2xl font-bold`}>
                  {feature.icon === 'lock' ? '🔒' : feature.icon === 'chain' ? '⛓' : '⚠'}
                </div>
                
                <h3 className="text-2xl font-bold text-[#1a2b4c] mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Vote Card */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#1a2b4c] via-[#2563eb] to-[#1e40af] rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm text-4xl font-bold">
                ✓
              </div>
              
              <h3 className="text-4xl font-bold mb-4">
                Cast Your Vote Now
              </h3>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of citizens making their voice heard through our secure, transparent voting platform
              </p>
              
              {isAuthenticated ? (
                <Link
                  to="/vote"
                  className="inline-flex items-center bg-white text-[#1a2b4c] hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Start Voting →
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center bg-white text-[#1a2b4c] hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Get Started →
                </Link>
              )}
              
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-blue-100">
                <div className="flex items-center">
                  ✓ 100% Secure
                </div>
                <div className="flex items-center">
                  ✓ Anonymous
                </div>
                <div className="flex items-center">
                  ✓ Verifiable
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1a2b4c] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure, and transparent voting in three steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563eb] text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-[#1a2b4c] mb-3">
                Verify Identity
              </h3>
              <p className="text-gray-600 text-lg">
                Use biometric authentication to prove you're a registered voter
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563eb] text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-[#1a2b4c] mb-3">
                Cast Your Vote
              </h3>
              <p className="text-gray-600 text-lg">
                Select your candidate and confirm your choice securely
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563eb] text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-[#1a2b4c] mb-3">
                Get Receipt
              </h3>
              <p className="text-gray-600 text-lg">
                Receive cryptographic proof that your vote was recorded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}