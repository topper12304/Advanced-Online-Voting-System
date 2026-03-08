// Mock API for demo/production without backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_VOTERS: Record<string, any> = {
  'VOTER12345': { 
    id: 'VOTER12345', 
    name: 'Rahul Kumar', 
    aadhaar: '1234-5678-9012',
    hasVoted: false 
  },
  'VOTER67890': { 
    id: 'VOTER67890', 
    name: 'Priya Sharma', 
    aadhaar: '9876-5432-1098',
    hasVoted: false 
  },
  'TEST123': { 
    id: 'TEST123', 
    name: 'Test User', 
    aadhaar: '1111-2222-3333',
    hasVoted: false 
  },
};

const MOCK_ELECTION = {
  id: 'ELECTION_2024',
  name: 'General Election 2024',
  description: 'National Parliamentary Elections',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'active',
};

const MOCK_CANDIDATES = [
  {
    id: 'CAND_001',
    name: 'Narendra Modi',
    party: 'Bharatiya Janata Party',
    symbol: 'Lotus',
    description: 'Prime Minister candidate',
  },
  {
    id: 'CAND_002',
    name: 'Rahul Gandhi',
    party: 'Indian National Congress',
    symbol: 'Hand',
    description: 'Opposition leader',
  },
  {
    id: 'CAND_003',
    name: 'Arvind Kejriwal',
    party: 'Aam Aadmi Party',
    symbol: 'Broom',
    description: 'Delhi Chief Minister',
  },
  {
    id: 'CAND_004',
    name: 'Mamata Banerjee',
    party: 'All India Trinamool Congress',
    symbol: 'Flower',
    description: 'West Bengal Chief Minister',
  },
];

let sessionStore: Record<string, any> = {};
let voteStore: Record<string, any> = {};

export const mockAuthApi = {
  login: async (voterId: string) => {
    await delay(500);
    
    const voter = MOCK_VOTERS[voterId];
    if (!voter) {
      throw new Error('Invalid Voter ID');
    }
    
    if (voter.hasVoted) {
      throw new Error('You have already voted');
    }
    
    const sessionId = `SESSION_${Date.now()}`;
    sessionStore[sessionId] = { voterId, voter, timestamp: Date.now() };
    
    return {
      data: {
        sessionId,
        message: 'Please proceed to biometric verification',
      }
    };
  },
  
  verifyBiometric: async (sessionId: string, voterId: string) => {
    await delay(2000); // Simulate biometric scan
    
    const session = sessionStore[sessionId];
    if (!session || session.voterId !== voterId) {
      throw new Error('Invalid session');
    }
    
    const token = `TOKEN_${Date.now()}_${voterId}`;
    
    return {
      data: {
        token,
        user: session.voter,
        election: MOCK_ELECTION,
      }
    };
  },
  
  getCurrentElection: async () => {
    await delay(300);
    return {
      data: MOCK_ELECTION,
    };
  },
  
  validateToken: async (token: string) => {
    await delay(200);
    const voterId = token.split('_')[2];
    const voter = MOCK_VOTERS[voterId];
    
    if (!voter) {
      throw new Error('Invalid token');
    }
    
    return {
      data: {
        user: voter,
        election: MOCK_ELECTION,
      }
    };
  },
  
  logout: async () => {
    await delay(200);
    return { data: { message: 'Logged out successfully' } };
  },
  
  setAuthToken: (token: string) => {
    localStorage.setItem('auth-token', token);
  },
  
  clearAuthToken: () => {
    localStorage.removeItem('auth-token');
  },
};

