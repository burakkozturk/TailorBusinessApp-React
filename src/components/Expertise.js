import React from 'react';
import '../styles/Expertise.css';

function Expertise() {
  return (
    <section className="expertise-section">
      <div className="expertise-container">
        <div className="expertise-left">
          <div className="section-tag">HAKKIMIZDA</div>
          <h2 className="expertise-title">Mastering Sartorial Perfections</h2>
          <div className="expertise-content">
            <p>
              The modern gentleman's style is a fusion of timeless elegance and contemporary flair. 
              At Erdal Güda, we understand that your appearance reflects your personality and aspirations.
            </p>
            <p>
              Her detayın önemli olduğu terzilik dünyasında, kumaşın seçiminden son dikişe kadar 
              mükemmelliğe olan bağlılığımız bizi farklı kılıyor. Yılların deneyimi ve modern 
              tekniklerin birleşimiyle, size özel tasarımlar sunuyoruz.
            </p>
            <p>
              "Stil bir adamın kendini ifade etme biçimidir ve her dikiş, hikayenizin bir parçasıdır."
              <span className="quote-author">- Erdal Güda</span>
            </p>
            <p>
              Özel dikim tecrübemizle, sizi en seçkin ortamlarda da rahat ve kendinden emin hissettirecek 
              kıyafetler sunuyoruz. İtalyan ve İngiliz kumaşlarının asaleti, el işçiliğinin zarafetiyle 
              buluşuyor.
            </p>
          </div>
          <button className="expertise-button">TERZİLİK HİZMETLERİMİZ</button>
        </div>
        <div className="expertise-right">
          <div className="image-grid">
            <div className="image-container main-image">
              <img src="/api/placeholder/400/500" alt="Master tailor working" className="tailor-image" />
            </div>
            <div className="image-container detail-image">
              <img src="/api/placeholder/350/280" alt="Tailoring detail" className="detail-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Expertise;