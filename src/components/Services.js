import React from 'react';
import '../styles/Services.css';

const servicesData = [
  {
    title: 'Ölçü Alma',
    description:
      'Vücut ölçülerinize tam uyumlu, profesyonel ölçü alma hizmeti.'
  },
  {
    title: 'Terzilik & Dikiş',
    description:
      'El işçiliğiyle kusursuz, size özel terzilik hizmeti.'
  },
  {
    title: 'Koleksiyon',
    description:
      'Zamansız şıklıkta, bedeninize özel hazırlanmış takım-elbise.'
  },
  {
    title: 'Bakım & Temizleme',
    description:
      'Takım-elbisenizin ömrünü uzatan, profesyonel bakım çözümleri.'
  }
];

const Services = () => (
  <section className="services-section">
    {/* Başlık Kısmı */}
    <div className="services-header">
      <p className="services-subtitle">Hizmetlerimiz</p>
      <h2 className="services-title">Size Özel Hizmetlerimiz</h2>
      <p className="services-description">
        Profesyonel ekibimizle sunduğumuz tüm hizmetleri aşağıda keşfedebilirsiniz.
      </p>
    </div>

    {/* Kartlar */}
    <div className="services-cards">
      {servicesData.map((svc, idx) => (
        <div className="service-card" key={idx}>
          <h3 className="service-card-title">{svc.title}</h3>
          <p className="service-card-desc">{svc.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Services;
