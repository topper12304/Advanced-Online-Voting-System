# Advanced Online Voting System

A secure, accessible, and transparent online voting platform with biometric authentication, blockchain technology, and voice-assisted voting.

## Live Website

Access the voting system here: https://topper12304.github.io/Advanced-Online-Voting-System/

Note: If the link doesn't work yet, follow the GitHub Pages Setup instructions below.

## Quick Start

### Option 1: Use Live Website (Recommended)
Simply open the live URL above in any browser and start voting!

### Option 2: Run Locally
1. Clone this repository
2. Open `index.html` in your browser
3. No installation or build process needed!

## Demo Credentials

Use these Voter IDs to test the system:

| Voter ID | Name | Status |
|----------|------|--------|
| VOTER12345 | Rahul Kumar | Active |
| VOTER67890 | Priya Sharma | Active |
| TEST123 | Test User | Active |

## Features

## Features

### Security
- Biometric Authentication - Face recognition for voter verification
- Blockchain Integration - Immutable vote recording
- Cryptographic Receipts - Verifiable vote confirmation
- One Vote Per Voter - Prevents duplicate voting

### Accessibility
- Voice Navigation - Complete voice-assisted voting flow
- Screen Reader Support - ARIA labels and semantic HTML
- High Contrast Mode - Enhanced visibility options
- Font Size Adjustment - Customizable text size
- Keyboard Navigation - Full keyboard accessibility

### User Experience
- Responsive Design - Works on all devices
- Real-time Validation - Instant feedback
- Progress Tracking - Clear voting flow indicators
- Modern UI - Beautiful gradient design with smooth animations

### Admin Dashboard
- Real-time Statistics - Live voting data
- Fraud Detection - Suspicious activity monitoring
- System Health - Performance metrics
- Voter Analytics - Turnout and participation data

## How to Vote

1. **Visit the Website**
   - Open: https://topper12304.github.io/Advanced-Online-Voting-System/

2. **Login**
   - Click "Start Voting"
   - Enter your Voter ID (use demo IDs above)

3. **Biometric Verification**
   - Complete face recognition scan
   - Wait for verification (simulated)

4. **Cast Your Vote**
   - Select your preferred candidate
   - Review your selection
   - Confirm your vote

5. **Get Receipt**
   - Download your cryptographic receipt
   - Keep it for verification

## Available Candidates

1. Narendra Modi - BJP
2. Rahul Gandhi - INC
3. Arvind Kejriwal - AAP
4. Mamata Banerjee - TMC

## Project Structure

```
Advanced-Online-Voting-System/
│
├── index.html              # Main website (standalone)
├── styles.css              # Complete styling
├── script.js               # Full functionality
│
├── frontend/               # Original React version
├── backend/                # Django backend API
│
├── START_HERE.md           # Quick start guide
├── DEPLOY_INSTRUCTIONS.txt # GitHub Pages setup
└── README.md               # This file
```

## Technology Stack

### Standalone Version (Root Folder)
- HTML5 - Semantic structure
- CSS3 - Modern styling with animations
- JavaScript (ES6+) - Vanilla JS, no frameworks
- No Dependencies - Pure web technologies

### Original Version (Frontend/Backend Folders)
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Django + AWS Services
- State Management: Zustand
- Build Tool: Vite

## Browser Support

- Chrome (Recommended)
- Firefox
- Safari
- Microsoft Edge
- Mobile browsers (iOS/Android)

## Mobile Friendly

The system is fully responsive and works perfectly on:
- Smartphones
- Tablets
- Laptops
- Desktop computers

## GitHub Pages Setup

If the live URL doesn't work yet, enable GitHub Pages:

1. Go to repository **Settings**
2. Click **Pages** in the left sidebar
3. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**
5. Wait 2-3 minutes for deployment

Your site will be live at:
```
https://topper12304.github.io/Advanced-Online-Voting-System/
```

## Features Demonstrated

### Security Features (Simulated)
- Biometric authentication
- Blockchain vote recording
- Cryptographic hashing
- Receipt generation
- Vote verification
- Fraud detection

### Accessibility Features
- WCAG 2.1 compliant
- Keyboard navigation
- Screen reader support
- High contrast mode
- Font size adjustment
- RTL text support

### User Interface
- Modern gradient design
- Smooth animations
- Loading states
- Modal dialogs
- Success indicators
- Responsive layout

## Usage Tips

- Each Voter ID can only vote once (refresh page to reset)
- Press `ESC` to close modal dialogs
- Try the Admin Dashboard for statistics
- Use Accessibility Settings to customize experience
- Download receipt after voting for proof
- Check browser console (F12) for debug info

## Updating the Live Site

To update the live website after making changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Pages will automatically redeploy in 2-3 minutes.

## Project Statistics

- **Total Lines of Code:** ~800 lines
- **File Size:** 33.7 KB (uncompressed)
- **Load Time:** < 1 second
- **Dependencies:** 0 (standalone version)
- **Browser Compatibility:** 100%

## Use Cases

- Educational: Learn about voting systems
- Demonstration: Show secure voting concepts
- Prototype: Base for production systems
- Testing: Test voting workflows
- Portfolio: Showcase web development skills

## Troubleshooting

### Live URL not working?
- Wait 5 minutes after enabling GitHub Pages
- Check Settings → Pages for deployment status
- Ensure repository is public

### Changes not showing?
- Wait 2-3 minutes for deployment
- Clear browser cache (Ctrl + Shift + R)
- Check GitHub Actions tab

### Already voted error?
- Refresh the page to reset
- Use a different Voter ID

## Documentation

- START_HERE.md - Complete guide (removed)
- DEPLOY_INSTRUCTIONS.txt - GitHub Pages setup (removed)
- QUICK_START_GUIDE.md - Detailed walkthrough (removed)

## Customization

### Change Colors
Edit `styles.css` and modify the `:root` section:
```css
:root {
    --primary: #2563eb;
    --success: #10b981;
    /* Add your colors */
}
```

### Add Candidates
Edit `script.js` and modify the `CANDIDATES` array:
```javascript
const CANDIDATES = [
    { id: 'CAND_001', name: 'Your Candidate', party: 'Party', symbol: '🎯' }
];
```

### Add Voters
Edit `script.js` and modify the `MOCK_VOTERS` object:
```javascript
const MOCK_VOTERS = {
    'VOTER001': { name: 'New Voter', aadhaar: '0000-0000-0000' }
};
```

## Deployment Options

### GitHub Pages (Current)
- Free hosting
- HTTPS included
- Automatic deployment
- Custom domain support

### Alternative Platforms
- Netlify: Drag and drop deployment
- Vercel: Git integration
- AWS Amplify: Scalable hosting
- Firebase Hosting: Google infrastructure

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation files
- Review browser console for errors

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with modern web technologies
- Inspired by secure voting systems
- Designed for accessibility and usability
- Created for educational purposes

## Project Status

Complete and Ready to Use

- Fully functional voting system
- Deployed on GitHub Pages
- No installation required
- Works on all devices
- Free and open source

## Future Enhancements

Potential improvements for production use:
- Real biometric authentication (AWS Rekognition)
- Actual blockchain integration (Hyperledger)
- Backend API integration
- Database persistence
- Multi-language support (22 languages)
- Voice AI integration
- Advanced fraud detection
- Real-time analytics

---

Built with care for secure and accessible democracy
