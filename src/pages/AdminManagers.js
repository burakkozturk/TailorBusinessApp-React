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
  const [selectedUser, setSelectedUser] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useAuth();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/admin/users');
      
      if (response.data && response.data.success) {
        // Yeni API response formatını işle
        const { users = [], adminUsers = [] } = response.data;
        
        // User tablosundaki kullanıcıları ayır (onaylı ve bekleyen)
        const activeUsers = users.filter(u => u.isApproved);
        const pending = users.filter(u => !u.isApproved);
        
        // Admin kullanıcılarını da ekle (onaylanmış olarak)
        const adminUsersFormatted = adminUsers.map(admin => ({
          id: `admin_${admin.username}`,
          username: admin.username,
          role: admin.role,
          isApproved: true,
          fullName: admin.username,
          createdAt: new Date().toISOString()
        }));
        
        setUsers([...activeUsers, ...adminUsersFormatted]);
        setPendingUsers(pending);
        
        console.log(`${activeUsers.length + adminUsersFormatted.length} onaylı, ${pending.length} bekleyen kullanıcı yüklendi`);
      } else {
        throw new Error('API yanıtı geçersiz');
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setError('Kullanıcılar yüklenirken hata oluştu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Approve user
  const handleApproveUser = async (userId) => {
    try {
      console.log('Kullanıcı onaylama isteği gönderiliyor:', `/api/admin/users/${userId}/approve`);
      const response = await api.post(`/api/admin/users/${userId}/approve`);
      console.log('Onaylama yanıtı:', response.data);
      setSuccess('Kullanıcı başarıyla onaylandı');
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı onaylanırken hata:', error);
      console.error('Hata detayı:', error.response?.data);
      setError('Kullanıcı onaylanırken hata oluştu: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccess('Kullanıcı başarıyla silindi');
      fetchUsers();
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      setError('Kullanıcı silinirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on selected filter
  const getFilteredUsers = () => {
    switch(selectedFilter) {
      case 'admin': return users.filter(u => u.role === 'ADMIN');
      case 'kesimhane': return users.filter(u => u.role === 'KESIMHANE');
      case 'dikimhane': return users.filter(u => u.role === 'DIKIMHANE');
      case 'olcum': return users.filter(u => u.role === 'ÖLÇÜM');
      case 'pending': return pendingUsers;
      default: return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  // Stats data
  const stats = [
    {
      id: 'all',
      label: 'Toplam Kullanıcı',
      count: users.length,
      icon: <Groups sx={{ fontSize: 40 }} />,
      color: '#667eea',
    },
    {
      id: 'admin',
      label: 'Admin',
      count: users.filter(u => u.role === 'ADMIN').length,
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: '#e53e3e',
    },
    {
      id: 'kesimhane',
      label: 'Kesimhane',
      count: users.filter(u => u.role === 'KESIMHANE').length,
      icon: <ContentCut sx={{ fontSize: 40 }} />,
      color: '#dd6b20',
    },
    {
      id: 'dikimhane',
      label: 'Dikimhane',
      count: users.filter(u => u.role === 'DIKIMHANE').length,
      icon: <Build sx={{ fontSize: 40 }} />,
      color: '#3182ce',
    },
    {
      id: 'olcum',
      label: 'Ölçüm',
      count: users.filter(u => u.role === 'ÖLÇÜM').length,
      icon: <Straighten sx={{ fontSize: 40 }} />,
      color: '#38a169',
    },
    {
      id: 'pending',
      label: 'Onay Bekleyen',
      count: pendingUsers.length,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: '#805ad5',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <HeaderCard>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Kullanıcı Yönetimi
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Sistem kullanıcılarını yönetin, yeni hesaplar oluşturun ve onay bekleyen kullanıcıları değerlendirin
          </Typography>
        </Box>
      </HeaderCard>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={stat.id}>
            <Zoom in timeout={300 + stats.indexOf(stat) * 100}>
              <StatCard 
                selected={selectedFilter === stat.id}
                onClick={() => setSelectedFilter(stat.id)}
              >
                <Box sx={{ color: stat.color, mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: stat.color }}>
                  {stat.count}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </StatCard>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Users List */}
      <Paper sx={{ borderRadius: 3, p: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedFilter === 'all' ? 'Tüm Kullanıcılar' :
             selectedFilter === 'pending' ? 'Onay Bekleyen Kullanıcılar' :
             `${stats.find(s => s.id === selectedFilter)?.label} Kullanıcıları`}
          </Typography>
          
          {selectedFilter !== 'pending' && (
            <ActionButton
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => {
                setDialogType('add');
                setOpenDialog(true);
              }}
            >
              Yeni Kullanıcı
            </ActionButton>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {selectedFilter === 'pending' ? 'Onay bekleyen kullanıcı yok' : 'Kullanıcı bulunamadı'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedFilter === 'pending' ? 
                'Yeni kayıt olan kullanıcılar burada görünecek' : 
                'Bu kategoride henüz kullanıcı bulunmuyor'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredUsers.map((userData) => (
              <Grid item xs={12} sm={6} md={4} key={userData.id}>
                <Fade in timeout={300}>
                  <UserCard>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <UserAvatar role={userData.role}>
                        {getRoleIcon(userData.role)}
                      </UserAvatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {userData.username}
                        </Typography>
                        
                        <Chip
                          label={getRoleLabel(userData.role)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getRoleColor(userData.role), 0.1),
                            color: getRoleColor(userData.role),
                            fontWeight: 600,
                            mb: 1
                          }}
                        />
                        
                        {userData.fullName && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {userData.fullName}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      {selectedFilter === 'pending' ? (
                        <>
                          <ActionButton
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApproveUser(userData.id)}
                            sx={{ flex: 1 }}
                          >
                            Onayla
                          </ActionButton>
                          <ActionButton
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteUser(userData.id)}
                          >
                            Reddet
                          </ActionButton>
                        </>
                      ) : (
                        <ActionButton
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteUser(userData.id)}
                          sx={{ ml: 'auto' }}
                        >
                          Sil
                        </ActionButton>
                      )}
                    </Stack>
                  </UserCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default UserManagement;
