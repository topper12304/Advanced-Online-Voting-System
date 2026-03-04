# Advanced Online Voting System

A secure, accessible, and transparent online voting platform built with modern web technologies and AWS services.

## 🎯 Project Overview

This system provides a comprehensive solution for conducting secure online elections with features including:
- Biometric authentication
- Blockchain-based vote recording
- Real-time fraud detection
- Accessibility features for all users
- Voice-assisted voting
- Cryptographic vote receipts

## 🏗️ Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Build Tool:** Vite

### Backend API
- **Service:** AWS API Gateway (Mock Integration)
- **Endpoints:**
  - `POST /auth/login` - User authentication
  - `POST /vote` - Vote casting
- **Region:** EU North 1 (Stockholm)

### Deployment
- **Frontend:** AWS Amplify
- **Backend:** AWS API Gateway
- **Live URL:** https://main.d2z0ay6qqwvvqo.amplifyapp.com
- **API URL:** https://i2qc9ii6w6.execute-api.eu-north-1.amazonaws.com/prod

## 🚀 Features

### Security
- **Biometric Authentication:** Face recognition for voter verification
- **Blockchain Integration:** Immutable vote recording
- **End-to-End Encryption:** Secure data transmission
- **Fraud Detection:** AI-powered anomaly detection

### Accessibility
- **Voice Navigation:** Complete voice-assisted voting flow
- **Screen Reader Support:** ARIA labels and semantic HTML
- **High Contrast Mode:** Enhanced visibility options
- **Keyboard Navigation:** Full keyboard accessibility
- **Multi-language Support:** English, Hindi, Tamil, Bengali

### User Experience
- **Responsive Design:** Works on all devices
- **Real-time Validation:** Instant feedback
- **Progress Tracking:** Clear voting flow indicators
- **Cryptographic Receipts:** Verifiable vote confirmation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

The backend uses AWS API Gateway with mock integrations. No local setup required.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://i2qc9ii6w6.execute-api.eu-north-1.amazonaws.com/prod
VITE_APP_NAME=SecureVote
```

## 📱 Usage

### For Voters

1. **Login:** Enter your Voter ID
2. **Biometric Verification:** Complete face recognition
3. **Select Candidate:** Choose your preferred candidate
4. **Confirm Vote:** Review and confirm your selection
5. **Get Receipt:** Download your cryptographic receipt

### For Administrators

Access the admin dashboard at `/admin` to:
- Monitor real-time voting statistics
- View system health metrics
- Manage elections
- Generate reports

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📊 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # State management (Zustand)
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/
│   ├── api/                # API endpoints
│   ├── voting_backend/     # Django settings
│   └── requirements.txt
└── README.md
```

## 🔐 Security Considerations

- All API calls use HTTPS
- Biometric data is never stored
- Votes are encrypted before transmission
- Blockchain ensures vote immutability
- Regular security audits recommended

##  Accessibility

This application follows WCAG 2.1 Level AA guidelines:
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management
- Alternative text for images

##  Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Development Team
- Security Auditors
- Accessibility Consultants

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@securevote.com

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- React community for excellent tools
- Open source contributors

## 📈 Future Enhancements

- [ ] Multi-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Mobile native apps
- [ ] Integration with national ID systems
- [ ] Real-time result visualization
- [ ] Audit trail export

---

Built with ❤️ for secure and accessible democracy
