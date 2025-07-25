import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Switch, FormControlLabel, Typography, Box, Stack, Chip, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Autocomplete, IconButton, Tabs, Tab, Divider, Container, Card, CardContent, Avatar, Grid, Badge, CircularProgress, useTheme, useMediaQuery
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { PhotoCamera, Article, Category, Create, YouTube, VideoLibrary } from '@mui/icons-material';
import useDocumentTitle from '../hooks/useDocumentTitle';
import '../styles/Customers.css';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transition: 'background-color 0.2s ease',
  },
  '& td': {
    padding: theme.spacing(2),
  }
}));

function AdminBlog() {
  useDocumentTitle('Blog Yönetimi');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Blog states
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newBlog, setNewBlog] = useState({ 
    title: '', 
    content: '', 
    imageUrl: '', 
    youtubeUrl: '',
    metaDescription: '',
    metaKeywords: '',
    published: false,
    slug: ''
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await apiService.blogs.getAll();
      setBlogs(res.data);
    } catch (error) {
      console.error('Blog verileri çekilirken hata:', error);
      setError('Blog verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Blog Operations
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBlog(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // URL slug'ını otomatik oluşturalım
    if (name === 'title' && !editingBlog) {
      const slug = value.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setNewBlog(prev => ({ ...prev, slug: slug }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setNewBlog(blog);
      setImagePreview(blog.imageUrl);
    } else {
      setEditingBlog(null);
      setNewBlog({ 
        title: '', 
        content: '', 
        imageUrl: '', 
        youtubeUrl: '',
        metaDescription: '',
        metaKeywords: '',
        published: false,
        slug: ''
      });
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingBlog(null);
    setImage(null);
    setImagePreview(null);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Resim formatı ve boyut kontrolü yap
    if (!file.type.match('image.*')) {
      setError('Lütfen bir resim dosyası seçin');
      return;
    }
    
    if (file.size > 5242880) { // 5MB
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const uploadRes = await apiService.upload.uploadFile(formData);
      
      if (uploadRes.data && uploadRes.data.url) {
        setNewBlog(prev => ({ ...prev, imageUrl: uploadRes.data.url }));
        setError('');
      } else {
        throw new Error('Resim URL\'i alınamadı');
      }
    } catch (error) {
      console.error('Resim yüklenirken hata:', error);
      setError('Resim yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let response;
      if (editingBlog) {
        response = await apiService.blogs.update(editingBlog.id, newBlog);
        setSuccess('Blog başarıyla güncellendi');
      } else {
        response = await apiService.blogs.create(newBlog);
        setSuccess('Blog başarıyla oluşturuldu');
      }
      
      fetchBlogs();
      closeDialog();
    } catch (error) {
      console.error('Blog kaydedilirken hata:', error);
      setError('Blog kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.blogs.delete(id);
      setSuccess('Blog yazısı başarıyla silindi');
      fetchBlogs();
    } catch (error) {
      console.error('Blog silinirken hata:', error);
      setError('Blog silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Card */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <CardContent sx={{ py: { xs: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 }
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                fontWeight: 700, 
                mb: 1, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <Create sx={{ mr: 2, fontSize: { xs: '2rem', md: '2.5rem' } }} />
                Blog Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ 
                opacity: 0.9, 
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}>
                Blog yazıları ve kategorileri oluşturun, düzenleyin ve yönetin
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: { xs: 60, md: 80 }, 
              height: { xs: 60, md: 80 }, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <Create sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {blogs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Blog Yazısı
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Article />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {blogs.filter(blog => blog.published).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yayında Olan
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <Article />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {/* Removed categories count */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Kategori
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Category />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Button */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: { xs: 'center', md: 'flex-end' }, 
        mb: 3 
      }}>
        <StyledButton 
          variant="contained" 
          color="primary" 
          startIcon={isMobile ? null : <AddIcon />} 
          onClick={() => openDialog()}
          sx={{ 
            fontWeight: 'bold',
            minWidth: { xs: '200px', md: 'auto' }
          }}
        >
          {isMobile ? <AddIcon sx={{ mr: 1 }} /> : null}
          Yeni Blog Ekle
        </StyledButton>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={0} onChange={() => {}}>
          <Tab label={`Blog Yazıları (${blogs.length})`} />
          {/* Removed Category Tab */}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {/* Blog Management Tab */}
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Blog yazıları burada yönetilir. Yeni yazı ekleyebilir, mevcut yazıları düzenleyebilir ve silebilirsiniz.
        </Typography>

        {/* Desktop Table View */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Resim</StyledTableCell>
                  <StyledTableCell>Başlık</StyledTableCell>
                  <StyledTableCell>Video</StyledTableCell>
                  <StyledTableCell>Durum</StyledTableCell>
                  <StyledTableCell>Tarih</StyledTableCell>
                  <StyledTableCell align="center">İşlemler</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Yükleniyor...</TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Henüz blog yazısı bulunmuyor</TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <StyledTableRow key={blog.id}>
                      <TableCell>
                        {blog.imageUrl ? (
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                        ) : (
                          <Box sx={{ 
                            width: 60, 
                            height: 60, 
                            backgroundColor: '#f0f0f0', 
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <PhotoCamera sx={{ color: '#ccc' }} />
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {blog.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {blog.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {blog.youtubeUrl ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <YouTube sx={{ color: '#ff0000', fontSize: 20 }} />
                            <Typography variant="caption" color="text.secondary">
                              Video Var
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={blog.published ? 'Yayında' : 'Taslak'} 
                          color={blog.published ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(blog.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openDialog(blog)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Mobile Card View */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box>
            {loading ? (
              <Card sx={{ borderRadius: 2, textAlign: 'center', py: 4 }}>
                <CardContent>
                  <CircularProgress />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Yükleniyor...
                  </Typography>
                </CardContent>
              </Card>
            ) : blogs.length === 0 ? (
              <Card sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
                <CardContent>
                  <Create sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Henüz blog yazısı bulunmuyor
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Yeni blog yazısı eklemek için yukarıdaki butonu kullanabilirsiniz.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {blogs.map((blog) => (
                  <Card key={blog.id} sx={{ 
                    borderRadius: 2, 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          {blog.imageUrl ? (
                            <img 
                              src={blog.imageUrl} 
                              alt={blog.title}
                              style={{
                                width: 48,
                                height: 48,
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                            />
                          ) : (
                            <Box sx={{ 
                              width: 48, 
                              height: 48, 
                              backgroundColor: '#f0f0f0', 
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <PhotoCamera sx={{ color: '#ccc', fontSize: '1.5rem' }} />
                            </Box>
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {blog.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              {blog.slug}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                              <Chip 
                                label={blog.published ? 'Yayında' : 'Taslak'} 
                                color={blog.published ? 'success' : 'warning'}
                                size="small"
                              />
                              {blog.youtubeUrl && (
                                <Chip 
                                  icon={<YouTube />}
                                  label="Video" 
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => openDialog(blog)}
                            sx={{ 
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'primary.dark' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(blog.id)}
                            sx={{ 
                              backgroundColor: 'error.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'error.dark' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="body2" color="text.secondary">
                        <strong>Oluşturulma Tarihi:</strong> {formatDate(blog.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      {/* Blog Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={closeDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Article color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {editingBlog ? 'Blog Düzenle' : 'Yeni Blog Ekle'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              name="title"
              label="Başlık"
              value={newBlog.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              name="slug"
              label="URL (Slug)"
              value={newBlog.slug}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              helperText="URL'de kullanılacak olan değer (otomatik oluşturulur)"
            />

            <TextField
              name="content"
              label="İçerik"
              value={newBlog.content}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={6}
              margin="normal"
              required
            />

            <TextField
              name="youtubeUrl"
              label="YouTube Video URL (İsteğe Bağlı)"
              value={newBlog.youtubeUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              placeholder="https://www.youtube.com/watch?v=..."
              helperText="YouTube videosunun URL'ini girin. Video blog yazısında gömülü olarak gösterilecek."
            />

            <TextField
              name="metaDescription"
              label="Meta Açıklama (SEO)"
              value={newBlog.metaDescription}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              margin="normal"
              placeholder="Bu blog yazısının kısa açıklaması..."
              helperText="Arama motorları için açıklama (160 karakter önerilir)"
            />

            <TextField
              name="metaKeywords"
              label="Anahtar Kelimeler (SEO)"
              value={newBlog.metaKeywords}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              placeholder="moda, terzilik, stil"
              helperText="Virgül ile ayrılmış anahtar kelimeler"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Öne Çıkan Resim
              </Typography>
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
              >
                Resim Seç
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUpload}
                />
              </Button>
              
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={imagePreview} 
                    alt="Önizleme" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }} 
                  />
                </Box>
              )}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={newBlog.published}
                  onChange={handleInputChange}
                  name="published"
                />
              }
              label="Yayında"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={closeDialog}
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ fontWeight: 'bold' }}
          >
            {editingBlog ? 'Güncelle' : 'Ekle'}
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Success/Error Alerts */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccess('')} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px'
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px'
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminBlog; 