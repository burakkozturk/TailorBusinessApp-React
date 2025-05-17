import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Switch, FormControlLabel, Typography, Box, Stack
} from '@mui/material';
import '../styles/Customers.css';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '', featuredImage: '', published: false });
  const [editingPost, setEditingPost] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/posts');
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError('Bloglar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/posts', newPost);
      setNewPost({ title: '', content: '', featuredImage: '', published: false });
      setSuccess('Blog başarıyla eklendi');
      fetchPosts();
    } catch (err) {
      setError('Blog eklenemedi');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
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
      await axios.put(`http://localhost:8080/api/posts/${editingPost.id}`, editingPost);
      setEditingPost(null);
      setDialogOpen(false);
      setSuccess('Blog güncellendi');
      fetchPosts();
    } catch (err) {
      setError('Blog güncellenemedi');
    }
  };

  return (
    <Box className="admin-blog-container" sx={{ p: 4, width: '100%' }}>
      <Typography variant="h4" fontWeight={600} mb={3} color="#2c3e50">Blog Yönetimi</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end" mb={4}>
        <TextField label="Başlık" name="title" value={newPost.title} onChange={handleInputChange} required size="small" sx={{ minWidth: 200 }} />
        <TextField label="Görsel URL" name="featuredImage" value={newPost.featuredImage} onChange={handleInputChange} size="small" sx={{ minWidth: 200 }} />
        <FormControlLabel control={<Switch checked={newPost.published} onChange={e => setNewPost(prev => ({ ...prev, published: e.target.checked }))} name="published" />} label="Yayında mı?" />
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ height: 40 }}>Ekle</Button>
      </Stack>
      <TextField label="İçerik" name="content" value={newPost.content} onChange={handleInputChange} required multiline rows={3} fullWidth sx={{ mb: 4 }} />
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Başlık</TableCell>
              <TableCell>Görsel</TableCell>
              <TableCell>Yayın</TableCell>
              <TableCell>Oluşturulma</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Blog bulunamadı</TableCell>
              </TableRow>
            ) : (
              posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.featuredImage ? <img src={post.featuredImage} alt="" width={60} style={{ borderRadius: 8 }} /> : '-'}</TableCell>
                  <TableCell>{post.published ? 'Evet' : 'Hayır'}</TableCell>
                  <TableCell>{post.createdAt ? new Date(post.createdAt).toLocaleString('tr-TR') : ''}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(post)} sx={{ mr: 1 }}>Düzenle</Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(post.id)}>Sil</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Blog Düzenle</DialogTitle>
        <DialogContent>
          {editingPost && (
            <Stack spacing={2} mt={1}>
              <TextField label="Başlık" name="title" value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} required />
              <TextField label="Görsel URL" name="featuredImage" value={editingPost.featuredImage} onChange={e => setEditingPost({ ...editingPost, featuredImage: e.target.value })} />
              <FormControlLabel control={<Switch checked={editingPost.published} onChange={e => setEditingPost({ ...editingPost, published: e.target.checked })} name="published" />} label="Yayında mı?" />
              <TextField label="İçerik" name="content" value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} required multiline rows={4} />
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