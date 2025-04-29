// src/pages/HomePage.js
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import '../styles/HomePage.css';
import HeroSlider from '../components/HeroSlider';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSlider />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </div>
  );
}

export default HomePage; 