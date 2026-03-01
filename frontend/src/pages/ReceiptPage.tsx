import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Shield, 
  Clock,
  Hash,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useVotingStore } from '../stores/votingStore'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ReceiptPage() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const [copied, setCopied] = useState(false)
  const { receipt, isLoading, error, verifyReceipt } = useVotingStore()

  useEffect(() => {
    if (receiptId) {
      verifyReceipt(receiptId)
    }
  }, [receiptId, verifyReceipt])

  const handleCopyReceipt = async () => {
    if (!receipt) return
    
    const receiptText = `
Voting Receipt
Receipt ID: ${receipt.receiptId}
Timestamp: ${new Date(receipt.timestamp).toLocaleString()}
Verification URL: ${receipt.verificationUrl}
Block Index: ${receipt.blockReceipt.blockIndex}
Vote Index: ${receipt.blockReceipt.voteIndex}
    `.trim()

    try {
      await navigator.clipboard.writeText(receiptText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy receipt:', err)
    }
  }

  const handleDownloadReceipt = () => {
    if (!receipt) return

    const receiptData = {
      receiptId: receipt.receiptId,
      timestamp: receipt.timestamp,
      commitment: receipt.commitment,
      verificationUrl: receipt.verificationUrl,
      blockReceipt: receipt.blockReceipt
    }

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vote-receipt-${receipt.receiptId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying receipt..." />
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Receipt Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The receipt you are looking for could not be found or verified.'}
          </p>
          <Link to="/vote" className="btn-primary">
            Back to Voting
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vote Successfully Recorded
        </h1>
        <p className="text-lg text-gray-600">
          Your vote has been securely recorded on the blockchain
        </p>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Cryptographic Vote Receipt
              </h2>
              <p className="text-primary-100">
                Proof of vote inclusion without revealing vote content
              </p>
            </div>
            <Shield className="w-8 h-8 text-primary-200" />
          </div>
        </div>

        {/* Receipt Details */}
        <div className="p-6 space-y-6">
          {/* Receipt ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt ID
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                {receipt.receiptId}
              </code>
              <button
                onClick={handleCopyReceipt}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Copy Receipt"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Timestamp
            </label>
            <div className="bg-gray-100 px-3 py-2 rounded text-sm">
              {new Date(receipt.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Blockchain Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="inline w-4 h-4 mr-1" />
              Blockchain Location
            </label>
            <div className="bg-gray-100 px-3 py-2 rounded text-sm space-y-1">
              <div>Block Index: {receipt.blockReceipt.blockIndex}</div>
              <div>Vote Index: {receipt.blockReceipt.voteIndex}</div>
              <div className="text-xs text-gray-500">
                Merkle Proof: {receipt.blockReceipt.merkleProof.length} levels
              </div>
            </div>
          </div>

          {/* Commitment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zero-Knowledge Commitment
            </label>
            <code className="block bg-gray-100 px-3 py-2 rounded text-xs font-mono break-all">
              {receipt.commitment}
            </code>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleDownloadReceipt}
          className="btn-primary inline-flex items-center justify-center"
        >
          <Download className="mr-2 w-4 h-4" />
          Download Receipt
        </button>
        
        <button
          onClick={handleCopyReceipt}
          className="btn-secondary inline-flex items-center justify-center"
        >
          {copied ? (
            <>
              <CheckCircle className="mr-2 w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 w-4 h-4" />
              Copy Receipt
            </>
          )}
        </button>
      </div>

      {/* Verification Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          How to Verify Your Vote
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span className="font-semibold">1.</span>
            <span>
              Save this receipt securely. It proves your vote was counted without revealing your choice.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-semibold">2.</span>
            <span>
              Use the verification URL to independently verify your vote inclusion on the blockchain.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-semibold">3.</span>
            <span>
              The zero-knowledge commitment ensures your vote privacy while enabling verification.
            </span>
          </div>
        </div>
        
        {receipt.verificationUrl && (
          <div className="mt-4">
            <a
              href={receipt.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ExternalLink className="mr-1 w-4 h-4" />
              Verify on Blockchain Explorer
            </a>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Your Vote is Secure
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Vote encrypted with AES-256-GCM</li>
              <li>• Identity protected with zero-knowledge proofs</li>
              <li>• Recorded on immutable blockchain</li>
              <li>• Verified by distributed consensus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="text-center">
        <Link
          to="/"
          className="text-primary-600 hover:text-primary-500 inline-flex items-center"
        >
          <Eye className="mr-1 w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  )
}