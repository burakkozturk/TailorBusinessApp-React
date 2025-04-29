import React from 'react';
import '../styles/FeaturesSection.css';

function FeaturesSection() {
  return (
    <div className="features-section">
      <div className="welcome-heading">
        <h2>WELCOME</h2>
      </div>
      <div className="mastering-section">
        <div className="mastering-content">
          <h2>Mastering Sartorial<br />Perfections</h2>
          <p>
            1970'lerden bu yana kaliteli terzilik hizmeti sunuyoruz. Londra'da doğan
            ve Toronto'da gelişen markamız, en yüksek kalitede 
            malzemeler kullanarak kişiye özel terzilik hizmeti sunmaktadır.
            Her müşterimize kendi tarzını yansıtan eşsiz giysiler tasarlıyoruz.
          </p>
          <button className="learn-more-button">Daha Fazla</button>
        </div>
        <div className="mastering-images">
          <div className="image-grid">
            <div className="grid-image top-image"></div>
            <div className="grid-image middle-image"></div>
            <div className="grid-image bottom-image"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;