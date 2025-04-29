import React, { useEffect, useState } from 'react';
import '../styles/HeroSlider.css';

const images = [
  '/img/main-banner.jpg',
  '/img/banner2.jpg',
  '/img/banner3.jpg'
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000); // 4 saniyede bir değiştir

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hero-slider"
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2 className="hero-subtitle">LONDON BESPOKE</h2>
        <h1 className="hero-title">Toronto's Top Rated<br />Bespoke Tailor</h1>
        <p className="hero-description">
          Lüksü ve kişisel dokunuşu hissedin. El işçiliğiyle hazırlanan özel
          tasarımlar, profesyonel ölçüm ve birinci sınıf kumaşlar.
        </p>
        <button className="hero-button">Randevu Al</button>
      </div>
    </div>
  );
}

export default HeroSlider;
