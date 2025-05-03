import React, { useState } from 'react';
import '../styles/Testimonials.css';

const testimonialsData = [
 {
    quote: 'Gerçekten harika hizmet! Kıyafetim tam istediğim gibi oldu, ustalık müthiş.',
    name: 'Ahmet Yılmaz',
 },
 {
    quote: 'Terzilikte sınır tanımıyorlar. Kumaş kalitesi ve işçilik kusursuz.',
    name: 'Mehmet Demir',
 },
 {
    quote: 'Beklentilerimin çok ötesindeydi. Kesim ve dikiş tam profesyonel.',
    name: 'Ayşe Kara',
 }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { quote, name, role } = testimonialsData[currentIndex];

  const prev = () => {
    setCurrentIndex((currentIndex + testimonialsData.length - 1) % testimonialsData.length);
  };
  
  const next = () => {
    setCurrentIndex((currentIndex + 1) % testimonialsData.length);
  };

  return (
    <div className="testimonials-container">
      <div className="testimonials-grid">
        {/* Left Column - Testimonial Content */}
        <div className="testimonials-content">
          <div className="testimonials-header">
            <h3 className="testimonials-subtitle">Müşterilerimizin Yorumları</h3>
            <h2 className="testimonials-title">Ne Dediler ? </h2>
          </div>
          
          <div className="testimonial-box">
            <p className="testimonial-quote">{quote}</p>
            
            <div className="testimonial-author-info">
              <h4 className="testimonial-author">{name}</h4>
              <p className="testimonial-role">{role}</p>
            </div>
          </div>
          
          <div className="testimonial-nav">
            <button 
              onClick={prev}
              className="nav-button"
            >
              <span className="visually-hidden">Previous</span>
              &lt;
            </button>
            <button 
              onClick={next}
              className="nav-button"
            >
              <span className="visually-hidden">Next</span>
              &gt;
            </button>
          </div>
        </div>
        
        {/* Right Column - Image */}
        <div className="testimonial-image-wrapper">
          <div className="testimonial-image-container">
            <img 
              src="../img/banner3.jpg" 
              alt="Testimonial" 
              className="testimonial-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}