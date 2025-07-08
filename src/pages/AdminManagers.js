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
  Tab,
  Card,
  CardContent,
  Container,
  Badge,
  Grid
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  Delete, 
  Add, 
  Person, 
  CheckCircle, 
  Warning, 
  AdminPanelSettings, 
  Build, 
  AccountBalance,
  Cancel,
  PendingActions,
  Email,
  Phone,
  CalendarToday
} from '@mui/icons-material';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

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
    role === 'MUHASEBECI' ? theme.palette.success.main :
    theme.palette.warning.main, // pending users için
  width: 40,
  height: 40,
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
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
  useDocumentTitle('Kullanıcı Yönetimi');
  
  // Existing user management states
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

  // Pending users states
  const [pendingUsers, setPendingUsers] = useState([]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingLoading, setPendingLoading] = useState(false);

  const { user } = useAuth();

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

  // Onay bekleyen kullanıcıları getir
  const fetchPendingUsers = async () => {
    setPendingLoading(true);
    try {
      const response = await api.get('/auth/admin/pending-users');
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Onay bekleyen kullanıcılar getirilemedi:', error);
      setAlert({
        open: true,
        message: 'Onay bekleyen kullanıcılar getirilemedi: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPendingUsers();
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
        message: `${selectedRole} kullanıcısı başarıyla oluşturuldu`,
        severity: 'success'
      });
      
      handleCloseDialog();
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

  // Silme işlemleri
  const handleOpenDeleteDialog = (username) => {
    setSelectedUsername(username);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUsername('');
  };

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
    }
  };

  // Pending users operations
  const handleOpenApproveDialog = (userToApprove) => {
    setSelectedUser(userToApprove);
    setOpenApproveDialog(true);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedUser(null);
  };

  const handleOpenRejectDialog = (userToReject) => {
    setSelectedUser(userToReject);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setSelectedUser(null);
  };

  const handleApproveUser = async () => {
    if (!selectedUser) return;
    
    try {
      await api.post(`/auth/admin/approve-user/${selectedUser.id}`, {
        approvedBy: user.username
      });
      
      setAlert({
        open: true,
        message: `${selectedUser.username} başarıyla onaylandı`,
        severity: 'success'
      });
      
      handleCloseApproveDialog();
      fetchPendingUsers();
      fetchUsers(); // Refresh users list too
    } catch (error) {
      console.error('Kullanıcı onaylama hatası:', error);
      setAlert({
        open: true,
        message: 'Kullanıcı onaylanamadı: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser) return;
    
    try {
      await api.delete(`/auth/admin/reject-user/${selectedUser.id}`);
      
      setAlert({
        open: true,
        message: `${selectedUser.username} kaydı reddedildi`,
        severity: 'success'
      });
      
      handleCloseRejectDialog();
      fetchPendingUsers();
    } catch (error) {
      console.error('Kullanıcı reddetme hatası:', error);
      setAlert({
        open: true,
        message: 'Kullanıcı reddedilemedi: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  // Rol bazlı filtreleme
  const getFilteredUsers = () => {
    switch(tabValue) {
      case 0: return users; // Tümü
      case 1: return users.filter(user => user.role === 'ADMIN');
      case 2: return users.filter(user => user.role === 'USTA');
      case 3: return users.filter(user => user.role === 'MUHASEBECI');
      case 4: return pendingUsers; // Onay bekleyen kullanıcılar
      default: return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  // Tab değişikliği
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 4) {
      fetchPendingUsers(); // Pending users tab açıldığında refresh
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
                <AdminPanelSettings sx={{ mr: 2, fontSize: '2.5rem' }} />
                Kullanıcı Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Sistem kullanıcılarını yönetin, yeni hesaplar oluşturun ve onay bekleyen kullanıcıları değerlendirin
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <AdminPanelSettings sx={{ fontSize: '2.5rem' }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {users.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Kullanıcı
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Person />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {users.filter(u => u.role === 'ADMIN').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yöneticiler
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                <AdminPanelSettings />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {users.filter(u => u.role === 'USTA').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ustalar
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Build />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {pendingUsers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Onay Bekleyen
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                <PendingActions />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        {tabValue !== 4 && (
          <StyledButton 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={handleOpenDialog}
            sx={{ fontWeight: 'bold' }}
          >
            Yeni Kullanıcı Ekle
          </StyledButton>
        )}
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Tümü (${users.length})`} />
          <Tab label={`Yöneticiler (${users.filter(u => u.role === 'ADMIN').length})`} />
          <Tab label={`Ustalar (${users.filter(u => u.role === 'USTA').length})`} />
          <Tab label={`Muhasebeciler (${users.filter(u => u.role === 'MUHASEBECI').length})`} />
          <Tab label={`Onay Bekleyen (${pendingUsers.length})`} />
        </Tabs>
      </Box>

      {/* Tab Descriptions */}
      {tabValue < 4 && (
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Burada kullanıcı hesapları ekleyebilir ve silebilirsiniz. 
          <strong> Yöneticiler</strong> tüm modüllere, 
          <strong> Ustalar</strong> müşteriler, siparişler, kumaşlar ve şablonlara, 
          <strong> Muhasebeciler</strong> sadece müşteriler ve siparişlere erişebilir.
        </Typography>
      )}

      {tabValue === 4 && (
        <InfoCard>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PendingActions sx={{ mr: 1, color: 'warning.main' }} />
              Onay Bekleyen Kullanıcılar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sisteme kaydolan ancak henüz admin onayı almamış kullanıcılar burada listelenmektedir. 
              Kullanıcıları onaylayarak sisteme erişim izni verebilir veya reddedebilirsiniz.
            </Typography>
          </CardContent>
        </InfoCard>
      )}

      {/* Loading Indicator */}
      {((tabValue < 4 && loading) || (tabValue === 4 && pendingLoading)) ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <Table>
            <TableHead>
              <TableRow>
                {tabValue === 4 ? (
                  // Onay bekleyen kullanıcılar için başlıklar
                  <>
                    <StyledTableCell>Kullanıcı Bilgileri</StyledTableCell>
                    <StyledTableCell>İletişim</StyledTableCell>
                    <StyledTableCell>Rol & Tarih</StyledTableCell>
                    <StyledTableCell align="right">İşlemler</StyledTableCell>
                  </>
                ) : (
                  // Normal kullanıcılar için başlıklar
                  <>
                    <StyledTableCell>Kullanıcı</StyledTableCell>
                    <StyledTableCell>Rol</StyledTableCell>
                    <StyledTableCell align="right">İşlemler</StyledTableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <StyledTableRow>
                  <TableCell colSpan={tabValue === 4 ? 4 : 3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {tabValue === 4 
                        ? 'Onay bekleyen kullanıcı bulunmuyor' 
                        : tabValue === 0 
                        ? 'Henüz bir kullanıcı bulunmuyor' 
                        : 'Bu rolde kullanıcı bulunmuyor'
                      }
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              ) : tabValue === 4 ? (
                // Onay bekleyen kullanıcılar tablosu
                filteredUsers.map((pendingUser) => (
                  <StyledTableRow key={pendingUser.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <UserAvatar>
                          {pendingUser.username.charAt(0).toUpperCase()}
                        </UserAvatar>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {pendingUser.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pendingUser.fullName || 'Ad bilgisi yok'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {pendingUser.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{pendingUser.email}</Typography>
                          </Box>
                        )}
                        {pendingUser.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{pendingUser.phone}</Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <RoleChip 
                          icon={getRoleIcon(pendingUser.role)}
                          label={getRoleLabel(pendingUser.role)} 
                          role={pendingUser.role}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ fontSize: 14, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(pendingUser.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Kullanıcıyı Onayla" arrow>
                          <IconButton 
                            color="success"
                            onClick={() => handleOpenApproveDialog(pendingUser)}
                            sx={{ 
                              backgroundColor: alpha('#4caf50', 0.1),
                              '&:hover': {
                                backgroundColor: alpha('#4caf50', 0.2),
                              }
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Başvuruyu Reddet" arrow>
                          <IconButton 
                            color="error"
                            onClick={() => handleOpenRejectDialog(pendingUser)}
                            sx={{ 
                              backgroundColor: alpha('#f44336', 0.1),
                              '&:hover': {
                                backgroundColor: alpha('#f44336', 0.2),
                              }
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                // Normal kullanıcılar tablosu
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

      {/* Kullanıcı Onaylama Dialogu */}
      <Dialog
        open={openApproveDialog}
        onClose={handleCloseApproveDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="h6">Kullanıcı Onaylama</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            <strong>{selectedUser?.username}</strong> isimli kullanıcıyı onaylamak istediğinizden emin misiniz?
            Bu kullanıcı onaylandıktan sonra sisteme giriş yapabilecektir.
          </DialogContentText>
          {selectedUser && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2"><strong>Ad Soyad:</strong> {selectedUser.fullName || 'Belirtilmemiş'}</Typography>
              <Typography variant="body2"><strong>E-posta:</strong> {selectedUser.email || 'Belirtilmemiş'}</Typography>
              <Typography variant="body2"><strong>Telefon:</strong> {selectedUser.phone || 'Belirtilmemiş'}</Typography>
              <Typography variant="body2"><strong>Rol:</strong> {getRoleLabel(selectedUser.role)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseApproveDialog} 
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleApproveUser} 
            variant="contained" 
            color="success"
            sx={{ fontWeight: 'bold' }}
          >
            Onayla
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Kullanıcı Reddetme Dialogu */}
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" alignItems="center">
            <Cancel color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Başvuru Reddetme</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            <strong>{selectedUser?.username}</strong> isimli kullanıcının başvurusunu reddetmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz ve kullanıcının kaydı silinecektir.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseRejectDialog} 
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleRejectUser} 
            variant="contained" 
            color="error"
            sx={{ fontWeight: 'bold' }}
          >
            Reddet
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
    </Container>
  );
}

export default UserManagement; 