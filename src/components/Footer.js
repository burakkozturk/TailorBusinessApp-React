import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.css';

const Footer = () => {
  const { t } = useTranslation('common');
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
          <h4 className="footer-cta-title">{t('footer.cta.title')}</h4>
          <p className="footer-cta-text">
            {t('footer.cta.text')}
          </p>
          <form className="footer-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={t('footer.cta.placeholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary btn-small">{t('footer.cta.submit')}</button>
          </form>
        </div>
      </div>

      {/* INFO COLUMNS */}
      <div className="footer-info">
        <div className="info-col">
          <h5>{t('footer.workingHours.title')}</h5>
          <p>{t('footer.workingHours.weekdays')}</p>
          <p>{t('footer.workingHours.saturday')}</p>
          <p>{t('footer.workingHours.sunday')}</p>
          <button className="btn-outline btn-small">{t('footer.workingHours.appointment')}</button>
        </div>

        <div className="info-col">
          <h5>{t('footer.quickLinks.title')}</h5>
          <ul>
            <li><a href="/">{t('footer.quickLinks.home')}</a></li>
            <li><a href="/services">{t('footer.quickLinks.services')}</a></li>
            <li><a href="/blog">{t('footer.quickLinks.blog')}</a></li>
            <li><a href="/about">{t('footer.quickLinks.about')}</a></li>
            <li><a href="/contact">{t('footer.quickLinks.contact')}</a></li>
          </ul>
        </div>

        <div className="info-col">
          <h5>{t('footer.contact.title')}</h5>
          <p>+90 555 123 4567</p>
          <p>info@erdalguda.com</p>
        </div>

        <div className="info-col map-col">
          <h5>{t('footer.location.title')}</h5>
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
        © {new Date().getFullYear()} Erdal Güda. {t('footer.copyright')}
      </div>
    </footer>
  );
};

export default Footer;
