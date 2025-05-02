import React, { useEffect, useState } from 'react';
import '../styles/HeroSlider.css';

const slides = [
  {
    image: '/img/main-banner.jpg',
    subtitle: 'ERDAL GÜDA',
    title: "Her Detayda Ustalık",
    description: 'Gerçek stil zamansızdır. Erdal Güda ile kişiye özel dikimin kusursuzluğunu keşfedin.'
  },
  {
    image: '/img/banner2.jpg',
    subtitle: 'ERDAL GÜDA',
    title: 'Size Özel Ürünler',
    description: 'Vücut ölçülerinize göre üretilmiş, el işçiliğiyle tamamlanmış takım elbiseler ile kendinizi ifade edin.'
  },
  {
    image: '/img/banner3.jpg',
    subtitle: 'ERDAL GÜDA',
    title: 'Her Detayda Ustalık',
    description: 'Kumaştan düğmeye, yaka formundan ilik dikişine kadar her şey siz düşünülerek tasarlanır.'
  }
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider-wrapper">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2 className="hero-subtitle">{slides[current].subtitle}</h2>
        <h1 className="hero-title">{slides[current].title}</h1>
        <p className="hero-description">{slides[current].description}</p>
        <button className="hero-button">Randevu Al</button>
      </div>
    </div>
  );
}

export default HeroSlider;
