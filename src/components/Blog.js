import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, CircularProgress } from '@mui/material';
import '../styles/Blog.css';

export default function Blog({ homePage = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/blogs/published';
        
        if (homePage) {
          endpoint = '/api/blogs/top/2'; // Ana sayfada sadece 2 blog göster
        }
        
        const response = await axios.get(`http://localhost:6767${endpoint}`);
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error('Veri çekilirken hata oluştu:', err);
        setError('Blog yazıları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [homePage]);

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
                    src={post.imageUrl || '/img/default-blog.jpg'}
                    alt={post.title}
                    className="blog-image"
                  />
                  {post.categories && post.categories.length > 0 && (
                    <span className="blog-category">{post.categories[0].name}</span>
                  )}
                </div>
                <div className="blog-content">
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-excerpt">{truncateText(post.content, 100)}</p>
                  <div className="blog-footer">
                    <Link to={`/blog/${post.slug}`} className="blog-read-more">
                      DEVAMINI OKU
                    </Link>
                    <span className="blog-date">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {/* Ana sayfada olup olmadığına göre tüm blog yazıları butonunu göster/gizle */}
        {homePage && (
          <div className="blog-view-all">
            <Link to="/blog" className="blog-view-all-button">
              TÜM BLOG YAZILARI
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
