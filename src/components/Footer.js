import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-section">
            <h3>Your Look</h3>
            <ul>
              <li><a href="/">Takım Elbiseler</a></li>
              <li><a href="/">Gömlekler</a></li>
              <li><a href="/">Ceketler</a></li>
              <li><a href="/">Pantolonlar</a></li>
              <li><a href="/">Blog</a></li>
              <li><a href="/">İletişim</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>+1 647-555-4000</p>
            <p>info@londonbespoke.com</p>
          </div>
          <div className="footer-section social-section">
            <div className="social-icons">
              <a href="/" className="social-icon">FB</a>
              <a href="/" className="social-icon">IG</a>
              <a href="/" className="social-icon">TW</a>
              <a href="/" className="social-icon">YT</a>
            </div>
            <button className="appointment-button">BOOK APPOINTMENT</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© London Bespoke Club, 2025 | All Rights Reserved</p>
          <ul className="bottom-menu">
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/collection">Collection</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;