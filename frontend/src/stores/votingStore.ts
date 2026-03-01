import { create } from 'zustand'
import { votingApi } from '../services/api'

/**
 * Candidate information interface
 * Represents a political candidate in an election
 */
interface Candidate {
  candidateId: string    // Unique identifier for the candidate
  name: string          // Full name of the candidate
  party: string         // Political party affiliation
  symbol: string        // Electoral symbol (emoji/icon)
  constituency: string  // Electoral district
  biography: string     // Brief background information
  photoUrl: string      // URL to candidate's photograph
}

/**
 * Election information interface
 * Represents an electoral event with multiple candidates
 */
interface Election {
  electionId: string                                              // Unique election identifier
  name: string                                                    // Election name/title
  type: 'GENERAL' | 'STATE' | 'LOCAL' | 'REFERENDUM'            // Type of election
  startTime: Date                                                 // Election start date/time
  endTime: Date                                                   // Election end date/time
  candidates: Candidate[]                                         // List of candidates
  status: 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'TALLYING' | 'COMPLETED'  // Current election status
}

/**
 * Voting session interface
 * Represents an active voting session for a voter
 * Sessions expire after a set time for security
 */
interface VotingSession {
  sessionId: string           // Unique session identifier
  voterId: string            // ID of the voter
  electionId: string         // ID of the election
  startTime: Date            // When session was created
  expiresAt: Date            // Session expiration time (typically 15 minutes)
  currentSelection?: string  // Currently selected candidate ID
  state: 'ACTIVE' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'  // Session state
}

/**
 * Vote receipt interface
 * Cryptographic proof that vote was recorded on blockchain
 * Does not reveal the vote choice (zero-knowledge proof)
 */
interface VoteReceipt {
  receiptId: string          // Unique receipt identifier
  commitment: string         // Cryptographic commitment (hash of encrypted vote)
  timestamp: Date            // When vote was recorded
  verificationUrl: string    // URL to verify vote on blockchain explorer
  blockReceipt: {
    blockIndex: number       // Block number in blockchain
    voteIndex: number        // Position of vote within the block
    merkleProof: string[]    // Merkle tree proof for verification
  }
}

interface VotingState {
  // Current state
  currentElection: Election | null
  currentSession: VotingSession | null
  selectedCandidate: Candidate | null
  receipt: VoteReceipt | null
  isLoading: boolean
  error: string | null
  
  // Voting flow
  hasVoted: boolean
  canVote: boolean
  votingStatus: string | null
  
  // Actions
  loadElection: (electionId: string) => Promise<void>
  startVotingSession: (electionId: string) => Promise<void>
  selectCandidate: (candidate: Candidate) => Promise<void>
  confirmVote: () => Promise<void>
  cancelSession: () => Promise<void>
  checkVotingStatus: (voterId: string, electionId: string) => Promise<void>
  verifyReceipt: (receiptId: string) => Promise<void>
  clearError: () => void
  reset: () => void
}

export const useVotingStore = create<VotingState>((set, get) => ({
  // Initial state
  currentElection: null,
  currentSession: null,
  selectedCandidate: null,
  receipt: null,
  isLoading: false,
  error: null,
  hasVoted: false,
  canVote: false,
  votingStatus: null,

  // Actions
  loadElection: async (electionId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await votingApi.getElection(electionId)
      const election = response.data
      
      set({ 
        currentElection: election,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to load election',
        isLoading: false 
      })
    }
  },

  startVotingSession: async (electionId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await votingApi.startVotingSession(electionId)
      const session = response.data
      
      set({ 
        currentSession: session,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to start voting session',
        isLoading: false 
      })
      throw error
    }
  },

  selectCandidate: async (candidate: Candidate) => {
    const { currentSession } = get()
    if (!currentSession) {
      throw new Error('No active voting session')
    }

    try {
      set({ isLoading: true, error: null })
      
      await votingApi.selectCandidate(currentSession.sessionId, candidate.candidateId)
      
      set({ 
        selectedCandidate: candidate,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to select candidate',
        isLoading: false 
      })
      throw error
    }
  },

  confirmVote: async () => {
    const { currentSession } = get()
    if (!currentSession) {
      throw new Error('No active voting session')
    }

    try {
      set({ isLoading: true, error: null })
      
      const response = await votingApi.confirmVote(currentSession.sessionId)
      const { receipt } = response.data
      
      set({ 
        receipt,
        hasVoted: true,
        currentSession: { ...currentSession, state: 'CONFIRMED' },
        isLoading: false 
      })
      
      return receipt
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to confirm vote',
        isLoading: false 
      })
      throw error
    }
  },

  cancelSession: async () => {
    const { currentSession } = get()
    if (!currentSession) return

    try {
      await votingApi.cancelSession(currentSession.sessionId)
      
      set({ 
        currentSession: null,
        selectedCandidate: null 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to cancel session'
      })
    }
  },

  checkVotingStatus: async (voterId: string, electionId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await votingApi.getVotingStatus(voterId, electionId)
      const { hasVoted, canVote, reason } = response.data
      
      set({ 
        hasVoted,
        canVote,
        votingStatus: reason,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to check voting status',
        isLoading: false 
      })
    }
  },

  verifyReceipt: async (receiptId: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const response = await votingApi.verifyReceipt(receiptId)
      const receipt = response.data
      
      set({ 
        receipt,
        isLoading: false 
      })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to verify receipt',
        isLoading: false 
      })
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    currentElection: null,
    currentSession: null,
    selectedCandidate: null,
    receipt: null,
    isLoading: false,
    error: null,
    hasVoted: false,
    canVote: false,
    votingStatus: null,
  }),
}))