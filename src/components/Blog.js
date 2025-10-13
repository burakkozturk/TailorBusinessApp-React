import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, CircularProgress } from '@mui/material';
import { extractYouTubeVideoId, getYouTubeThumbnail } from '../utils/youtubeUtils';
import '../styles/Blog.css';

export default function Blog({ homePage = false }) {
  const { t } = useTranslation('common');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        
        if (homePage) {
          response = await apiService.blogs.getTop(2); // Ana sayfada sadece 2 blog göster
        } else {
          response = await apiService.blogs.getAllPublished();
        }
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error(t('blog.dataFetchError'), err);
        setError(t('blog.error'));
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
      return t('blog.invalidDate');
    }
  };

  // Gösterilecek post listesini belirle
  const postsToDisplay = posts;

  return (
    <section className="blog-section">
      <div className="blog-container">
        {/* Başlık Kısmı - Diğer bileşenlerle uyumlu */}
        {homePage && (
          <div className="blog-header">
            <p className="blog-subtitle">{t('blog.subtitle')}</p>
            <h2 className="blog-title">{t('blog.title')}</h2>
            <p className="blog-description">
              {t('blog.description')}
            </p>
          </div>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        ) : postsToDisplay.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography>{t('blog.noPosts')}</Typography>
          </Box>
        ) : (
          <div className="blog-grid">
            {postsToDisplay.map(post => {
              // Thumbnail URL'ini belirle
              let thumbnailUrl = post.imageUrl;
              
              // Eğer YouTube URL'i varsa ve imageUrl yoksa, YouTube thumbnail'ini kullan
              if (!thumbnailUrl && post.youtubeUrl) {
                const videoId = extractYouTubeVideoId(post.youtubeUrl);
                if (videoId) {
                  thumbnailUrl = getYouTubeThumbnail(videoId, 'hqdefault');
                }
              }
              
              return (
                <article key={post.id} className="blog-post">
                  {/* Thumbnail Image */}
                  {thumbnailUrl && (
                    <div className="blog-image">
                      <img 
                        src={thumbnailUrl} 
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px 8px 0 0'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="blog-content">
                    {/* Kategori */}
                    {post.categories && post.categories.length > 0 && (
                      <span className="blog-category">{post.categories[0].name}</span>
                    )}
                    <h3 className="blog-post-title">{post.title}</h3>
                    <p className="blog-excerpt">{truncateText(post.content, 150)}</p>
                    <div className="blog-footer">
                      <Link to={`/blog/${post.slug}`} className="blog-read-more">
                        {t('blog.readMore')}
                      </Link>
                      <span className="blog-date">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
        )}
        
        {/* Ana sayfada olup olmadığına göre tüm blog yazıları butonunu göster/gizle */}
        {homePage && (
          <div className="blog-view-all">
            <Link to="/blog" className="btn-primary">
              {t('blog.viewAll') || 'TÜM BLOG YAZILARI'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
