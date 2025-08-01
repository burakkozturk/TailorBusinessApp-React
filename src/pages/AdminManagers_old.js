import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Paper, 
  IconButton, 
  Snackbar, 
  Alert, 
  Avatar,
  Chip,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
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
  ContentCut,
  Straighten,
  PendingActions,
  PersonAdd,
  Groups
} from '@mui/icons-material';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Modern Styled Components
const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transform: 'translate(50%, -50%)',
  }
}));

const StatCard = styled(Card)(({ theme, selected }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: selected ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
  background: selected ? 
    'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 
    'white',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.primary.main,
  },
}));

const UserCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

const UserAvatar = styled(Avatar)(({ theme, role }) => ({
  backgroundColor: 
    role === 'ADMIN' ? '#e53e3e' :
    role === 'KESIMHANE' ? '#dd6b20' :
    role === 'DIKIMHANE' ? '#3182ce' :
    role === 'ÖLÇÜM' ? '#38a169' :
    '#805ad5',
  width: 56,
  height: 56,
  fontSize: '1.5rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const ActionButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  minWidth: 'auto',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: buttonVariant === 'contained' ? '0 6px 20px rgba(0, 0, 0, 0.15)' : 'none',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease',
}));

const getRoleIcon = (role) => {
  switch(role) {
    case 'ADMIN': return <AdminPanelSettings />;
    case 'KESIMHANE': return <ContentCut />;
    case 'DIKIMHANE': return <Build />;
    case 'ÖLÇÜM': return <Straighten />;
    default: return <Person />;
  }
};

const getRoleLabel = (role) => {
  switch(role) {
    case 'ADMIN': return 'Admin';
    case 'KESIMHANE': return 'Kesimhane';
    case 'DIKIMHANE': return 'Dikimhane';
    case 'ÖLÇÜM': return 'Ölçüm';
    default: return role;
  }
};

const getRoleColor = (role) => {
  switch(role) {
    case 'ADMIN': return '#e53e3e';
    case 'KESIMHANE': return '#dd6b20';
    case 'DIKIMHANE': return '#3182ce';
    case 'ÖLÇÜM': return '#38a169';
    default: return '#805ad5';
  }
};

function UserManagement() {
  useDocumentTitle('Kullanıcı Yönetimi');
  
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
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
      case 2: return users.filter(user => user.role === 'KESIMHANE');
      case 3: return users.filter(user => user.role === 'DIKIMHANE');
      case 4: return users.filter(user => user.role === 'ÖLÇÜM');
      case 5: return pendingUsers; // Onay bekleyen kullanıcılar
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
        <CardContent sx={{ py: { xs: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            textAlign: { xs: 'center', md: 'left' },
            gap: { xs: 2, md: 0 }
          }}>
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ 
                fontWeight: 700, 
                mb: 1, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <AdminPanelSettings sx={{ mr: 2, fontSize: { xs: '2rem', md: '2.5rem' } }} />
                Kullanıcı Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ 
                opacity: 0.9, 
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: { xs: '100%', md: '500px' }
              }}>
                Sistem kullanıcılarını yönetin, yeni hesaplar oluşturun ve onay bekleyen kullanıcıları değerlendirin
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: { xs: 60, md: 80 }, 
              height: { xs: 60, md: 80 }, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <AdminPanelSettings sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {users.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Kullanıcı
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
                <Person />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {users.filter(u => u.role === 'ADMIN').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yöneticiler
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'error.main', width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
                <AdminPanelSettings />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {users.filter(u => u.role === 'USTA').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ustalar
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
                <Build />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {pendingUsers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Onay Bekleyen
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.main', width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
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
          <Tab label={`Adminler (${users.filter(u => u.role === 'ADMIN').length})`} />
          <Tab label={`Kesimhane (${users.filter(u => u.role === 'KESIMHANE').length})`} />
          <Tab label={`Dikimhane (${users.filter(u => u.role === 'DIKIMHANE').length})`} />
          <Tab label={`Ölçüm (${users.filter(u => u.role === 'ÖLÇÜM').length})`} />
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
        <>
          {/* Desktop Table View */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {filteredUsers.length === 0 ? (
              <Card sx={{ borderRadius: 2, textAlign: 'center', py: 8 }}>
                <CardContent>
                  <AdminPanelSettings sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    {tabValue === 4 
                      ? 'Onay bekleyen kullanıcı bulunmuyor' 
                      : tabValue === 0 
                      ? 'Henüz bir kullanıcı bulunmuyor' 
                      : 'Bu rolde kullanıcı bulunmuyor'
                    }
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={2}>
                {filteredUsers.map((user) => (
                  <Card key={user.id || user.username} sx={{ 
                    borderRadius: 2, 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          <UserAvatar role={user.role}>
                            {user.username.charAt(0).toUpperCase()}
                          </UserAvatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {user.username}
                            </Typography>
                            {user.fullName && (
                              <Typography variant="body2" color="text.secondary">
                                {user.fullName}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {tabValue === 4 ? (
                            // Onay bekleyen kullanıcılar için butonlar
                            <>
                              <Tooltip title="Kullanıcıyı Onayla" arrow>
                                <IconButton 
                                  color="success"
                                  size="small"
                                  onClick={() => handleOpenApproveDialog(user)}
                                  sx={{ 
                                    backgroundColor: 'success.main',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'success.dark' }
                                  }}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Başvuruyu Reddet" arrow>
                                <IconButton 
                                  color="error"
                                  size="small"
                                  onClick={() => handleOpenRejectDialog(user)}
                                  sx={{ 
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'error.dark' }
                                  }}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            // Normal kullanıcılar için sil butonu
                            user.role !== 'ADMIN' && (
                              <Tooltip title="Kullanıcıyı Sil" arrow>
                                <IconButton 
                                  color="error"
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(user.username)}
                                  sx={{ 
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'error.dark' }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <RoleChip 
                          icon={getRoleIcon(user.role)}
                          label={getRoleLabel(user.role)} 
                          role={user.role}
                          size="small"
                        />
                      </Box>
                      
                      {tabValue === 4 && (
                        <Box sx={{ mt: 2 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            {user.email && (
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Grid>
                            )}
                            {user.phone && (
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {user.phone}
                                  </Typography>
                                </Box>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(user.createdAt)}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </>
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
              <MenuItem value="ADMIN">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdminPanelSettings fontSize="small" />
                  Admin
                </Box>
              </MenuItem>
              <MenuItem value="KESIMHANE">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContentCut fontSize="small" />
                  Kesimhane
                </Box>
              </MenuItem>
              <MenuItem value="DIKIMHANE">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Build fontSize="small" />
                  Dikimhane
                </Box>
              </MenuItem>
              <MenuItem value="ÖLÇÜM">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Straighten fontSize="small" />
                  Ölçüm
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