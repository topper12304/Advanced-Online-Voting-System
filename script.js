// Application State
const state = {
    currentUser: null,
    sessionId: null,
    selectedCandidate: null,
    hasVoted: false,
    receipt: null
};

// Mock Data
const MOCK_VOTERS = {
    'VOTER12345': { name: 'Rahul Kumar', aadhaar: '1234-5678-9012' },
    'VOTER67890': { name: 'Priya Sharma', aadhaar: '9876-5432-1098' },
    'TEST123': { name: 'Test User', aadhaar: '1111-2222-3333' }
};

const CANDIDATES = [
    {
        id: 'CAND_001',
        name: 'Narendra Modi',
        party: 'BJP',
        symbol: '🪷',
        photo: '👨‍💼'
    },
    {
        id: 'CAND_002',
        name: 'Rahul Gandhi',
        party: 'INC',
        symbol: '✋',
        photo: '👨‍💼'
    },
    {
        id: 'CAND_003',
        name: 'Arvind Kejriwal',
        party: 'AAP',
        symbol: '🧹',
        photo: '👨‍💼'
    },
    {
        id: 'CAND_004',
        name: 'Mamata Banerjee',
        party: 'TMC',
        symbol: '🌸',
        photo: '👩‍💼'
    }
];

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function showHome() {
    showPage('homePage');
}

function showAbout() {
    alert('About: This is a secure online voting system with biometric authentication, blockchain technology, and voice AI support.');
}

function showLogin() {
    showPage('loginPage');
}

function showAccessibility() {
    showPage('accessibilityPage');
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    const voterId = document.getElementById('voterId').value.trim();
    
    if (!MOCK_VOTERS[voterId]) {
        alert('Invalid Voter ID. Please try: VOTER12345, VOTER67890, or TEST123');
        return;
    }
    
    if (state.hasVoted) {
        alert('You have already voted in this election!');
        return;
    }
    
    state.currentUser = {
        voterId: voterId,
        ...MOCK_VOTERS[voterId]
    };
    state.sessionId = generateSessionId();
    
    showPage('biometricPage');
    simulateBiometricScan();
}

