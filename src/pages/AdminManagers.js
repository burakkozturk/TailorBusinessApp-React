import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Snackbar, 
  Alert, 
  Avatar,
  Chip,
  Tooltip,
  CircularProgress,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Delete, Add, Person, CheckCircle, Warning, AdminPanelSettings } from '@mui/icons-material';
import api from '../api/axiosConfig';

// Stillendirilmiş bileşenler
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

const StyledButton = styled(Button)(({ theme, color = 'primary' }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    '&:hover': {
      backgroundColor: '#f1f5f9',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
  }
}));

const RoleChip = styled(Chip)(({ theme, role }) => ({
  backgroundColor: role === 'ADMIN' ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1),
  color: role === 'ADMIN' ? theme.palette.error.main : theme.palette.success.main,
  fontWeight: 'bold',
  borderRadius: '16px',
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

const UserAvatar = styled(Avatar)(({ theme, username }) => ({
  backgroundColor: username === 'admin' ? theme.palette.error.main : theme.palette.primary.main,
  width: 40,
  height: 40,
}));

function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
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
    if (!username || !password) {
      setAlert({
        open: true,
        message: 'Kullanıcı adı ve şifre gereklidir',
        severity: 'warning'
      });
      return;
    }
    
    if (password.length < 6) {
      setAlert({
        open: true,
        message: 'Şifre en az 6 karakter olmalıdır',
        severity: 'warning'
      });
      return;
    }
    
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

  // Yönetici silme dialog
  const handleOpenDeleteDialog = (username) => {
    setSelectedUsername(username);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUsername('');
  };

  // Yönetici silme işlemi
  const handleDeleteManager = async () => {
    try {
      await api.delete(`/auth/admin/managers/${selectedUsername}`);
      
      setAlert({
        open: true,
        message: 'Yönetici başarıyla silindi',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
      fetchManagers();
    } catch (error) {
      console.error('Yönetici silme hatası:', error);
      setAlert({
        open: true,
        message: 'Yönetici silinemedi: ' + (error.response?.data || error.message),
        severity: 'error'
      });
      handleCloseDeleteDialog();
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          '& svg': { mr: 1 }
        }}>
          <AdminPanelSettings color="primary" />
          Yönetici Listesi
        </Typography>
        
        <StyledButton 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={handleOpenDialog}
          sx={{ fontWeight: 'bold' }}
        >
          Yeni Yönetici Ekle
        </StyledButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: 'flex', mb: 2 }}>
        <Chip 
          icon={<Person />} 
          label={`Toplam: ${managers.length} Yönetici`} 
          color="primary" 
          variant="outlined" 
          sx={{ mr: 2, fontWeight: 'bold' }} 
        />
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Burada yönetici hesapları ekleyebilir ve silebilirsiniz. Yöneticiler sadece müşteriler ve siparişler bölümlerine erişebilirler.
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', borderRadius: '12px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Kullanıcı</StyledTableCell>
              <StyledTableCell>Yetki</StyledTableCell>
              <StyledTableCell align="right">İşlemler</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ mr: 2 }} />
                  <Typography variant="body2" color="textSecondary">
                    Yöneticiler yükleniyor...
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ) : managers.length === 0 ? (
              <StyledTableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Henüz bir yönetici bulunmuyor
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ) : (
              managers.map((manager) => (
                <StyledTableRow key={manager.username}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UserAvatar username={manager.username}>
                        {manager.username.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {manager.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <RoleChip 
                      icon={manager.role === 'ADMIN' ? <Warning fontSize="small" /> : <CheckCircle fontSize="small" />}
                      label={manager.role === 'MANAGER' ? 'Yönetici' : 'Admin'} 
                      role={manager.role}
                      size="medium"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {manager.role !== 'ADMIN' && (
                      <Tooltip title="Yöneticiyi Sil" arrow>
                        <IconButton 
                          color="error"
                          onClick={() => handleOpenDeleteDialog(manager.username)}
                          sx={{ 
                            backgroundColor: alpha('#f44336', 0.1),
                            '&:hover': {
                              backgroundColor: alpha('#f44336', 0.2),
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Yeni Yönetici Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            padding: 1
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Add color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Yeni Yönetici Ekle</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1, px: 3, minWidth: '400px' }}>
          <DialogContentText sx={{ mb: 3 }}>
            Eklemek istediğiniz yönetici için kullanıcı adı ve şifre belirleyin. Şifre en az 6 karakter olmalıdır.
          </DialogContentText>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Kullanıcı Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
          />
          <StyledTextField
            margin="dense"
            label="Şifre"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="En az 6 karakter olmalıdır"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleCreateManager} 
            variant="contained"
            disabled={!username || !password || password.length < 6}
            sx={{ fontWeight: 'bold' }}
          >
            Ekle
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Silme Onay Dialogu */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Warning color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Yönetici Silme Onayı</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            <strong>{selectedUsername}</strong> isimli yöneticiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleDeleteManager} 
            variant="contained" 
            color="error"
            sx={{ fontWeight: 'bold' }}
          >
            Sil
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Uyarı Bildirimi */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px'
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminManagers; 