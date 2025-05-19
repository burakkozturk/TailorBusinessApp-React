import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blog from '../components/Blog';
import axios from 'axios';
import { Typography, Box, Chip, Container, Grid, CircularProgress, Card, CardContent } from '@mui/material';
import '../styles/AboutPage.css';
import '../styles/BlogPage.css';

export default function BlogPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:6767/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    // Sayfa yüklendiğinde en üste kaydır
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Seçili kategori adını bul
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.name : null;
  };

  const selectedCategoryName = getSelectedCategoryName();

  return (
    <>
      <Navbar />
      
      {/* Banner bölümü */}
      <div className="blog-banner">
        <div className="banner-heading">
          <p className="banner-subtitle">BLOG</p>
        </div>
      </div>
      
      <Container maxWidth="lg">
        {/* Kategori kartı */}
        <div className="category-container">
          <h2 className="category-title">
            Kategorilere Göre Keşfedin
          </h2>
          
          <div className="category-chips">
            <Chip 
              label="Tümü" 
              onClick={() => setSelectedCategory(null)}
              className={`category-chip ${selectedCategory === null ? 'active' : ''}`}
              color={selectedCategory === null ? "primary" : "default"}
            />
            {categories.map(category => (
              <Chip 
                key={category.id}
                label={category.name}
                onClick={() => handleCategoryClick(category.id)}
                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                color={selectedCategory === category.id ? "primary" : "default"}
              />
            ))}
          </div>
        </div>
      </Container>
      
      {/* Blog listesi - seçilen kategori bilgisini iletiyoruz */}
      <Blog homePage={false} selectedCategory={selectedCategory} />
      
      <Footer />
    </>
  );
} 