import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import About from '../components/About';
import '../styles/HomePage.css';
import Expertise from '../components/Expertise';
import Feature from '../components/Feature';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSlider />
      <About />
      <Expertise />
      <Feature />
      <Footer />
    </div>
  );
}

export default HomePage;