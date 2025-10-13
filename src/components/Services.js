import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Services.css';

const Services = () => {
  const { t } = useTranslation('common');
  const servicesData = t('services.items', { returnObjects: true });

  return (
    <section className="services-section">
      {/* Başlık Kısmı */}
      <div className="services-header">
        <p className="services-subtitle">{t('services.subtitle')}</p>
        <h2 className="services-title">{t('services.title')}</h2>
        <p className="services-description">
          {t('services.description')}
        </p>
      </div>

      {/* Kartlar */}
      <div className="services-cards">
        {servicesData && servicesData.map((svc, idx) => (
          <div className="service-card" key={idx}>
            <h3 className="service-card-title">{svc.title}</h3>
            <p className="service-card-desc">{svc.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
