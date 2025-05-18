import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import api from '../api/axiosConfig';

function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);

  // Yöneticileri getir
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/admin/managers');
      setManagers(response.data);
    } catch (error) {
      console.error('Yöneticiler getirilemedi:', error);
      setAlert({
        open: true,
        message: 'Yöneticiler getirilemedi: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // Dialog işlemleri
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setUsername('');
    setPassword('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Yeni yönetici oluşturma
  const handleCreateManager = async () => {
    try {
      await api.post('/auth/admin/create-manager', { username, password });
      
      setAlert({
        open: true,
        message: 'Yönetici başarıyla oluşturuldu',
        severity: 'success'
      });
      
      setOpenDialog(false);
      fetchManagers();
    } catch (error) {
      console.error('Yönetici oluşturma hatası:', error);
      setAlert({
        open: true,
        message: 'Yönetici oluşturulamadı: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    }
  };

  // Yönetici silme
  const handleDeleteManager = async (username) => {
    if (window.confirm(`${username} isimli yöneticiyi silmek istediğinize emin misiniz?`)) {
      try {
        await api.delete(`/auth/admin/managers/${username}`);
        
        setAlert({
          open: true,
          message: 'Yönetici başarıyla silindi',
          severity: 'success'
        });
        
        fetchManagers();
      } catch (error) {
        console.error('Yönetici silme hatası:', error);
        setAlert({
          open: true,
          message: 'Yönetici silinemedi: ' + (error.response?.data || error.message),
          severity: 'error'
        });
      }
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={handleOpenDialog}
        >
          Yeni Yönetici Ekle
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Burada yönetici hesapları ekleyebilir ve silebilirsiniz. Yöneticiler sadece müşteriler ve siparişler bölümlerine erişebilirler.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kullanıcı Adı</TableCell>
              <TableCell>Yetki</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : managers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Henüz bir yönetici bulunmuyor</TableCell>
              </TableRow>
            ) : (
              managers.map((manager) => (
                <TableRow key={manager.username}>
                  <TableCell>{manager.username}</TableCell>
                  <TableCell>{manager.role === 'MANAGER' ? 'Yönetici' : 'Admin'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteManager(manager.username)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Yeni Yönetici Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Yeni Yönetici Ekle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Kullanıcı Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Şifre"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button 
            onClick={handleCreateManager} 
            variant="contained"
            disabled={!username || !password}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Uyarı Bildirimi */}
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminManagers; 