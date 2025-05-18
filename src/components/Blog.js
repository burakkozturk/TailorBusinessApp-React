import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, CircularProgress, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import '../styles/Blog.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Blog yazılarını getir
        const postsResponse = await axios.get('http://localhost:6767/api/posts');
        // Sadece ilk 3 blog yazısını göster
        const publishedPosts = postsResponse.data
          .filter(post => post.published)
          .slice(0, 3); // Ana sayfada sadece 3 blog göster
        setPosts(publishedPosts);
        
        // Kategorileri getir
        const categoriesResponse = await axios.get('http://localhost:6767/api/categories');
        setCategories(categoriesResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Veri çekilirken hata oluştu:', err);
        setError('Blog yazıları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchPostsByCategory = async (categoryId) => {
    if (!categoryId) {
      // Kategori seçimi kaldırılırsa tüm yayınlanan gönderileri göster
      const postsResponse = await axios.get('http://localhost:6767/api/posts');
      const publishedPosts = postsResponse.data.filter(post => post.published);
      setPosts(publishedPosts);
      setSelectedCategory(null);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:6767/api/posts/category/${categoryId}`);
      const publishedPosts = response.data.filter(post => post.published);
      setPosts(publishedPosts);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Kategori gönderileri yüklenirken hata oluştu:', error);
      setError('Kategori gönderileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:6767/api/posts/search?keyword=${searchTerm}`);
      const publishedPosts = response.data.filter(post => post.published);
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Arama yapılırken hata oluştu:', error);
      setError('Arama yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  return (
    <section className="blog-section">
      <div className="blog-container">
        {/* Başlık Kısmı - Diğer bileşenlerle uyumlu */}
        <div className="blog-header">
          <p className="blog-subtitle">Blogumuz</p>
          <h2 className="blog-title">Son Yazılarımız</h2>
          <p className="blog-description">
            Moda ve tekstil dünyasından son gelişmeleri, tasarımları ve ipuçlarını sizlerle paylaşıyoruz.
          </p>
        </div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography>Henüz blog yazısı bulunmuyor.</Typography>
          </Box>
        ) : (
          <div className="blog-grid">
            {posts.map(post => (
              <article key={post.id} className="blog-post">
                <div className="blog-image-container">
                  <img
                    src={post.featuredImage || '/img/default-blog.jpg'}
                    alt={post.title}
                    className="blog-image"
                  />
                  {post.categories && post.categories[0] && (
                    <span className="blog-category">{post.categories[0].name}</span>
                  )}
                </div>
                <div className="blog-content">
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-excerpt">{truncateText(post.content, 100)}</p>
                  <div className="blog-footer">
                    <Link to={`/blog/${post.urlSlug}`} className="blog-read-more">
                      DEVAMINI OKU
                    </Link>
                    <span className="blog-date">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {/* Tüm Blog Yazıları butonu */}
        <div className="blog-view-all">
          <Link to="/blog" className="blog-view-all-button">
            TÜM BLOG YAZILARI
          </Link>
        </div>
      </div>
    </section>
  );
}
