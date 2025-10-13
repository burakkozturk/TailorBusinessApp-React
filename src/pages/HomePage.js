import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import '../styles/HomePage.css';
import Services from '../components/Services';
import About from '../components/About';
import HomeGallerySlider from '../components/HomeGallerySlider';
import Blog from '../components/Blog';
import useDocumentTitle from '../hooks/useDocumentTitle';

function HomePage() {
  const { t } = useTranslation('common');
  useDocumentTitle(t('navigation.home'));
  
  return (
    <div className="home-page">
      <Navbar />
      <HeroSlider contactRoute="/randevu" />
      <About />
      <Services />
      <HomeGallerySlider />
      <Blog homePage={true} />
      <Footer />
    </div>
  );
}

export default HomePage;