import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/About.css';

const About = () => {
  const { t } = useTranslation('common');
  
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-images">
          <img src="/img/about-1.jpeg" alt="" className="about-img img-1" />
          <img src="/img/about-2.jpeg" alt="" className="about-img img-2" />
        </div>
        <div className="about-section-text">
          <p className="about-section-subtitle">{t('about.subtitle')}</p>
          <h2 className="about-section-title">{t('about.title')}</h2>
          <p className="about-section-desc">
            {t('about.welcomeText')}<br/><br/><br/>
            
            {t('about.description')}
            <br/><br/>
            
            {t('about.specialDesigns')}<br/>
            {t('about.specialDesignsDesc')}
            <br/><br/>
            
            {t('about.appointmentTitle')}<br/>
            {t('about.appointmentDesc')}
          </p>
          <button className="btn-outline">{t('about.moreButton')}</button>
        </div>
      </div>
    </section>
  );
};

export default About;
