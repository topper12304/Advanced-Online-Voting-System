import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../services/api'

/**
 * User interface representing authenticated voter information
 */
interface User {
  voterId: string        // Unique identifier for the voter
  name: string          // Full name of the voter
  constituency: string  // Electoral constituency/district
  isAdmin: boolean      // Flag to identify admin users
}

/**
 * Authentication state management interface
 * Handles user authentication, session management, and token storage
 */
interface AuthState {
  // State properties
  user: User | null              // Currently authenticated user or null if not logged in
  token: string | null           // JWT authentication token for API requests
  isAuthenticated: boolean       // Boolean flag indicating authentication status
  isLoading: boolean            // Loading state for async operations
  
  // Action methods
  login: (credentials: { 
    voterId: string; 
    biometricData: any;
    additionalIdType?: string;
    additionalIdNumber?: string;
    locationData?: any;
    electoralRollStatus?: any;
  }) => Promise<void>  // Authenticate user with biometric data and document verification
  logout: () => void                                                               // Clear authentication and logout user
  checkAuth: () => Promise<void>                                                   // Validate existing token and restore session
  setUser: (user: User) => void                                                    // Update user information
  setToken: (token: string) => void                                                // Update authentication token
}

/**
 * Zustand store for authentication state management
 * Uses persist middleware to save auth state to localStorage
 * This ensures users remain logged in across page refreshes
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      /**
       * Login function - Authenticates user with biometric credentials
       * Now includes multiple ID proof options and electoral roll verification
       * @param credentials - Object containing voterId, biometric data, additional ID, location, and electoral roll status
       * @throws Error if authentication fails
       */
      login: async (credentials) => {
        try {
          set({ isLoading: true })
          
          // Call backend API to verify:
          // 1. Electoral Roll registration (mandatory - name must be in voter list)
          // 2. Voter ID (mandatory)
          // 3. Additional ID proof - user choice (Aadhaar/PAN/DL/Passport/Bank/MNREGA)
          // 4. Biometric data (fingerprint + facial recognition) - mandatory
          // 5. Location data to verify constituency and prevent duplicate voting
          const response = await authApi.authenticate(credentials)
          const { user, token } = response.data
          
          // Update state with authenticated user data
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          // Set JWT token in API headers for subsequent requests
          authApi.setAuthToken(token)
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      /**
       * Logout function - Clears all authentication data
       * Removes token from API headers and localStorage
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        
        // Remove JWT token from API request headers
        authApi.clearAuthToken()
        
        // Clear persisted authentication data from localStorage
        localStorage.removeItem('auth-storage')
      },

      /**
       * Check authentication status - Validates existing token
       * Called on app initialization to restore user session
       * If token is invalid or expired, user is logged out
       */
      checkAuth: async () => {
        const { token } = get()
        
        // No token found, user is not authenticated
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          // Set token in API headers for validation request
          authApi.setAuthToken(token)
          
          // Validate token with backend and get user data
          const response = await authApi.validateToken(token)
          const { user } = response.data
          
          // Token is valid, restore user session
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Token is invalid or expired, logout user
          get().logout()
        }
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',  // localStorage key name
      // Only persist token and user data, not loading states
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)