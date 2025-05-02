// src/components/Feature.js
import React from 'react';
import '../styles/Feature.css';

const Feature = () => (
  <section className="feature-section">
    <div className="feature-container">
      <div className="feature-text">
        <h2>Lorem Ipsum Dolor Sit Amet</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <button className="feature-button">Daha Fazla</button>
      </div>
      <div className="feature-images">
        <img
          src="/img/feature1.jpg"
          alt="Placeholder 1"
          className="feature-img img-1"
        />
        <img
          src="/img/feature2.jpg"
          alt="Placeholder 2"
          className="feature-img img-2"
        />
      </div>
    </div>
  </section>
);

export default Feature;
