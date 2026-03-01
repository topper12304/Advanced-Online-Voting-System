import { Routes, Route } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import { useAccessibilityStore } from './stores/accessibilityStore'
import { useLanguageStore } from './stores/languageStore'
import { useEffect } from 'react'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import BiometricAuthPage from './pages/BiometricAuthPage'
import VotingPage from './pages/VotingPage'
import ReceiptPage from './pages/ReceiptPage'
import AdminDashboard from './pages/AdminDashboard'
import AccessibilitySettings from './pages/AccessibilitySettings'
import VoiceVotingPage from './pages/VoiceVotingPage'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const { highContrast, fontSize } = useAccessibilityStore()
  const { currentLanguage, isRTL } = useLanguageStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.classList.toggle('high-contrast', highContrast)
    document.documentElement.style.fontSize = `${fontSize}px`
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = currentLanguage
  }, [highContrast, fontSize, isRTL, currentLanguage])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accessibility" element={<AccessibilitySettings />} />
        
        {/* Authentication routes */}
        <Route 
          path="/auth/biometric" 
          element={
            <ProtectedRoute requireAuth={false}>
              <BiometricAuthPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected voting routes */}
        <Route 
          path="/vote" 
          element={
            <ProtectedRoute>
              <Layout>
                <VotingPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vote/voice" 
          element={
            <ProtectedRoute>
              <Layout>
                <VoiceVotingPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/receipt/:receiptId" 
          element={
            <ProtectedRoute>
              <Layout>
                <ReceiptPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App