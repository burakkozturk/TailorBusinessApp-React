import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, CircularProgress, Paper, Breadcrumbs, Divider } from '@mui/material';
import { YouTube, PlayCircle } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { extractYouTubeVideoId, getYouTubeThumbnail } from '../utils/youtubeUtils';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      setLoading(true);
      try {
        // Önce kategori bilgilerini al
        const categoryResponse = await apiService.categories.getBySlug(categorySlug);
        setCategory(categoryResponse.data);
        
        // Sonra kategori ID'si ile blog yazılarını al
        const postsResponse = await apiService.blogs.getByCategory(categoryResponse.data.id);
        setPosts(postsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Veri çekilirken hata:', err);
        setError('Kategori veya blog yazıları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryAndPosts();
    }
  }, [categorySlug]);

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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <>
      <Navbar />
      <div className="category-banner">
        <Container>
          <Typography variant="h4" className="banner-title" sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
            {category ? category.name : 'Kategori'}
          </Typography>
        </Container>
      </div>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        ) : category ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link to="/" className="breadcrumb-link">Ana Sayfa</Link>
                <Link to="/blog" className="breadcrumb-link">Blog</Link>
                <Typography color="text.primary">{category.name}</Typography>
              </Breadcrumbs>
              
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {category.name} Kategorisindeki Yazılar
              </Typography>
              
              {category.description && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {category.description}
                </Typography>
              )}
              
              <Divider sx={{ my: 3 }} />
            </Box>

            {posts.length > 0 ? (
              <Grid container spacing={4}>
                {posts.map(post => {
                  // YouTube video ID'si varsa thumbnail kullan
                  const youtubeVideoId = post.youtubeUrl ? extractYouTubeVideoId(post.youtubeUrl) : null;
                  const thumbnailUrl = youtubeVideoId 
                    ? getYouTubeThumbnail(youtubeVideoId, 'hqdefault')
                    : post.imageUrl || '/img/default-blog.jpg';
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6
                        }
                      }}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={thumbnailUrl}
                            alt={post.title}
                          />
                          
                          {/* Video Play Overlay */}
                          {youtubeVideoId && (
                            <Box sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              '&:hover': { opacity: 1 }
                            }}>
                              <PlayCircle sx={{ 
                                fontSize: 60, 
                                color: 'rgba(255, 255, 255, 0.9)',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                              }} />
                              
                              {/* YouTube Badge */}
                              <Box sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}>
                                <YouTube sx={{ color: '#ff0000', fontSize: 16 }} />
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                  YouTube
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {formatDate(post.createdAt)}
                        </Typography>
                        
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {post.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {truncateText(post.content, 100)}
                        </Typography>
                        
                        <Link to={`/blog/${post.slug}`} className="read-more-link">
                          Devamını Oku
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">
                  Bu kategoride henüz blog yazısı bulunmuyor.
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Daha sonra tekrar kontrol edebilir veya diğer kategorilerdeki yazıları inceleyebilirsiniz.
                </Typography>
                <Link to="/blog" className="back-to-blog-link">
                  Tüm Blog Yazılarına Dön
                </Link>
              </Paper>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography>Kategori bulunamadı.</Typography>
            <Link to="/blog" className="back-to-blog-link">
              Tüm Blog Yazılarına Dön
            </Link>
          </Box>
        )}
      </Container>
      
      <Footer />
    </>
  );
};

export default CategoryPage; 