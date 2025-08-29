import React from 'react';
import '../styles/About.css';

const About = () => (
  <section className="about-section">
    <div className="about-container">
      <div className="about-images">
        <img src="/img/about-1.jpeg" alt="" className="about-img img-1" />
        <img src="/img/about-2.jpeg" alt="" className="about-img img-2" />
      </div>
      <div className="about-section-text">
        <p className="about-section-subtitle">Hakkımızda</p>
        <h2 className="about-section-title">Ustalığımızla Fark Yaratıyoruz</h2>
        <p className="about-section-desc">
          Hoşgeldiniz!<br></br><br></br><br></br>

          Erdal Güda Terzilik Atölyesi olarak, size özel tasarlanmış, vücut ölçülerinize uygun kıyafetler sunuyoruz. Her bir parça, el işçiliğiyle özenle hazırlanır. Tarzınızı yansıtan, rahat ve şık takımlarımızla fark yaratın.
          <br></br>
          <br></br>
          Özel Tasarımlar, Kaliteli Kumaşlar
          Her bedene uygun, özgün ve kaliteli kıyafetlerimizle tanışın. Günlük yaşamda ve özel günlerde şıklığınızı tamamlayın.
          <br></br>
          <br></br>
          Randevunuzu Alın
          Size en uygun tasarımı oluşturmak için hemen randevunuzu alın. Profesyonel ekibimizle sizi bekliyoruz.
        </p>
        <button className="btn-outline">Daha Fazla</button>
      </div>
    </div>
  </section>
);

export default About;
