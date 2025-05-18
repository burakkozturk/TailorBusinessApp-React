import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Switch, FormControlLabel, Typography, Box, Stack, Chip, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import '../styles/Customers.css';

function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    featuredImage: '', 
    published: false,
    categories: [],
    urlSlug: ''
  });
  const [editingPost, setEditingPost] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:6767/api/posts');
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError('Bloglar yüklenemedi');
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
    fetchPosts();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // URL slug'ını otomatik oluşturalım
    if (name === 'title' && !editingPost) {
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
      
      setNewPost(prev => ({ ...prev, urlSlug: slug }));
    }
  };

  const handleCategoryChange = (event, newValues) => {
    if (editingPost) {
      setEditingPost({...editingPost, categories: newValues});
    } else {
      setNewPost({...newPost, categories: newValues});
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:6767/api/posts', newPost);
      setNewPost({ 
        title: '', 
        content: '', 
        featuredImage: '', 
        published: false,
        categories: [],
        urlSlug: ''
      });
      setSuccess('Blog başarıyla eklendi');
      fetchPosts();
    } catch (err) {
      setError('Blog eklenemedi');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:6767/api/posts/${id}`);
      setSuccess('Blog silindi');
      fetchPosts();
    } catch (err) {
      setError('Blog silinemedi');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:6767/api/posts/${editingPost.id}`, editingPost);
      setEditingPost(null);
      setDialogOpen(false);
      setSuccess('Blog güncellendi');
      fetchPosts();
    } catch (err) {
      setError('Blog güncellenemedi');
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
      <Typography variant="h4" fontWeight={600} mb={3} color="#2c3e50">Blog Yönetimi</Typography>
      
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" mb={2}>Yeni Blog Ekle</Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField 
              label="Başlık" 
              name="title" 
              value={newPost.title} 
              onChange={handleInputChange} 
              required 
              sx={{ flexGrow: 1, minWidth: '250px' }} 
            />
            
            <TextField 
              label="URL Slug" 
              name="urlSlug" 
              value={newPost.urlSlug} 
              onChange={handleInputChange} 
              required 
              sx={{ flexGrow: 1, minWidth: '250px' }} 
              helperText="Özel karakterler içermeyen URL-dostu metin"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField 
              label="Görsel URL" 
              name="featuredImage" 
              value={newPost.featuredImage} 
              onChange={handleInputChange} 
              sx={{ flexGrow: 1 }} 
            />
            
            <FormControlLabel 
              control={
                <Switch 
                  checked={newPost.published} 
                  onChange={e => setNewPost(prev => ({ ...prev, published: e.target.checked }))} 
                  name="published" 
                />
              } 
              label="Yayında mı?" 
            />
          </Box>
          
          <Autocomplete
            multiple
            options={categories}
            getOptionLabel={(option) => option.name}
            value={newPost.categories}
            onChange={handleCategoryChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Kategoriler"
                placeholder="Kategori seçiniz"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} />
              ))
            }
          />
          
          <TextField 
            label="İçerik" 
            name="content" 
            value={newPost.content} 
            onChange={handleInputChange} 
            required 
            multiline 
            rows={5} 
            fullWidth 
          />
          
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCreate}
              startIcon={<AddIcon />}
            >
              Blog Ekle
            </Button>
          </Box>
        </Stack>
      </Paper>
      
      <TableContainer component={Paper} className="table-container" elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Başlık</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Kategoriler</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Yayın</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Oluşturulma</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Blog bulunamadı</TableCell>
              </TableRow>
            ) : (
              posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.urlSlug}</TableCell>
                  <TableCell>
                    {post.categories && post.categories.map(category => (
                      <Chip 
                        key={category.id} 
                        label={category.name} 
                        size="small" 
                        sx={{ m: 0.3 }} 
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={post.published ? "Yayında" : "Taslak"} 
                      color={post.published ? "success" : "default"} 
                      size="small" 
                      variant={post.published ? "filled" : "outlined"} 
                    />
                  </TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small" 
                      onClick={() => handleEdit(post)} 
                      sx={{ mr: 1 }}
                      startIcon={<EditIcon />}
                    >
                      Düzenle
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      onClick={() => handleDelete(post.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Blog Düzenle</DialogTitle>
        <DialogContent>
          {editingPost && (
            <Stack spacing={2} mt={1}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="Başlık" 
                  name="title" 
                  value={editingPost.title} 
                  onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} 
                  required 
                  fullWidth 
                />
                
                <TextField 
                  label="URL Slug" 
                  name="urlSlug" 
                  value={editingPost.urlSlug} 
                  onChange={e => setEditingPost({ ...editingPost, urlSlug: e.target.value })} 
                  required 
                  fullWidth 
                  helperText="URL-dostu metin"
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField 
                  label="Görsel URL" 
                  name="featuredImage" 
                  value={editingPost.featuredImage || ''} 
                  onChange={e => setEditingPost({ ...editingPost, featuredImage: e.target.value })} 
                  fullWidth 
                />
                
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={editingPost.published} 
                      onChange={e => setEditingPost({ ...editingPost, published: e.target.checked })} 
                      name="published" 
                    />
                  } 
                  label="Yayında mı?" 
                />
              </Box>
              
              <Autocomplete
                multiple
                options={categories}
                getOptionLabel={(option) => option.name}
                value={editingPost.categories || []}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Kategoriler"
                    placeholder="Kategori seçiniz"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.name} {...getTagProps({ index })} />
                  ))
                }
              />
              
              <TextField 
                label="İçerik" 
                name="content" 
                value={editingPost.content} 
                onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} 
                required 
                multiline 
                rows={5} 
                fullWidth 
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Vazgeç</Button>
          <Button onClick={handleUpdate} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminBlog; 