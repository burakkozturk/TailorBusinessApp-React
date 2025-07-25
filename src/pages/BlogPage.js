import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blog from '../components/Blog';
import '../styles/AboutPage.css';
import '../styles/BlogPage.css';

export default function BlogPage() {
  useEffect(() => {
    // Sayfa yüklendiğinde en üste kaydır
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Banner bölümü */}
      <div className="blog-banner">
        <div className="banner-heading">
          <p className="banner-subtitle">BLOG</p>
        </div>
      </div>
      

              
        {/* Blog listesi */}
        <Blog homePage={false} />
      
      <Footer />
    </>
  );
} 