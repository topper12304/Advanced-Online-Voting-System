import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AccessibilityState {
  // Visual settings
  highContrast: boolean
  fontSize: number
  reducedMotion: boolean
  
  // Input settings
  keyboardNavigation: boolean
  screenReaderMode: boolean
  voiceEnabled: boolean
  
  // Actions
  toggleHighContrast: () => void
  setFontSize: (size: number) => void
  toggleReducedMotion: () => void
  toggleKeyboardNavigation: () => void
  toggleScreenReaderMode: () => void
  toggleVoiceEnabled: () => void
  resetToDefaults: () => void
}

const DEFAULT_FONT_SIZE = 16
const MIN_FONT_SIZE = 12
const MAX_FONT_SIZE = 24

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      // Initial state
      highContrast: false,
      fontSize: DEFAULT_FONT_SIZE,
      reducedMotion: false,
      keyboardNavigation: true,
      screenReaderMode: false,
      voiceEnabled: false,

      // Actions
      toggleHighContrast: () => {
        set((state) => ({ highContrast: !state.highContrast }))
      },

      setFontSize: (size: number) => {
        const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size))
        set({ fontSize: clampedSize })
      },

      toggleReducedMotion: () => {
        set((state) => ({ reducedMotion: !state.reducedMotion }))
      },

      toggleKeyboardNavigation: () => {
        set((state) => ({ keyboardNavigation: !state.keyboardNavigation }))
      },

      toggleScreenReaderMode: () => {
        set((state) => ({ screenReaderMode: !state.screenReaderMode }))
      },

      toggleVoiceEnabled: () => {
        set((state) => ({ voiceEnabled: !state.voiceEnabled }))
      },

      resetToDefaults: () => {
        set({
          highContrast: false,
          fontSize: DEFAULT_FONT_SIZE,
          reducedMotion: false,
          keyboardNavigation: true,
          screenReaderMode: false,
          voiceEnabled: false,
        })
      },
    }),
    {
      name: 'accessibility-storage',
    }
  )
)

// Hook to detect system preferences
export const useSystemPreferences = () => {
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  return {
    prefersHighContrast,
    prefersReducedMotion,
  }
}