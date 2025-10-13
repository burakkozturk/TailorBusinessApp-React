import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation dosyalarını import et
import trCommon from '../locales/tr/common.json';
import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';
import frCommon from '../locales/fr/common.json';

// Admin translation dosyaları
import trAdmin from '../locales/tr/admin.json';
import enAdmin from '../locales/en/admin.json';
import arAdmin from '../locales/ar/admin.json';
import frAdmin from '../locales/fr/admin.json';

// Desteklenen diller ve bayrak kodları
export const SUPPORTED_LANGUAGES = [
  {
    code: 'tr',
    name: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr'
  }
];

// Translation resources
const resources = {
  tr: {
    common: trCommon,
    admin: trAdmin
  },
  en: {
    common: enCommon,
    admin: enAdmin
  },
  ar: {
    common: arCommon,
    admin: arAdmin
  },
  fr: {
    common: frCommon,
    admin: frAdmin
  }
};

// i18n konfigürasyonu
i18n
  .use(LanguageDetector) // Tarayıcı dilini otomatik algıla
  .use(initReactI18next) // React entegrasyonu
  .init({
    debug: process.env.NODE_ENV === 'development',
    
    // Fallback dili
    fallbackLng: 'tr',
    
    // Desteklenen diller
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),
    
    // Namespace ayarları
    defaultNS: 'common',
    ns: ['common', 'admin'],
    
    // Translation resources
    resources,
    
    // Dil algılama ayarları
    detection: {
      // Algılama sırası
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // localStorage anahtarı
      lookupLocalStorage: 'i18nextLng',
      
      // HTML lang attribute
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      
      // Cache user language
      caches: ['localStorage'],
      
      // Exclude dnt (do not track) header
      excludeCacheFor: ['cimode'],
      
      // Convert language codes
      convertDetectedLanguage: (lng) => {
        // 'tr-TR' -> 'tr' gibi dönüşümler
        const langCode = lng.split('-')[0].toLowerCase();
        return SUPPORTED_LANGUAGES.find(lang => lang.code === langCode)?.code || 'tr';
      }
    },
    
    // Interpolation ayarları
    interpolation: {
      escapeValue: false, // React zaten XSS koruması yapıyor
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      }
    },
    
    // React ayarları
    react: {
      useSuspense: false, // Suspense kullanma
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    },
    
    // Üretim ayarları
    saveMissing: process.env.NODE_ENV === 'development',
    saveMissingTo: 'fallback',
    
    // Key separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Plural rules
    pluralSeparator: '_',
    
    // Context separator
    contextSeparator: '_'
  });

// HTML element'e dir attribute ekle
const updateHTMLDirection = (lng) => {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === lng);
  if (language) {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = lng;
  }
};

// Dil değişikliklerini dinle
i18n.on('languageChanged', updateHTMLDirection);

// İlk yüklemede direction'ı ayarla
updateHTMLDirection(i18n.language);

export default i18n;
