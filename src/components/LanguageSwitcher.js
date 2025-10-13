import React, { useState, useRef, useEffect } from 'react';
import { useLanguageSwitcher } from '../hooks/useLanguage';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = ({ variant = 'default', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const switcherRef = useRef(null);
  
  const { 
    currentLanguageInfo, 
    otherLanguages, 
    changeLanguage 
  } = useLanguageSwitcher();

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dil değiştirme fonksiyonu
  const handleLanguageChange = (languageCode) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    changeLanguage(languageCode);
    setIsOpen(false);
    
    // Animasyon bitince flag'i kaldır
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Toggle fonksiyonu
  const toggleSwitcher = () => {
    if (!isAnimating) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      ref={switcherRef}
      className={`language-switcher ${variant} ${className} ${isOpen ? 'open' : ''} ${isAnimating ? 'animating' : ''}`}
    >
      {/* Ana Dil Butonu */}
      <button 
        className="language-switcher__current"
        onClick={toggleSwitcher}
        aria-label={`Current language: ${currentLanguageInfo.nativeName}`}
        title={`Current: ${currentLanguageInfo.nativeName}`}
      >
        <span className="language-switcher__flag">
          {currentLanguageInfo.flag}
        </span>
        <span className="language-switcher__code">
          {currentLanguageInfo.code.toUpperCase()}
        </span>
        <span className="language-switcher__name">
          {currentLanguageInfo.nativeName}
        </span>
        <span className={`language-switcher__arrow ${isOpen ? 'open' : ''}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path 
              d="M1 1.5L6 6.5L11 1.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Dil Seçenekleri */}
      <div className="language-switcher__options">
        {otherLanguages.map((language, index) => (
          <button
            key={language.code}
            className="language-switcher__option"
            onClick={() => handleLanguageChange(language.code)}
            style={{ '--delay': `${index * 0.05}s` }}
            aria-label={`Switch to ${language.nativeName}`}
            title={`Switch to ${language.nativeName}`}
          >
            <span className="language-switcher__option-flag">
              {language.flag}
            </span>
            <span className="language-switcher__option-content">
              <span className="language-switcher__option-code">
                {language.code.toUpperCase()}
              </span>
              <span className="language-switcher__option-name">
                {language.nativeName}
              </span>
            </span>
            <span className="language-switcher__option-hover">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M4 8H12M12 8L8 4M12 8L8 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {/* Overlay */}
      <div 
        className={`language-switcher__overlay ${isOpen ? 'visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </div>
  );
};

export default LanguageSwitcher;
