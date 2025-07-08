import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Switch, FormControlLabel, Typography, Box, Stack, Chip, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Autocomplete, IconButton, Tabs, Tab, Divider, Container, Card, CardContent, Avatar, Grid, Badge, CircularProgress
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { PhotoCamera, Article, Category, Create } from '@mui/icons-material';
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
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Blog states
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newBlog, setNewBlog] = useState({ 
    title: '', 
    content: '', 
    imageUrl: '', 
    published: false,
    categoryIds: [],
    slug: ''
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Category states
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', slug: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await apiService.blogs.getAll();
      setBlogs(res.data);
      setSelectedCategories(res.data.map(blog => blog.categories || []));
    } catch (error) {
      console.error('Blog verileri çekilirken hata:', error);
      setError('Blog verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const res = await apiService.categories.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Kategoriler çekilirken hata:', error);
      setError('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
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

  const handleCategoryChange = (event, value) => {
    setSelectedCategories(value);
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
      setSelectedCategories(blog.categories || []);
      setImagePreview(blog.imageUrl);
    } else {
      setEditingBlog(null);
      setNewBlog({ 
        title: '', 
        content: '', 
        imageUrl: '', 
        published: false,
        categoryIds: [],
        slug: ''
      });
      setSelectedCategories([]);
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
      
      // Kategori ID'lerini düzenle
      const payload = {
        ...newBlog,
        categories: Array.isArray(selectedCategories) 
          ? selectedCategories.map(cat => typeof cat === 'object' ? cat : { id: cat })
          : []
      };
      
      let response;
      if (editingBlog) {
        response = await apiService.blogs.update(editingBlog.id, payload);
        setSuccess('Blog başarıyla güncellendi');
      } else {
        response = await apiService.blogs.create(payload);
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

  // Category Operations
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
    
    // URL slug'ını otomatik oluşturalım
    if (name === 'name' && !editingCategory) {
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
      
      setNewCategory(prev => ({ ...prev, slug: slug }));
    }
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
    setNewCategory({ name: '', description: '', slug: '' });
    setEditingCategory(null);
  };

  const handleCategoryDialogOpen = (category = null) => {
    if (category) {
      setNewCategory(category);
      setEditingCategory(category);
    } else {
      setNewCategory({ name: '', description: '', slug: '' });
      setEditingCategory(null);
    }
    setCategoryDialogOpen(true);
  };

  const handleCategorySave = async () => {
    if (!newCategory.name || newCategory.name.trim() === '') {
      setError('Kategori adı boş olamaz');
      return;
    }
    
    if (!newCategory.slug || newCategory.slug.trim() === '') {
      setError('Kategori URL değeri boş olamaz');
      return;
    }
    
    setCategorySubmitting(true);
    
    try {
      setError('');
      
      if (editingCategory) {
        await apiService.categories.update(newCategory.id, newCategory);
        setSuccess('Kategori başarıyla güncellendi');
      } else {
        await apiService.categories.create(newCategory);
        setSuccess('Kategori başarıyla oluşturuldu');
      }
      
      fetchCategories();
      handleCategoryDialogClose();
    } catch (error) {
      console.error('Kategori kaydedilirken hata:', error);
      setError('Kategori kaydedilirken bir hata oluştu');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setCategoryLoading(true);
      await apiService.categories.delete(id);
      fetchCategories();
      setSuccess('Kategori başarıyla silindi');
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      setError('Kategori silinirken bir hata oluştu');
    } finally {
      setCategoryLoading(false);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      fetchCategories(); // Kategori tab'ı açıldığında refresh
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Card */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <CardContent sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
                <Create sx={{ mr: 2, fontSize: '2.5rem' }} />
                Blog Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Blog yazıları ve kategorileri oluşturun, düzenleyin ve yönetin
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <Create sx={{ fontSize: '2.5rem' }} />
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
                  {categories.length}
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <StyledButton 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={tabValue === 0 ? () => openDialog() : () => handleCategoryDialogOpen()}
          sx={{ fontWeight: 'bold' }}
        >
          {tabValue === 0 ? 'Yeni Blog Ekle' : 'Yeni Kategori Ekle'}
        </StyledButton>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Blog Yazıları (${blogs.length})`} />
          <Tab label={`Kategoriler (${categories.length})`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 ? (
        // Blog Management Tab
        <>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Blog yazıları burada yönetilir. Yeni yazı ekleyebilir, mevcut yazıları düzenleyebilir ve silebilirsiniz.
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Resim</StyledTableCell>
                  <StyledTableCell>Başlık</StyledTableCell>
                  <StyledTableCell>Kategoriler</StyledTableCell>
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
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {blog.categories?.map((cat) => (
                            <Chip 
                              key={cat.id} 
                              label={cat.name} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          ))}
                        </Stack>
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
        </>
      ) : (
        // Category Management Tab
        <>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Blog kategorileri burada yönetilir. Kategoriler blog yazılarını gruplandırmak için kullanılır.
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Kategori Adı</StyledTableCell>
                  <StyledTableCell>URL</StyledTableCell>
                  <StyledTableCell>Açıklama</StyledTableCell>
                  <StyledTableCell align="center">İşlemler</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Yükleniyor...</TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Henüz kategori bulunmuyor</TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <StyledTableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {category.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleCategoryDialogOpen(category)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleCategoryDelete(category.id)}
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
        </>
      )}

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

            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option) => option.name}
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kategoriler"
                  margin="normal"
                  fullWidth
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
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

      {/* Category Dialog */}
      <Dialog 
        open={categoryDialogOpen} 
        onClose={handleCategoryDialogClose}
        maxWidth="sm"
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
            <Category color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            name="name"
            label="Kategori Adı"
            value={newCategory.name}
            onChange={handleCategoryInputChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            name="slug"
            label="URL (Slug)"
            value={newCategory.slug}
            onChange={handleCategoryInputChange}
            fullWidth
            margin="normal"
            required
            helperText="URL'de kullanılacak olan değer (otomatik oluşturulur)"
          />

          <TextField
            name="description"
            label="Açıklama"
            value={newCategory.description}
            onChange={handleCategoryInputChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCategoryDialogClose}
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleCategorySave}
            variant="contained"
            disabled={categorySubmitting || !newCategory.name.trim() || !newCategory.slug.trim()}
            sx={{ fontWeight: 'bold' }}
          >
            {editingCategory ? 'Güncelle' : 'Ekle'}
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