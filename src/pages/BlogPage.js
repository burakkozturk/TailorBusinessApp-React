import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blog from '../components/Blog';
import '../styles/AboutPage.css';

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <div className="about-banner">
        <div className="banner-heading">
          <p className="banner-subtitle">BLOG</p>
        </div>
      </div>
      <Blog />
      <Footer />
    </>
  );
} 