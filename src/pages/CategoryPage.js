import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      setLoading(true);
      try {
        // Tüm kategorileri çek ve slug'a göre filtrele
        const categoriesResponse = await axios.get('http://localhost:6767/api/categories');
        const foundCategory = categoriesResponse.data.find(c => c.urlSlug === categorySlug);
        
        if (!foundCategory) {
          setError('Kategori bulunamadı!');
          return;
        }
        
        setCategory(foundCategory);
        
        // Kategoriye ait postları getir
        const postsResponse = await axios.get(`http://localhost:6767/api/posts/category/${foundCategory.id}`);
        const publishedPosts = postsResponse.data.filter(post => post.published);
        setPosts(publishedPosts);
      } catch (err) {
        console.error('Kategori ve postlar yüklenirken hata oluştu:', err);
        setError('Kategori ve ilgili yazılar yüklenirken bir hata oluştu!');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndPosts();
  }, [categorySlug]);

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

  if (error || !category) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            {error || 'Kategori bulunamadı!'}
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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#f7f9fc', py: 6 }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Ana Sayfa
            </Link>
            <Link to="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
              Blog
            </Link>
            <Typography color="text.primary">{category.name}</Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight="bold" 
              gutterBottom
              sx={{ position: 'relative', display: 'inline-block' }}
            >
              {category.name}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  width: 80, 
                  height: 4, 
                  bgcolor: 'primary.main', 
                  borderRadius: 2 
                }} 
              />
            </Typography>
            
            {category.description && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ mt: 4, maxWidth: 700, mx: 'auto' }}
              >
                {category.description}
              </Typography>
            )}
          </Box>

          {posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" gutterBottom>
                Bu kategoride henüz blog yazısı bulunmuyor.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/blog" 
                startIcon={<ArrowBackIcon />}
                sx={{ mt: 2 }}
              >
                Tüm Blog Yazılarına Dön
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {posts.map(post => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.featuredImage || '/img/default-blog.jpg'}
                        alt={post.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                        {post.categories && post.categories.slice(0, 2).map(cat => (
                          <Chip
                            key={cat.id}
                            label={cat.name}
                            color="primary"
                            size="small"
                            component={Link}
                            to={`/blog/kategori/${cat.urlSlug}`}
                            sx={{ 
                              m: 0.5, 
                              fontWeight: 'bold',
                              color: 'white',
                              textDecoration: 'none'
                            }}
                            clickable
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h6" 
                        component={Link} 
                        to={`/blog/${post.urlSlug}`}
                        sx={{ 
                          color: 'text.primary',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          mb: 2,
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                      >
                        {post.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, flexGrow: 1 }}
                      >
                        {truncateText(post.content, 120)}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center', 
                          mt: 'auto' 
                        }}
                      >
                        <Button 
                          component={Link}
                          to={`/blog/${post.urlSlug}`}
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          DEVAMINI OKU
                        </Button>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                        >
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CategoryPage; 