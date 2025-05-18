import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  CircularProgress,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AboutPage.css';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPostBySlug = async () => {
      setLoading(true);
      try {
        // Tüm postları çek ve urlSlug'a göre filtrele
        const response = await axios.get('http://localhost:6767/api/posts');
        const foundPost = response.data.find(p => p.urlSlug === slug);
        
        if (!foundPost) {
          setError('Blog yazısı bulunamadı!');
          return;
        }
        
        setPost(foundPost);
        
        // İlgili gönderileri al (aynı kategorilerden)
        if (foundPost.categories && foundPost.categories.length > 0) {
          const categoryIds = foundPost.categories.map(cat => cat.id);
          let related = response.data.filter(p => 
            p.id !== foundPost.id && 
            p.published && 
            p.categories && 
            p.categories.some(cat => categoryIds.includes(cat.id))
          );
          
          // Son 3 ilgili gönderiyi göster
          setRelatedPosts(related.slice(0, 3));
        }
      } catch (err) {
        console.error('Blog yazısı getirilirken hata oluştu:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu!');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:6767/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Kategoriler yüklenirken hata oluştu:', err);
      }
    };

    fetchPostBySlug();
    fetchCategories();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            {error || 'Blog yazısı bulunamadı!'}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/blog')}
            sx={{ mt: 3 }}
          >
            Blog Ana Sayfasına Dön
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

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
    <>
      <Navbar />
      
      {/* Sub-Banner Eklendi */}
      <div className="about-banner">
        <div className="banner-heading">
          <p className="banner-subtitle">BLOG</p>
        </div>
      </div>
      
      <Box sx={{ py: 4, bgcolor: '#f7f9fc' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              component={Link} 
              to="/blog"
              sx={{ mb: 2 }}
            >
              Tüm Yazılar
            </Button>
            
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {post.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOfferIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  {post.categories && post.categories.map(category => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      component={Link}
                      to={`/blog/kategori/${category.urlSlug}`}
                      clickable
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2, mb: 4 }}>
                {post.featuredImage && (
                  <Box sx={{ width: '100%', height: 400, overflow: 'hidden' }}>
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  </Box>
                )}
                
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.8,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {post.content}
                  </Typography>
                </Box>
              </Paper>
              
              {relatedPosts.length > 0 && (
                <Box>
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    İlgili Yazılar
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {relatedPosts.map(relatedPost => (
                      <Grid item xs={12} sm={6} md={4} key={relatedPost.id}>
                        <Card 
                          sx={{ 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'translateY(-5px)'
                            }
                          }}
                        >
                          {relatedPost.featuredImage && (
                            <Box 
                              sx={{ 
                                height: 140, 
                                overflow: 'hidden' 
                              }}
                            >
                              <img 
                                src={relatedPost.featuredImage} 
                                alt={relatedPost.title} 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }} 
                              />
                            </Box>
                          )}
                          
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography 
                              variant="h6" 
                              component={Link} 
                              to={`/blog/${relatedPost.urlSlug}`}
                              sx={{ 
                                color: 'text.primary',
                                textDecoration: 'none',
                                '&:hover': {
                                  color: 'primary.main'
                                },
                                display: 'block',
                                mb: 1
                              }}
                            >
                              {relatedPost.title}
                            </Typography>
                            
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                              {formatDate(relatedPost.createdAt)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Kategoriler
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {categories.map(category => (
                    <ListItem 
                      key={category.id} 
                      component={Link} 
                      to={`/blog/kategori/${category.urlSlug}`}
                      sx={{ 
                        py: 1, 
                        px: 0,
                        borderBottom: '1px solid #eee',
                        textDecoration: 'none',
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      <Typography>
                        {category.name}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default BlogPostPage; 