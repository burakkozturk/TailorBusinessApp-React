import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
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
  Card,
  CardContent
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  CheckCircle, 
  Cancel, 
  Person, 
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

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  width: 40,
  height: 40,
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

function PendingUsers() {
  useDocumentTitle('Onay Bekleyen Kullanıcılar');
  
  const [pendingUsers, setPendingUsers] = useState([]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Onay bekleyen kullanıcıları getir
  const fetchPendingUsers = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Kullanıcı onaylama dialog
  const handleOpenApproveDialog = (userToApprove) => {
    setSelectedUser(userToApprove);
    setOpenApproveDialog(true);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedUser(null);
  };

  // Kullanıcı reddetme dialog
  const handleOpenRejectDialog = (userToReject) => {
    setSelectedUser(userToReject);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setSelectedUser(null);
  };

  // Kullanıcıyı onayla
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
    } catch (error) {
      console.error('Kullanıcı onaylama hatası:', error);
      setAlert({
        open: true,
        message: 'Kullanıcı onaylanamadı: ' + (error.response?.data || error.message),
        severity: 'error'
      });
    }
  };

  // Kullanıcıyı reddet
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          '& svg': { mr: 1 }
        }}>
          <PendingActions color="primary" />
          Onay Bekleyen Kullanıcılar
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Bilgi Kartı */}
      <InfoCard>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <PendingActions sx={{ mr: 1 }} color="warning" />
            Kullanıcı Onay Sistemi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Yeni kayıt olan kullanıcılar admin onayı bekler. Onayladığınız kullanıcılar sisteme giriş yapabilir ve 
            müşteriler ile siparişler bölümlerine erişebilirler.
          </Typography>
        </CardContent>
      </InfoCard>

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
                <StyledTableCell>İletişim</StyledTableCell>
                <StyledTableCell>Kayıt Tarihi</StyledTableCell>
                <StyledTableCell align="right">İşlemler</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingUsers.length === 0 ? (
                <StyledTableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      Onay bekleyen kullanıcı bulunmuyor
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              ) : (
                pendingUsers.map((pendingUser) => (
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
                          {pendingUser.fullName && (
                            <Typography variant="body2" color="text.secondary">
                              {pendingUser.fullName}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pendingUser.role === 'ADMIN' ? 'Admin' : 
                               pendingUser.role === 'USTA' ? 'Usta' : 
                               'Muhasebeci'}
                        color={pendingUser.role === 'ADMIN' ? 'error' : 
                               pendingUser.role === 'USTA' ? 'warning' : 
                               'primary'}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          minWidth: '80px'
                        }}
                      />
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
                        {!pendingUser.email && !pendingUser.phone && (
                          <Typography variant="body2" color="text.secondary">
                            İletişim bilgisi yok
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {formatDate(pendingUser.createdAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Onayla" arrow>
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
                        <Tooltip title="Reddet" arrow>
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
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Onaylama Dialog */}
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
            <Typography variant="h6">Kullanıcı Onayı</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            <strong>{selectedUser?.username}</strong> isimli kullanıcıyı <strong>{selectedUser?.role === 'ADMIN' ? 'Admin' : selectedUser?.role === 'USTA' ? 'Usta' : 'Muhasebeci'}</strong> rolü ile onaylamak istediğinizden emin misiniz? 
            Onayladıktan sonra kullanıcı sisteme giriş yapabilecek.
          </DialogContentText>
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

      {/* Reddetme Dialog */}
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
            <Typography variant="h6">Kullanıcı Reddi</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            <strong>{selectedUser?.username}</strong> isimli kullanıcının kaydını reddetmek istediğinizden emin misiniz? 
            Bu işlem geri alınamaz ve kullanıcının tüm bilgileri silinecek.
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
    </Box>
  );
}

export default PendingUsers; 