import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import '../styles/HomePage.css';
import Services from '../components/Services';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Blog from '../components/Blog';

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSlider />
      <About />
      <Services />
      <Testimonials />
      <Blog />
      <Footer />
    </div>
  );
}

export default HomePage;