// Biometric Verification
function simulateBiometricScan() {
    const statusDiv = document.getElementById('biometricStatus');
    statusDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Scanning biometric data...</p>
    `;
    
    setTimeout(() => {
        statusDiv.innerHTML = `
            <div style="color: var(--success); font-size: 3rem;">✓</div>
            <p style="color: var(--success); font-weight: 600;">Biometric verification successful!</p>
            <p>Confidence: 98.5%</p>
        `;
    }, 2000);
}

function verifyBiometric() {
    showPage('votingPage');
    loadCandidates();
}

// Load Candidates
function loadCandidates() {
    const grid = document.getElementById('candidatesGrid');
    grid.innerHTML = CANDIDATES.map(candidate => `
        <div class="candidate-card" onclick="selectCandidate('${candidate.id}')">
            <div class="candidate-photo">${candidate.photo}</div>
            <div class="candidate-name">${candidate.name}</div>
            <div class="candidate-party">${candidate.party}</div>
            <div class="candidate-symbol">${candidate.symbol}</div>
            <button class="btn btn-primary">Vote for ${candidate.name}</button>
        </div>
    `).join('');
}

// Candidate Selection
function selectCandidate(candidateId) {
    state.selectedCandidate = CANDIDATES.find(c => c.id === candidateId);
    
    const modal = document.getElementById('confirmModal');
    const selectedDiv = document.getElementById('selectedCandidate');
    
    selectedDiv.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${state.selectedCandidate.photo}</div>
        <div style="font-size: 1.5rem; font-weight: 700;">${state.selectedCandidate.name}</div>
        <div style="color: var(--text-muted);">${state.selectedCandidate.party}</div>
        <div style="font-size: 2rem; margin-top: 0.5rem;">${state.selectedCandidate.symbol}</div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

// Submit Vote
function submitVote() {
    closeModal();
    
    // Show loading
    const votingPage = document.getElementById('votingPage');
    votingPage.innerHTML = `
        <div class="container" style="text-align: center; padding: 4rem 0;">
            <div class="spinner" style="margin: 0 auto 2rem;"></div>
            <h2>Recording your vote on blockchain...</h2>
            <p style="color: var(--text-muted);">Please wait while we securely record your vote</p>
        </div>
    `;
    
    // Simulate blockchain recording
    setTimeout(() => {
        state.hasVoted = true;
        state.receipt = generateReceipt();
        showReceipt();
    }, 3000);
}

// Generate Receipt
function generateReceipt() {
    const timestamp = new Date().toISOString();
    const voteId = generateVoteId();
    const voteHash = generateHash(voteId + state.selectedCandidate.id + timestamp);
    const blockchainTxId = '0x' + generateHash(voteId).substring(0, 32);
    
    return {
        receiptId: voteId,
        voteHash: voteHash,
        timestamp: timestamp,
        blockchainTxId: blockchainTxId,
        electionId: 'ELECTION_2024_01',
        verified: true
    };
}

function showReceipt() {
    const detailsDiv = document.getElementById('receiptDetails');
    detailsDiv.innerHTML = `
        <div class="receipt-item">
            <span class="receipt-label">Receipt ID:</span>
            <span class="receipt-value">${state.receipt.receiptId}</span>
        </div>
        <div class="receipt-item">
            <span class="receipt-label">Vote Hash:</span>
            <span class="receipt-value">${state.receipt.voteHash.substring(0, 16)}...</span>
        </div>
        <div class="receipt-item">
            <span class="receipt-label">Blockchain TX:</span>
            <span class="receipt-value">${state.receipt.blockchainTxId.substring(0, 16)}...</span>
        </div>
        <div class="receipt-item">
            <span class="receipt-label">Timestamp:</span>
            <span class="receipt-value">${new Date(state.receipt.timestamp).toLocaleString()}</span>
        </div>
        <div class="receipt-item">
            <span class="receipt-label">Election ID:</span>
            <span class="receipt-value">${state.receipt.electionId}</span>
        </div>
        <div class="receipt-item">
            <span class="receipt-label">Status:</span>
            <span class="receipt-value" style="color: var(--success); font-weight: 600;">✓ Verified</span>
        </div>
    `;
    
    showPage('receiptPage');
}

function downloadReceipt() {
    const receiptText = `
VOTING RECEIPT
==============

Receipt ID: ${state.receipt.receiptId}
Vote Hash: ${state.receipt.voteHash}
Blockchain TX: ${state.receipt.blockchainTxId}
Timestamp: ${new Date(state.receipt.timestamp).toLocaleString()}
Election ID: ${state.receipt.electionId}
Status: Verified

This receipt proves your vote was recorded on the blockchain.
Keep this receipt for verification purposes.

Generated by SecureVote System
    `.trim();
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-receipt-${state.receipt.receiptId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Utility Functions
function generateSessionId() {
    return 'SESSION_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateVoteId() {
    return 'VOTE_' + Math.random().toString(36).substring(2, 15).toUpperCase();
}

function generateHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
}

// Admin Dashboard
function showAdmin() {
    showPage('adminPage');
    loadAdminStats();
}

function loadAdminStats() {
    const statsGrid = document.getElementById('statsGrid');
    const stats = {
        totalVoters: 15420,
        votesCast: 8934,
        turnout: 57.9,
        activeSessions: 234,
        fraudAlerts: 3,
        systemUptime: 99.98
    };
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.totalVoters.toLocaleString()}</div>
            <div class="stat-label">Total Voters</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.votesCast.toLocaleString()}</div>
            <div class="stat-label">Votes Cast</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.turnout}%</div>
            <div class="stat-label">Turnout</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.activeSessions}</div>
            <div class="stat-label">Active Sessions</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--warning);">${stats.fraudAlerts}</div>
            <div class="stat-label">Fraud Alerts</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: var(--success);">${stats.systemUptime}%</div>
            <div class="stat-label">System Uptime</div>
        </div>
    `;
}

// Accessibility Features
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

function increaseFontSize() {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).fontSize);
    root.style.fontSize = (currentSize + 2) + 'px';
}

function decreaseFontSize() {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).fontSize);
    if (currentSize > 12) {
        root.style.fontSize = (currentSize - 2) + 'px';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🗳️ SecureVote System Initialized', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%cDemo Voter IDs:', 'color: #10b981; font-weight: bold;');
    console.log('  • VOTER12345 - Rahul Kumar');
    console.log('  • VOTER67890 - Priya Sharma');
    console.log('  • TEST123 - Test User');
    console.log('%cFeatures:', 'color: #f59e0b; font-weight: bold;');
    console.log('  ✓ Biometric Authentication');
    console.log('  ✓ Blockchain Recording');
    console.log('  ✓ Cryptographic Receipts');
    console.log('  ✓ Admin Dashboard');
    console.log('  ✓ Accessibility Settings');
    
    showHome();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });
});
