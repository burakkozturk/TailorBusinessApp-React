import React from 'react';
import '../styles/AboutSection.css';

function AboutSection() {
  return (
    <div className="about-section">
      <div className="about-content">
        <h2>Hizmetlerimiz</h2>
        <div className="services-container">
          <div className="service-item">
            <h3>Özel Dikim Takım Elbiseler</h3>
            <p>Vücut ölçülerinize göre tasarlanan, en ince detayına kadar özelleştirilebilen takım elbiseler.</p>
          </div>
          <div className="service-item">
            <h3>Ölçüye Göre Gömlekler</h3>
            <p>Tercih ettiğiniz kumaş, yaka ve manşet tarzı ile tamamen size özel gömlekler.</p>
          </div>
          <div className="service-item">
            <h3>Özel Dikim Ceketler</h3>
            <p>Her sezona uygun, en kaliteli kumaşlardan üretilen ceketler ile tarzınızı yansıtın.</p>
          </div>
          <div className="service-item">
            <h3>Tamirat ve Tadilat</h3>
            <p>Sevdiğiniz giysilerinize uzun ömür sağlayan profesyonel onarım ve tadilat hizmetleri.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;