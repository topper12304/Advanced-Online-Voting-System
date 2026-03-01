import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SupportedLanguage = 
  | 'english' | 'hindi' | 'bengali' | 'telugu' | 'marathi' | 'tamil' 
  | 'gujarati' | 'urdu' | 'kannada' | 'odia' | 'malayalam' | 'punjabi'
  | 'assamese' | 'maithili' | 'santali' | 'kashmiri' | 'nepali' | 'sindhi'
  | 'konkani' | 'dogri' | 'manipuri' | 'bodo'

interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  isRTL: boolean
  fontClass: string
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  english: { code: 'english', name: 'English', nativeName: 'English', isRTL: false, fontClass: '' },
  hindi: { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false, fontClass: 'font-hindi' },
  bengali: { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা', isRTL: false, fontClass: 'font-bengali' },
  telugu: { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు', isRTL: false, fontClass: '' },
  marathi: { code: 'marathi', name: 'Marathi', nativeName: 'मराठी', isRTL: false, fontClass: 'font-hindi' },
  tamil: { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்', isRTL: false, fontClass: 'font-tamil' },
  gujarati: { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', isRTL: false, fontClass: '' },
  urdu: { code: 'urdu', name: 'Urdu', nativeName: 'اردو', isRTL: true, fontClass: '' },
  kannada: { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isRTL: false, fontClass: '' },
  odia: { code: 'odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isRTL: false, fontClass: '' },
  malayalam: { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം', isRTL: false, fontClass: '' },
  punjabi: { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isRTL: false, fontClass: '' },
  assamese: { code: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া', isRTL: false, fontClass: 'font-bengali' },
  maithili: { code: 'maithili', name: 'Maithili', nativeName: 'मैथिली', isRTL: false, fontClass: 'font-hindi' },
  santali: { code: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', isRTL: false, fontClass: '' },
  kashmiri: { code: 'kashmiri', name: 'Kashmiri', nativeName: 'कॉशुर', isRTL: false, fontClass: 'font-hindi' },
  nepali: { code: 'nepali', name: 'Nepali', nativeName: 'नेपाली', isRTL: false, fontClass: 'font-hindi' },
  sindhi: { code: 'sindhi', name: 'Sindhi', nativeName: 'سنڌي', isRTL: true, fontClass: '' },
  konkani: { code: 'konkani', name: 'Konkani', nativeName: 'कोंकणी', isRTL: false, fontClass: 'font-hindi' },
  dogri: { code: 'dogri', name: 'Dogri', nativeName: 'डोगरी', isRTL: false, fontClass: 'font-hindi' },
  manipuri: { code: 'manipuri', name: 'Manipuri', nativeName: 'মৈতৈলোন্', isRTL: false, fontClass: 'font-bengali' },
  bodo: { code: 'bodo', name: 'Bodo', nativeName: 'बर\'', isRTL: false, fontClass: 'font-hindi' },
}

interface LanguageState {
  currentLanguage: SupportedLanguage
  isRTL: boolean
  fontClass: string
  
  // Actions
  setLanguage: (language: SupportedLanguage) => void
  getLanguageInfo: (language: SupportedLanguage) => LanguageInfo
  getAllLanguages: () => LanguageInfo[]
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'english',
      isRTL: false,
      fontClass: '',

      setLanguage: (language: SupportedLanguage) => {
        const languageInfo = SUPPORTED_LANGUAGES[language]
        set({
          currentLanguage: language,
          isRTL: languageInfo.isRTL,
          fontClass: languageInfo.fontClass,
        })
      },

      getLanguageInfo: (language: SupportedLanguage) => {
        return SUPPORTED_LANGUAGES[language]
      },

      getAllLanguages: () => {
        return Object.values(SUPPORTED_LANGUAGES)
      },
    }),
    {
      name: 'language-storage',
    }
  )
)