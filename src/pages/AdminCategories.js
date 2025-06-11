import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', slug: '' });
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://erdalguda.online/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      setError('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
    
    // URL slug'ını otomatik oluşturalım
    if (name === 'name' && !editMode) {
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCategory({ name: '', description: '', slug: '' });
    setEditMode(false);
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setNewCategory(category);
      setEditMode(true);
    } else {
      setNewCategory({ name: '', description: '', slug: '' });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!newCategory.name || newCategory.name.trim() === '') {
      setError('Kategori adı boş olamaz');
      return;
    }
    
    if (!newCategory.slug || newCategory.slug.trim() === '') {
      setError('Kategori URL değeri boş olamaz');
      return;
    }
    
    setSubmitting(true);
    
    try {
      setError('');
      
      if (editMode) {
        await axios.put(`https://erdalguda.online/api/categories/${newCategory.id}`, newCategory);
        setSuccess('Kategori başarıyla güncellendi');
      } else {
        await axios.post('https://erdalguda.online/api/categories', newCategory);
        setSuccess('Kategori başarıyla oluşturuldu');
      }
      
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Kategori kaydedilirken hata:', error);
      setError('Kategori kaydedilirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`https://erdalguda.online/api/categories/${id}`);
      fetchCategories();
      setSuccess('Kategori başarıyla silindi');
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      setError('Kategori silinirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = (_, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Kategori Yönetimi
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
        >
          Yeni Kategori Ekle
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Kategori Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }}>Açıklama</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: 'white' }} align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Henüz kategori bulunmuyor</TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDialog(category)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(category.id)}
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

      {/* Kategori Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Kategori Adı"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="URL Slug"
              name="slug"
              value={newCategory.slug}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="Otomatik oluşturulur, gerekirse düzenleyebilirsiniz"
            />
            <TextField
              label="Açıklama"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={!newCategory.name || !newCategory.slug || submitting}
          >
            {editMode ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bildirim */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCategories; 