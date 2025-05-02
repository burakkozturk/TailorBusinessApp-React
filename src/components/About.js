// src/components/About.js
import React from 'react';
import '../styles/About.css';

const About = () => (
  <section className="about-section">
    <div className="about-container">
      <div className="about-text">
        <h2>Hakkımızda</h2>
        <p>
          Gerçek ustalığın, her dikişte ve her ayrıntıda gizli olduğuna inanıyoruz.
          Erdal Güda olarak kişiye özel dikimde yılların deneyimini ve ince zevki
          birleştiriyoruz. Siz de stilinizin zamansız yolculuğunda bizimle adım atın.
        </p>
        <button className="about-button">Detaylı Bilgi</button>
      </div>
      <div className="about-image">
        <img
          src="/images/about-tailor.jpg"
          alt="Usta terzi çalışma anı"
        />
      </div>
    </div>
  </section>
);

export default About;
