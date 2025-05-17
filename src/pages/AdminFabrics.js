import React, { useState, useEffect } from 'react';
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
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
  borderRadius: 12,
  overflow: 'hidden',
}));

const AdminFabrics = () => {
  const [fabrics, setFabrics] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newFabric, setNewFabric] = useState({
    name: '',
    texture: '',
    description: '',
    imageUrl: ''
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' veya 'grid'

  // Kumaşları getir
  const fetchFabrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6767/api/fabrics');
      setFabrics(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Kumaşlar yüklenirken hata oluştu', err);
      setError('Kumaşlar yüklenemedi');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFabrics();
  }, []);

  // Form alanları değişince
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (openEditDialog) {
      setSelectedFabric({ ...selectedFabric, [name]: value });
    } else {
      setNewFabric({ ...newFabric, [name]: value });
    }
  };

  // Yeni kumaş ekle
  const handleAddFabric = async () => {
    try {
      await axios.post('http://localhost:6767/api/fabrics', newFabric);
      setOpenAddDialog(false);
      setNewFabric({
        name: '',
        texture: '',
        description: '',
        imageUrl: ''
      });
      setSuccess('Kumaş başarıyla eklendi');
      fetchFabrics();
    } catch (err) {
      console.error('Kumaş eklenirken hata oluştu', err);
      setError('Kumaş eklenemedi');
    }
  };

  // Kumaş düzenle
  const handleEditFabric = async () => {
    try {
      await axios.post(`http://localhost:6767/api/fabrics`, selectedFabric);
      setOpenEditDialog(false);
      setSelectedFabric(null);
      setSuccess('Kumaş başarıyla güncellendi');
      fetchFabrics();
    } catch (err) {
      console.error('Kumaş güncellenirken hata oluştu', err);
      setError('Kumaş güncellenemedi');
    }
  };

  // Kumaş sil
  const handleDeleteFabric = async (id) => {
    if (window.confirm('Bu kumaşı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:6767/api/fabrics/${id}`);
        setSuccess('Kumaş başarıyla silindi');
        fetchFabrics();
      } catch (err) {
        console.error('Kumaş silinirken hata oluştu', err);
        setError('Kumaş silinemedi');
      }
    }
  };

  // Düzenleme dialogunu aç
  const handleOpenEditDialog = (fabric) => {
    setSelectedFabric(fabric);
    setOpenEditDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '60px',
            height: '4px',
            bottom: '-10px',
            left: '0',
            backgroundColor: '#1976d2',
            borderRadius: '10px'
          }
        }}>
          Kumaş Yönetimi
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            sx={{ mx: 1 }}
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
          >
            {viewMode === 'table' ? 'Grid Görünüm' : 'Tablo Görünüm'}
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenAddDialog(true)}
          >
            Yeni Kumaş Ekle
          </Button>
        </Box>
      </Box>

      {/* Tablo görünümü */}
      {viewMode === 'table' && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Kumaş Adı</StyledTableCell>
                <StyledTableCell>Dokusu</StyledTableCell>
                <StyledTableCell>Açıklama</StyledTableCell>
                <StyledTableCell>Görsel URL</StyledTableCell>
                <StyledTableCell align="center">İşlemler</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fabrics.length > 0 ? (
                fabrics.map((fabric) => (
                  <TableRow key={fabric.id} hover>
                    <TableCell>{fabric.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{fabric.name}</TableCell>
                    <TableCell>{fabric.texture}</TableCell>
                    <TableCell>{fabric.description}</TableCell>
                    <TableCell>{fabric.imageUrl}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(fabric)} 
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteFabric(fabric.id)} 
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="subtitle1" sx={{ py: 2 }}>
                      Henüz kumaş bulunmuyor.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Grid görünümü */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {fabrics.length > 0 ? (
            fabrics.map((fabric) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fabric.id}>
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="160"
                    image={fabric.imageUrl || 'https://via.placeholder.com/300x160?text=Kumaş+Görseli'}
                    alt={fabric.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {fabric.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Doku:</strong> {fabric.texture}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {fabric.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<EditIcon />} 
                        onClick={() => handleOpenEditDialog(fabric)}
                      >
                        Düzenle
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={() => handleDeleteFabric(fabric.id)}
                      >
                        Sil
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1">
                  Henüz kumaş bulunmuyor.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Yeni Kumaş Ekleme Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Kumaş Ekle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Kumaş Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={newFabric.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="texture"
            label="Dokusu"
            type="text"
            fullWidth
            variant="outlined"
            value={newFabric.texture}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Açıklama"
            type="text"
            fullWidth
            variant="outlined"
            value={newFabric.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="imageUrl"
            label="Görsel URL"
            type="text"
            fullWidth
            variant="outlined"
            value={newFabric.imageUrl}
            onChange={handleInputChange}
            helperText="Örn: /images/kumaslar/mavi-keten.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            İptal
          </Button>
          <Button onClick={handleAddFabric} color="primary" variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kumaş Düzenleme Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Kumaş Düzenle</DialogTitle>
        <DialogContent>
          {selectedFabric && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Kumaş Adı"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedFabric.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="texture"
                label="Dokusu"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedFabric.texture}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="description"
                label="Açıklama"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedFabric.description}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="imageUrl"
                label="Görsel URL"
                type="text"
                fullWidth
                variant="outlined"
                value={selectedFabric.imageUrl}
                onChange={handleInputChange}
                helperText="Örn: /images/kumaslar/mavi-keten.jpg"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            İptal
          </Button>
          <Button onClick={handleEditFabric} color="primary" variant="contained">
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bildirimler */}
      <Snackbar 
        open={Boolean(error)} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={Boolean(success)} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminFabrics; 