export const mockVotingApi = {
  getElection: async (electionId: string) => {
    await delay(300);
    return {
      data: {
        ...MOCK_ELECTION,
        candidates: MOCK_CANDIDATES,
      }
    };
  },
  
  castVote: async (candidateId: string, electionId: string) => {
    await delay(1500); // Simulate blockchain recording
    
    const token = localStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const voterId = token.split('_')[2];
    const voter = MOCK_VOTERS[voterId];
    
    if (!voter) {
      throw new Error('Invalid voter');
    }
    
    if (voter.hasVoted) {
      throw new Error('Already voted');
    }
    
    // Mark as voted
    voter.hasVoted = true;
    
    const receiptId = `RECEIPT_${Date.now()}`;
    const blockchainHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    voteStore[receiptId] = {
      receiptId,
      voterId,
      candidateId,
      electionId,
      timestamp: new Date().toISOString(),
      blockchainHash,
      verified: true,
    };
    
    return {
      data: {
        receipt: voteStore[receiptId],
        message: 'Vote recorded successfully',
      }
    };
  },
  
  verifyReceipt: async (receiptId: string) => {
    await delay(800);
    
    const receipt = voteStore[receiptId];
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    
    return {
      data: {
        ...receipt,
        blockchainVerified: true,
        confirmations: 6,
      }
    };
  },
  
  getStats: async () => {
    await delay(400);
    
    const totalVotes = Object.values(voteStore).length;
    const totalVoters = Object.keys(MOCK_VOTERS).length;
    
    return {
      data: {
        totalVotes,
        totalVoters,
        turnoutPercentage: ((totalVotes / totalVoters) * 100).toFixed(2),
        activeElections: 1,
      }
    };
  },
};

export const mockVoiceApi = {
  processVoiceCommand: async () => {
    await delay(1000);
    return { data: { command: 'recognized', action: 'vote' } };
  },
  
  getCandidateInfo: async () => {
    await delay(500);
    return { data: new Blob(['Mock audio data']) };
  },
  
  confirmVoteSelection: async () => {
    await delay(500);
    return { data: { confirmed: true } };
  },
  
  setLanguage: async () => {
    await delay(300);
    return { data: { language: 'set' } };
  },
};

export const mockBiometricApi = {
  captureFingerprint: async () => {
    await delay(1500);
    return { data: { captured: true, quality: 95 } };
  },
  
  captureFacial: async () => {
    await delay(2000);
    return { data: { captured: true, confidence: 98 } };
  },
  
  registerBiometric: async () => {
    await delay(1000);
    return { data: { registered: true } };
  },
};

export const mockAdminApi = {
  getDashboardStats: async () => {
    await delay(500);
    return {
      data: {
        totalVoters: Object.keys(MOCK_VOTERS).length,
        votescast: Object.keys(voteStore).length,
        turnout: ((Object.keys(voteStore).length / Object.keys(MOCK_VOTERS).length) * 100).toFixed(2),
        activeElections: 1,
        suspiciousActivities: 0,
        systemHealth: 98,
      }
    };
  },
  
  getFraudStats: async () => {
    await delay(400);
    return {
      data: {
        totalAttempts: 0,
        blockedAttempts: 0,
        suspiciousIPs: [],
      }
    };
  },
  
  getElections: async () => {
    await delay(300);
    return {
      data: [MOCK_ELECTION],
    };
  },
  
  createElection: async () => {
    await delay(500);
    return { data: { created: true } };
  },
  
  updateElection: async () => {
    await delay(500);
    return { data: { updated: true } };
  },
  
  closeElection: async () => {
    await delay(500);
    return { data: { closed: true } };
  },
  
  getTallyResults: async () => {
    await delay(800);
    return {
      data: {
        results: MOCK_CANDIDATES.map(c => ({
          ...c,
          votes: Math.floor(Math.random() * 100),
        })),
      }
    };
  },
};

export const mockAccessibilityApi = {
  getAccessibilitySettings: async () => {
    await delay(200);
    return {
      data: {
        fontSize: 'medium',
        highContrast: false,
        screenReader: false,
      }
    };
  },
  
  updateAccessibilitySettings: async (settings: any) => {
    await delay(300);
    return { data: settings };
  },
};
