import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/HeroSlider.css';

const slideImages = [
  '/img/main-banner.jpg',
  '/img/banner2.jpg',
  '/img/banner3.jpg'
];

function HeroSlider({ contactRoute = '/contact' }) {
  const [current, setCurrent] = useState(0);
  const { t } = useTranslation('common');

  // Çeviri verilerini al
  const slides = t('heroSlider.slides', { returnObjects: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider-wrapper">
      {slideImages.map((image, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={`Erdal Güda - ${slides[current]?.title || ''}`}
        />
      ))}
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2 className="hero-subtitle">{slides[current]?.subtitle || 'ERDAL GÜDA'}</h2>
        <h1 className="hero-title">{slides[current]?.title || ''}</h1>
        <p className="hero-description">{slides[current]?.description || ''}</p>
        <a href="tel:+903124913630" className="btn-primary btn-large">
          {t('heroSlider.contactButton')}
        </a>
      </div>
    </div>
  );
}

export default HeroSlider;
