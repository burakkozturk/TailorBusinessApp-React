import React, { useState } from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Submitted:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      {/* CTA */}
      <div className="footer-cta">
        <div className="footer-cta-bg" />
        <div className="footer-cta-content">
          <h4 className="footer-cta-title">Detaylı Bilgi İçin Mesaj Gönderin</h4>
          <p className="footer-cta-text">
            Herhangi bir sorunuz mu var? E-posta adresinizi bırakın.
          </p>
          <form className="footer-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="E-posta adresinizi girin"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary btn-small">Gönder</button>
          </form>
        </div>
      </div>

      {/* INFO COLUMNS */}
      <div className="footer-info">
        <div className="info-col">
          <h5>Çalışma Saatleri</h5>
          <p>Pzt–Cum: 08:00–20:00</p>
          <p>Cmt: 09:00–17:00</p>
          <p>Paz: Kapalı</p>
          <button className="btn-outline btn-small">Randevu Al</button>
        </div>

        <div className="info-col">
          <h5>Hızlı Linkler</h5>
          <ul>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/services">Hizmetler</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">Hakkımızda</a></li>
            <li><a href="/contact">İletişim</a></li>
          </ul>
        </div>

        <div className="info-col">
          <h5>İletişim</h5>
          <p>+90 555 123 4567</p>
          <p>info@erdalguda.com</p>
        </div>

        <div className="info-col map-col">
          <h5>Konum</h5>
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.126244866322!2d32.840266899999996!3d39.8490038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34452aa3aa57d%3A0x97837167bcb4f562!2sMakara%20Terzi%20(Tailor)%20Erdal%20G%C3%BCda!5e0!3m2!1str!2str!4v1746228227557!5m2!1str!2str"
              title="Erdal Güda Konum"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Erdal Güda. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
