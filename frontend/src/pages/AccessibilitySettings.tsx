import { Link } from 'react-router-dom'
import { 
  Eye, 
  Volume2, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard,
  RotateCcw,
  Save,
  ArrowLeft
} from 'lucide-react'
import { useAccessibilityStore } from '../stores/accessibilityStore'
import { useLanguageStore } from '../stores/languageStore'

export default function AccessibilitySettings() {
  const {
    highContrast,
    fontSize,
    reducedMotion,
    keyboardNavigation,
    screenReaderMode,
    voiceEnabled,
    toggleHighContrast,
    setFontSize,
    toggleReducedMotion,
    toggleKeyboardNavigation,
    toggleScreenReaderMode,
    toggleVoiceEnabled,
    resetToDefaults
  } = useAccessibilityStore()

  const { currentLanguage, setLanguage, getAllLanguages } = useLanguageStore()
  const languages = getAllLanguages()

  const handleSave = () => {
    // Settings are automatically saved via Zustand persist
    alert('Settings saved successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Accessibility Settings
              </h1>
              <p className="text-gray-600">
                Customize your voting experience for better accessibility
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Eye className="mr-2 w-5 h-5" />
              Visual Settings
            </h2>

            <div className="space-y-6">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Contrast className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      High Contrast Mode
                    </label>
                    <p className="text-xs text-gray-500">
                      Increase contrast for better visibility
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={highContrast}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Type className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Font Size
                    </label>
                    <p className="text-xs text-gray-500">
                      Adjust text size for better readability
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">12pt</span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">24pt</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-gray-900">
                    Current: {fontSize}pt
                  </span>
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MousePointer className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Reduced Motion
                    </label>
                    <p className="text-xs text-gray-500">
                      Minimize animations and transitions
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reducedMotion ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={reducedMotion}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Input Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Keyboard className="mr-2 w-5 h-5" />
              Input & Navigation
            </h2>

            <div className="space-y-6">
              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Keyboard className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Keyboard Navigation
                    </label>
                    <p className="text-xs text-gray-500">
                      Navigate using keyboard only
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleKeyboardNavigation}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    keyboardNavigation ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={keyboardNavigation}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Screen Reader Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Screen Reader Mode
                    </label>
                    <p className="text-xs text-gray-500">
                      Optimize for screen readers
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleScreenReaderMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    screenReaderMode ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={screenReaderMode}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Voice Interface */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      Voice Interface
                    </label>
                    <p className="text-xs text-gray-500">
                      Enable voice commands and feedback
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleVoiceEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    voiceEnabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={voiceEnabled}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Language Preferences
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Language
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full form-input"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Voice interface and text will be displayed in the selected language
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={handleSave}
                className="w-full btn-primary inline-flex items-center justify-center"
              >
                <Save className="mr-2 w-4 h-4" />
                Save Settings
              </button>

              <button
                onClick={resetToDefaults}
                className="w-full btn-secondary inline-flex items-center justify-center"
              >
                <RotateCcw className="mr-2 w-4 h-4" />
                Reset to Defaults
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                If you need assistance with accessibility features, contact our support team.
              </p>
              <div className="space-y-1 text-sm text-blue-700">
                <div>Phone: 1-800-VOTE-HELP</div>
                <div>Email: accessibility@votingsystem.gov</div>
                <div>TTY: 1-800-VOTE-TTY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}