import axios, { AxiosInstance } from 'axios'

/**
 * Create axios instance with base configuration
 * This is the main HTTP client for all API requests
 */
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,                    // Base URL for all API endpoints
  timeout: 30000,                           // Request timeout: 30 seconds
  headers: {
    'Content-Type': 'application/json',     // Default content type for requests
  },
})

/**
 * Request interceptor
 * Automatically adds JWT authentication token to all requests
 * This runs before every API request is sent
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response interceptor
 * Handles common error scenarios globally
 * Automatically redirects to login on 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized: Token expired or invalid
      // Clear auth data and redirect to login
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Authentication API endpoints
 * Handles user authentication, token management, and session validation
 */
export const authApi = {
  /**
   * Step 1: Login with Voter ID
   * @param voterId - Voter's unique ID
   * @returns Session ID for biometric verification
   */
  login: (voterId: string) =>
    api.post('/auth/login', { voterId }),
  
  /**
   * Step 2: Verify biometric data
   * @param sessionId - Session ID from login
   * @param voterId - Voter ID
   * @param biometricData - Biometric data (mock for now)
   * @returns JWT token and user information
   */
  verifyBiometric: (sessionId: string, voterId: string, biometricData: any = {}) =>
    api.post('/auth/verify-biometric', { sessionId, voterId, biometricData }),
  
  /**
   * Get current election details
   */
  getCurrentElection: () =>
    api.get('/auth/election/current'),
  
  /**
   * Validate existing JWT token
   * @param token - JWT authentication token
   * @returns User information if token is valid
   */
  validateToken: (token: string) =>
    api.post('/auth/validate', { token }),
  
  /**
   * Logout user and invalidate token on server
   */
  logout: () =>
    api.post('/auth/logout'),
  
  /**
   * Set authentication token in localStorage and API headers
   * @param token - JWT token to store
   */
  setAuthToken: (token: string) => {
    localStorage.setItem('auth-token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  
  /**
   * Clear authentication token from localStorage and API headers
   */
  clearAuthToken: () => {
    localStorage.removeItem('auth-token')
    delete api.defaults.headers.common['Authorization']
  },
}

/**
 * Voting API endpoints
 * Handles the complete voting workflow from session creation to vote confirmation
 */
export const votingApi = {
  /**
   * Get election details including candidates
   * @param electionId - Unique election identifier
   */
  getElection: (electionId: string) =>
    api.get(`/elections/${electionId}`),
  
  /**
   * Cast vote for a candidate
   * @param candidateId - Selected candidate ID
   * @param electionId - Election ID
   * @returns Cryptographic receipt
   */
  castVote: (candidateId: string, electionId: string) =>
    api.post('/voting/cast', { candidateId, electionId }),
  
  /**
   * Verify vote receipt on blockchain
   * @param receiptId - Receipt ID to verify
   * @returns Verification status and blockchain details
   */
  verifyReceipt: (receiptId: string) =>
    api.get(`/voting/verify/${receiptId}`),
  
  /**
   * Get voting statistics
   */
  getStats: () =>
    api.get('/voting/stats'),
}

// Voice AI API
export const voiceApi = {
  processVoiceCommand: (audioData: Blob, sessionId: string) => {
    const formData = new FormData()
    formData.append('audio', audioData)
    formData.append('sessionId', sessionId)
    
    return api.post('/voice/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  getCandidateInfo: (electionId: string, language: string) =>
    api.get(`/voice/candidates/${electionId}`, {
      params: { language },
      responseType: 'blob',
    }),
  
  confirmVoteSelection: (candidateId: string, sessionId: string) =>
    api.post('/voice/confirm', { candidateId, sessionId }),
  
  setLanguage: (sessionId: string, language: string) =>
    api.post('/voice/language', { sessionId, language }),
}

// Biometric API
export const biometricApi = {
  captureFingerprint: () =>
    api.post('/biometric/fingerprint/capture'),
  
  captureFacial: () =>
    api.post('/biometric/facial/capture'),
  
  registerBiometric: (voterId: string, biometricData: any) =>
    api.post('/biometric/register', { voterId, biometricData }),
}

// Admin API
export const adminApi = {
  getDashboardStats: () =>
    api.get('/admin/dashboard/stats'),
  
  getFraudStats: () =>
    api.get('/admin/fraud/stats'),
  
  getElections: () =>
    api.get('/admin/elections'),
  
  createElection: (electionData: any) =>
    api.post('/admin/elections', electionData),
  
  updateElection: (electionId: string, electionData: any) =>
    api.put(`/admin/elections/${electionId}`, electionData),
  
  closeElection: (electionId: string) =>
    api.post(`/admin/elections/${electionId}/close`),
  
  getTallyResults: (electionId: string) =>
    api.get(`/admin/elections/${electionId}/results`),
}

// Accessibility API
export const accessibilityApi = {
  getAccessibilitySettings: () =>
    api.get('/accessibility/settings'),
  
  updateAccessibilitySettings: (settings: any) =>
    api.put('/accessibility/settings', settings),
}

export default api