import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Container, Chip, CircularProgress, Grid, Paper, Divider } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/BlogPostPage.css';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://erdalguda.online/api/blogs/slug/${slug}`);
        setPost(response.data);
        setError(null);

        // Eğer post'un kategorileri varsa, ilgili yazıları getir
        if (response.data.categories && response.data.categories.length > 0) {
          const categoryId = response.data.categories[0].id;
          const relatedResponse = await axios.get(`https://erdalguda.online/api/blogs/category/${categoryId}`);
          
          // Aynı yazıyı hariç tut ve en fazla 3 ilgili yazı göster
          const filtered = relatedResponse.data
            .filter(p => p.id !== response.data.id && p.published)
            .slice(0, 3);
            
          setRelatedPosts(filtered);
        }
      } catch (err) {
        console.error('Blog yazısı yüklenirken hata oluştu:', err);
        setError('Blog yazısı yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
    
    // Sayfa yüklendiğinde en üste scroll
    window.scrollTo(0, 0);
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
      <div className="blog-post-banner">
        <Container>
          <Typography variant="h4" className="banner-title">
            Blog Yazımız
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
        ) : post ? (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" className="blog-title" gutterBottom>
                  {post.title}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {post.categories && post.categories.map(category => (
                      <Chip 
                        key={category.id} 
                        label={category.name} 
                        component={Link} 
                        to={`/blog/kategori/${category.slug}`}
                        clickable
                        className="category-chip"
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" className="related-post-date">
                    {formatDate(post.createdAt)}
                  </Typography>
                </Box>
                
                {post.imageUrl && (
                  <div className="blog-image-container">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                )}
                
                <div className="blog-content">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                <Typography variant="h6" className="related-posts-title" gutterBottom>
                  İlgili Yazılar
                </Typography>
                
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((related, index) => (
                    <Box key={related.id} sx={{ mb: 2 }}>
                      <Link to={`/blog/${related.slug}`} className="related-post-link">
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {related.imageUrl && (
                            <Box sx={{ flexShrink: 0, width: 80, height: 80, overflow: 'hidden', borderRadius: 1 }}>
                              <img 
                                src={related.imageUrl} 
                                alt={related.title}
                                className="related-post-image" 
                                style={{ width: '100%', height: '100%' }}
                              />
                            </Box>
                          )}
                          <Box>
                            <Typography variant="subtitle1" className="related-post-title">
                              {related.title}
                            </Typography>
                            <Typography variant="body2" className="related-post-date">
                              {formatDate(related.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                      {index < relatedPosts.length - 1 && (
                        <Divider sx={{ my: 2 }} />
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    İlgili yazı bulunamadı.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography>Blog yazısı bulunamadı.</Typography>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default BlogPostPage; 