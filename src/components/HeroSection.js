import React from 'react';
import '../styles/HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-section">
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

export default HeroSection;