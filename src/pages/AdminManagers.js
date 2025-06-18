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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Delete, Add, Person, CheckCircle, Warning, AdminPanelSettings, Build, AccountBalance } from '@mui/icons-material';
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
  backgroundColor: 
    role === 'ADMIN' ? alpha(theme.palette.error.main, 0.1) :
    role === 'USTA' ? alpha(theme.palette.warning.main, 0.1) :
    alpha(theme.palette.success.main, 0.1),
  color: 
    role === 'ADMIN' ? theme.palette.error.main :
    role === 'USTA' ? theme.palette.warning.main :
    theme.palette.success.main,
  fontWeight: 'bold',
  borderRadius: '16px',
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

const UserAvatar = styled(Avatar)(({ theme, role }) => ({
  backgroundColor: 
    role === 'ADMIN' ? theme.palette.error.main :
    role === 'USTA' ? theme.palette.warning.main :
    theme.palette.success.main,
  width: 40,
  height: 40,
}));

const getRoleIcon = (role) => {
  switch(role) {
    case 'ADMIN': return <AdminPanelSettings fontSize="small" />;
    case 'USTA': return <Build fontSize="small" />;
    case 'MUHASEBECI': return <AccountBalance fontSize="small" />;
    default: return <Person fontSize="small" />;
  }
};

const getRoleLabel = (role) => {
  switch(role) {
    case 'ADMIN': return 'Yönetici';
    case 'USTA': return 'Usta';
    case 'MUHASEBECI': return 'Muhasebeci';
    default: return role;
  }
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('USTA');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Kullanıcıları getir
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Kullanıcılar getirilemedi:', error);
      setAlert({
        open: true,
        message: 'Kullanıcılar getirilemedi: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Dialog işlemleri
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setUsername('');
    setPassword('');
    setSelectedRole('USTA');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Yeni kullanıcı oluşturma
  const handleCreateUser = async () => {
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
      const endpoint = selectedRole === 'USTA' ? '/auth/admin/create-usta' : '/auth/admin/create-muhasebeci';
      await api.post(endpoint, { username, password });
      
      setAlert({
        open: true,
        message: `${getRoleLabel(selectedRole)} başarıyla oluşturuldu`,
        severity: 'success'
      });
      
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      setAlert({
        open: true,
        message: 'Kullanıcı oluşturulamadı: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    }
  };

  // Kullanıcı silme dialog
  const handleOpenDeleteDialog = (username) => {
    setSelectedUsername(username);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUsername('');
  };

  // Kullanıcı silme işlemi
  const handleDeleteUser = async () => {
    try {
      await api.delete(`/auth/admin/users/${selectedUsername}`);
      
      setAlert({
        open: true,
        message: 'Kullanıcı başarıyla silindi',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı silme hatası:', error);
      setAlert({
        open: true,
        message: 'Kullanıcı silinemedi: ' + (error.response?.data || error.message),
        severity: 'error'
      });
      handleCloseDeleteDialog();
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Rol bazlı filtreleme
  const getFilteredUsers = () => {
    switch(tabValue) {
      case 0: return users; // Tümü
      case 1: return users.filter(user => user.role === 'ADMIN');
      case 2: return users.filter(user => user.role === 'USTA');
      case 3: return users.filter(user => user.role === 'MUHASEBECI');
      default: return users;
    }
  };

  const filteredUsers = getFilteredUsers();

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
          Kullanıcı Yönetimi
        </Typography>
        
        <StyledButton 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={handleOpenDialog}
          sx={{ fontWeight: 'bold' }}
        >
          Yeni Kullanıcı Ekle
        </StyledButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Rol Tabları */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`Tümü (${users.length})`} />
          <Tab label={`Yöneticiler (${users.filter(u => u.role === 'ADMIN').length})`} />
          <Tab label={`Ustalar (${users.filter(u => u.role === 'USTA').length})`} />
          <Tab label={`Muhasebeciler (${users.filter(u => u.role === 'MUHASEBECI').length})`} />
        </Tabs>
      </Box>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Burada kullanıcı hesapları ekleyebilir ve silebilirsiniz. 
        <strong> Yöneticiler</strong> tüm modüllere, 
        <strong> Ustalar</strong> müşteriler, siparişler, kumaşlar ve şablonlara, 
        <strong> Muhasebeciler</strong> sadece müşteriler ve siparişlere erişebilir.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Kullanıcı</StyledTableCell>
                <StyledTableCell>Rol</StyledTableCell>
                <StyledTableCell align="right">İşlemler</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <StyledTableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {tabValue === 0 ? 'Henüz bir kullanıcı bulunmuyor' : 'Bu rolde kullanıcı bulunmuyor'}
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              ) : (
                filteredUsers.map((user) => (
                  <StyledTableRow key={user.username}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UserAvatar role={user.role}>
                          {user.username.charAt(0).toUpperCase()}
                        </UserAvatar>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <RoleChip 
                        icon={getRoleIcon(user.role)}
                        label={getRoleLabel(user.role)} 
                        role={user.role}
                        size="medium"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {user.role !== 'ADMIN' && (
                        <Tooltip title="Kullanıcıyı Sil" arrow>
                          <IconButton 
                            color="error"
                            onClick={() => handleOpenDeleteDialog(user.username)}
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
      )}

      {/* Yeni Kullanıcı Dialog */}
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
            <Typography variant="h6">Yeni Kullanıcı Ekle</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1, px: 3, minWidth: '400px' }}>
          <DialogContentText sx={{ mb: 3 }}>
            Eklemek istediğiniz kullanıcı için bilgileri girin. Şifre en az 6 karakter olmalıdır.
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={selectedRole}
              label="Rol"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value="USTA">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Build sx={{ mr: 1 }} />
                  Usta
                </Box>
              </MenuItem>
              <MenuItem value="MUHASEBECI">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  Muhasebeci
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
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
            onClick={handleCreateUser} 
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
            <Typography variant="h6">Kullanıcı Silme Onayı</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            <strong>{selectedUsername}</strong> isimli kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
            onClick={handleDeleteUser} 
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

export default UserManagement; 