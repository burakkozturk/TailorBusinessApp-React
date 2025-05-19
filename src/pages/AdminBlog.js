import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Switch, FormControlLabel, Typography, Box, Stack, Chip, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Autocomplete, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { PhotoCamera } from '@mui/icons-material';
import '../styles/Customers.css';

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
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

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:6767/api/blogs');
      setBlogs(res.data);
      setError('');
    } catch (err) {
      setError('Bloglar yüklenemedi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:6767/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Kategoriler yüklenemedi:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

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

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = newBlog.imageUrl;
      if (image) {
        // Görseli S3'e yüklemek için formData oluşturulması
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadRes = await axios.post('http://localhost:6767/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadRes.data.url;
      }

      const payload = {
        title: newBlog.title,
        content: newBlog.content,
        imageUrl: imageUrl,
        published: newBlog.published,
        slug: newBlog.slug,
        categoryIds: selectedCategories.map(cat => cat.id)
      };

      if (editingBlog) {
        await axios.put(`http://localhost:6767/api/blogs/${editingBlog.id}`, payload);
        setSuccess('Blog başarıyla güncellendi');
      } else {
        await axios.post('http://localhost:6767/api/blogs', payload);
        setSuccess('Blog başarıyla oluşturuldu');
      }

      closeDialog();
      fetchBlogs();
    } catch (error) {
      console.error('Blog işlemi hatası:', error);
      setError(`Blog ${editingBlog ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:6767/api/blogs/${id}`);
      setSuccess('Blog silindi');
      fetchBlogs();
    } catch (err) {
      setError('Blog silinemedi');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('tr-TR');
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  return (
    <Box className="admin-blog-container" sx={{ p: 4, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600} color="#2c3e50">Blog Yönetimi</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => openDialog()}
        >
          Yeni Blog Ekle
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>
      )}

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Başlık</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Kategoriler</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Durum</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Oluşturulma Tarihi</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>İşlemler</TableCell>
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
                <TableRow key={blog.id}>
                  <TableCell>{blog.id}</TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>
                    {blog.categories && blog.categories.map(cat => (
                      <Chip key={cat.id} label={cat.name} size="small" sx={{ m: 0.2 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={blog.published ? "Yayında" : "Taslak"} 
                      color={blog.published ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(blog.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => openDialog(blog)}
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Blog Ekleme/Düzenleme Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingBlog ? 'Blog Düzenle' : 'Yeni Blog Ekle'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField 
              label="Başlık" 
              name="title" 
              value={newBlog.title} 
              onChange={handleInputChange} 
              fullWidth 
              required 
            />
            
            <TextField 
              label="URL Slug" 
              name="slug" 
              value={newBlog.slug} 
              onChange={handleInputChange} 
              fullWidth 
              required 
              helperText="Otomatik oluşturulur, gerekirse düzenleyebilirsiniz"
            />
            
            <Autocomplete
              multiple
              id="category-select"
              options={categories}
              value={selectedCategories}
              onChange={handleCategoryChange}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kategoriler"
                  placeholder="Kategoriler"
                />
              )}
            />
            
            <TextField 
              label="İçerik" 
              name="content" 
              value={newBlog.content} 
              onChange={handleInputChange} 
              fullWidth 
              required 
              multiline 
              rows={8} 
            />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Görsel</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                  Görsel Yükle
                </Button>
              </label>
              
              {imagePreview && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <img 
                    src={imagePreview}
                    alt="Önizleme" 
                    style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                  <IconButton 
                    size="small" 
                    sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                      setNewBlog(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={newBlog.published}
                  onChange={handleInputChange}
                  name="published"
                  color="primary"
                />
              }
              label="Yayınla"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>İptal</Button>
          <Button 
            onClick={handleCreateOrUpdate} 
            variant="contained" 
            color="primary"
            disabled={!newBlog.title || !newBlog.content || !newBlog.slug}
          >
            {editingBlog ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminBlog; 