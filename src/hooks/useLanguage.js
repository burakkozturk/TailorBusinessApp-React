import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

/**
 * Dil yönetimi için custom hook
 * @returns {Object} Dil yönetimi ile ilgili fonksiyonlar ve state'ler
 */
export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  /**
   * Mevcut dili al
   */
  const currentLanguage = i18n.language;

  /**
   * Mevcut dil bilgilerini al
   */
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  };

  /**
   * Dil değiştir
   * @param {string} languageCode - Değiştirilecek dil kodu
   */
  const changeLanguage = (languageCode) => {
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      i18n.changeLanguage(languageCode);
      
      // Local storage'a kaydet
      localStorage.setItem('i18nextLng', languageCode);
      
      // HTML direction güncelle
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
      if (language) {
        document.documentElement.dir = language.dir;
        document.documentElement.lang = languageCode;
        
        // Body'e RTL class ekle/çıkar
        if (language.dir === 'rtl') {
          document.body.classList.add('rtl');
        } else {
          document.body.classList.remove('rtl');
        }
      }
    }
  };

  /**
   * Bir sonraki dile geç (döngüsel)
   */
  const cycleToNextLanguage = () => {
    const currentIndex = SUPPORTED_LANGUAGES.findIndex(lang => lang.code === currentLanguage);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    changeLanguage(SUPPORTED_LANGUAGES[nextIndex].code);
  };

  /**
   * RTL kontrolü
   */
  const isRTL = () => {
    const language = getCurrentLanguageInfo();
    return language.dir === 'rtl';
  };

  /**
   * Dil yönünü al
   */
  const getDirection = () => {
    return isRTL() ? 'rtl' : 'ltr';
  };

  /**
   * Desteklenen dilleri al
   */
  const getSupportedLanguages = () => {
    return SUPPORTED_LANGUAGES;
  };

  /**
   * Çeviri fonksiyonu (kısa kullanım için)
   */
  const translate = (key, options = {}) => {
    return t(key, options);
  };

  /**
   * Namespace ile çeviri
   */
  const translateWithNamespace = (namespace, key, options = {}) => {
    return t(`${namespace}:${key}`, options);
  };

  /**
   * Browser'ın tercih ettiği dili al
   */
  const getBrowserLanguage = () => {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (browserLang) {
      const langCode = browserLang.split('-')[0].toLowerCase();
      return SUPPORTED_LANGUAGES.find(lang => lang.code === langCode)?.code || 'tr';
    }
    return 'tr';
  };

  /**
   * Dil değiştirme durumunu kontrol et
   */
  const isLanguageChanging = i18n.isInitialized === false;

  return {
    // State
    currentLanguage,
    currentLanguageInfo: getCurrentLanguageInfo(),
    supportedLanguages: getSupportedLanguages(),
    isRTL: isRTL(),
    direction: getDirection(),
    isLanguageChanging,
    
    // Functions
    changeLanguage,
    cycleToNextLanguage,
    translate,
    translateWithNamespace,
    getBrowserLanguage,
    
    // i18next original fonksiyonları
    t,
    i18n
  };
};

/**
 * Dil değiştirici komponenti için özel hook
 */
export const useLanguageSwitcher = () => {
  const { 
    currentLanguage, 
    currentLanguageInfo, 
    supportedLanguages, 
    changeLanguage,
    cycleToNextLanguage 
  } = useLanguage();

  /**
   * Diğer dilleri al (mevcut dil hariç)
   */
  const getOtherLanguages = () => {
    return supportedLanguages.filter(lang => lang.code !== currentLanguage);
  };

  return {
    currentLanguage,
    currentLanguageInfo,
    supportedLanguages,
    otherLanguages: getOtherLanguages(),
    changeLanguage,
    cycleToNextLanguage
  };
};

export default useLanguage;
