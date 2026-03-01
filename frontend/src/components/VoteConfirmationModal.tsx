import { Fragment } from 'react'
// import { Dialog, Transition } from '@headlessui/react' // Temporarily commented out
import { X, AlertTriangle, Vote } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

interface Candidate {
  candidateId: string
  name: string
  party: string
  symbol: string
}

interface VoteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  candidate: Candidate | null
  isLoading: boolean
}

export default function VoteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  candidate,
  isLoading
}: VoteConfirmationModalProps) {
  if (!candidate || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Confirm Your Vote
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Final Confirmation
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Once confirmed, your vote cannot be changed. Please review your selection carefully.
                </p>
              </div>
            </div>
          </div>

          {/* Candidate Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{candidate.symbol}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {candidate.name}
              </h3>
              <p className="text-gray-600">
                {candidate.party}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 btn-success inline-flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Vote className="mr-2 w-4 h-4" />
                  Confirm Vote
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}