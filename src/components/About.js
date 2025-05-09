import React from 'react';
import '../styles/About.css';

const About = () => (
  <section className="about-section">
    <div className="about-container">
      <div className="about-images">
        <img src="/img/feature1.jpg" alt="" className="about-img img-1" />
        <img src="/img/feature2.jpg" alt="" className="about-img img-2" />
      </div>
      <div className="about-section-text">
        <p className="about-section-subtitle">Hakkımızda</p>
        <h2 className="about-section-title">Ustalığımızla Fark Yaratıyoruz</h2>
        <p className="about-section-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <button className="about-button">Daha Fazla</button>
      </div>
    </div>
  </section>
);

export default About;
