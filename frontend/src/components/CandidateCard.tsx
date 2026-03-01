import { Check, User } from 'lucide-react'
import { cn } from '../utils/cn'

interface Candidate {
  candidateId: string
  name: string
  party: string
  symbol: string
  constituency: string
  biography: string
  photoUrl: string
}

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  onSelect: () => void
}

export default function CandidateCard({ 
  candidate, 
  isSelected, 
  onSelect 
}: CandidateCardProps) {
  return (
    <div
      className={cn(
        'relative bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg',
        isSelected 
          ? 'border-primary-500 bg-primary-50 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${candidate.name} from ${candidate.party}`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Candidate Photo */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {candidate.photoUrl ? (
            <img 
              src={candidate.photoUrl} 
              alt={candidate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {candidate.name}
          </h3>
          <p className="text-sm text-gray-600">
            {candidate.party}
          </p>
        </div>
        
        <div className="text-3xl">
          {candidate.symbol}
        </div>
      </div>

      {/* Biography */}
      <p className="text-sm text-gray-600 mb-4">
        {candidate.biography}
      </p>

      {/* Constituency */}
      <div className="text-xs text-gray-500">
        Constituency: {candidate.constituency}
      </div>
    </div>
  )
}