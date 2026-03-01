import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useLanguageStore } from '../stores/languageStore'
import { useAccessibilityStore } from '../stores/accessibilityStore'
import { 
  LogOut, 
  Settings, 
  Volume2, 
  Eye, 
  Globe,
  Shield,
  Vote
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const { currentLanguage, setLanguage, getAllLanguages } = useLanguageStore()
  const { voiceEnabled, toggleVoiceEnabled } = useAccessibilityStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const languages = getAllLanguages()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Advanced Voting System
                </h1>
                <p className="text-sm text-gray-500">
                  Secure Democratic Elections
                </p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={currentLanguage}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Select Language"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
                <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Voice Toggle */}
              <button
                onClick={toggleVoiceEnabled}
                className={`p-2 rounded-lg transition-colors ${
                  voiceEnabled 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
                title={voiceEnabled ? 'Voice Enabled' : 'Voice Disabled'}
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* Accessibility Settings */}
              <Link
                to="/accessibility"
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Accessibility Settings"
                title="Accessibility Settings"
              >
                <Eye className="w-5 h-5" />
              </Link>

              {/* User Menu */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.constituency}
                    </p>
                  </div>
                  
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                      aria-label="Admin Dashboard"
                      title="Admin Dashboard"
                    >
                      <Shield className="w-5 h-5" />
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 Advanced Voting System. Secure, Accessible, Transparent.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link 
                to="/privacy" 
                className="hover:text-gray-700 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/security" 
                className="hover:text-gray-700 transition-colors"
              >
                Security
              </Link>
              <Link 
                to="/help" 
                className="hover:text-gray-700 transition-colors"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}