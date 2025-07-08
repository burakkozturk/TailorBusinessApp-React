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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Tooltip,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Avatar,
  Divider,
  Badge,
  Stack
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Delete,
  ReadMore,
  MarkEmailRead,
  Mail,
  CheckCircle,
  Schedule,
  Person,
  Email,
  Phone,
  CalendarToday,
  Refresh
} from '@mui/icons-material';
import apiService from '../services/apiService';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Styled Components
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
    cursor: 'pointer',
  },
  '& td': {
    padding: theme.spacing(2),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'read' 
    ? alpha(theme.palette.success.main, 0.1) 
    : alpha(theme.palette.warning.main, 0.1),
  color: status === 'read' 
    ? theme.palette.success.main 
    : theme.palette.warning.main,
  fontWeight: 'bold',
  borderRadius: '16px',
  '& .MuiChip-icon': {
    color: 'inherit'
  }
}));

const MessageAvatar = styled(Avatar)(({ theme, status }) => ({
  backgroundColor: status === 'read' 
    ? theme.palette.success.main 
    : theme.palette.warning.main,
  width: 40,
  height: 40,
}));

const InfoCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }
}));

const AdminMessages = () => {
  useDocumentTitle('Mesaj Yönetimi');
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiService.messages.getAll();
      setMessages(response.data);
      
      // Toplam sayıları hesapla
      const unreadCount = response.data.filter(msg => !msg.read).length;
      setTotalUnread(unreadCount);
      setTotalMessages(response.data.length);
      
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
      setAlert({
        open: true,
        message: 'Mesajlar yüklenirken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
    
    // Mesaj okunmamışsa, okundu olarak işaretle
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const markAsRead = async (messageId) => {
    try {
      await apiService.messages.markAsRead(messageId);
      
      // Başarıyla işaretlendikten sonra, mesajları tekrar getir
      fetchMessages();
      setAlert({
        open: true,
        message: 'Mesaj okundu olarak işaretlendi',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Mesaj okundu işaretlenirken hata:', error);
      setAlert({
        open: true,
        message: 'Mesaj okundu olarak işaretlenemedi',
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteDialog = (message, event) => {
    if (event) {
      event.stopPropagation();
    }
    setMessageToDelete(message);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setMessageToDelete(null);
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      setDeleteLoading(true);
      await apiService.messages.delete(messageToDelete.id);
      
      setOpenDeleteDialog(false);
      setMessageToDelete(null);
      
      // Silme işlemi başarılı olduktan sonra mesajları yeniden getir
      fetchMessages();
      setAlert({
        open: true,
        message: 'Mesaj başarıyla silindi',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Mesaj silinirken hata:', error);
      setAlert({
        open: true,
        message: 'Mesaj silinemedi',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseAlert = (_, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: tr });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  // Mesajları filtrele
  const filteredMessages = showOnlyUnread 
    ? messages.filter(message => !message.read) 
    : messages;

  if (loading && messages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          '& svg': { mr: 1 }
        }}>
          <Mail color="primary" />
          Mesaj Yönetimi
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={showOnlyUnread}
                onChange={(e) => setShowOnlyUnread(e.target.checked)}
                color="primary"
              />
            }
            label="Sadece Okunmayanlar"
          />
          <StyledButton 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={fetchMessages}
            disabled={loading}
          >
            Yenile
          </StyledButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <StatsCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {totalMessages}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Mesaj
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Mail />
            </Avatar>
          </CardContent>
        </StatsCard>

        <StatsCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {totalUnread}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Okunmamış Mesaj
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
              <Schedule />
            </Avatar>
          </CardContent>
        </StatsCard>

        <StatsCard>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {((totalMessages - totalUnread) / Math.max(totalMessages, 1) * 100).toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Okunma Oranı
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
              <CheckCircle />
            </Avatar>
          </CardContent>
        </StatsCard>
      </Box>

      {/* Messages Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Gönderen</StyledTableCell>
              <StyledTableCell>Konu</StyledTableCell>
              <StyledTableCell>Tarih</StyledTableCell>
              <StyledTableCell>Durum</StyledTableCell>
              <StyledTableCell align="right">İşlemler</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </StyledTableRow>
            ) : filteredMessages.length === 0 ? (
              <StyledTableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    {showOnlyUnread ? 'Okunmamış mesaj bulunmuyor' : 'Henüz mesaj bulunmuyor'}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ) : (
              filteredMessages.map((message) => (
                <StyledTableRow 
                  key={message.id}
                  onClick={() => handleOpenMessage(message)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MessageAvatar status={message.read ? 'read' : 'unread'}>
                        {message.name?.charAt(0) || <Person />}
                      </MessageAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {message.name || 'İsimsiz'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message.email || 'E-posta yok'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: message.read ? 'normal' : 'bold',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {message.subject || 'Konu belirtilmemiş'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(message.createdAt)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip 
                      status={message.read ? 'read' : 'unread'}
                      icon={message.read ? <CheckCircle fontSize="small" /> : <Schedule fontSize="small" />}
                      label={message.read ? 'Okundu' : 'Okunmamış'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {!message.read && (
                        <Tooltip title="Okundu İşaretle" arrow>
                          <IconButton 
                            color="success"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(message.id);
                            }}
                            sx={{ 
                              backgroundColor: alpha('#4caf50', 0.1),
                              '&:hover': {
                                backgroundColor: alpha('#4caf50', 0.2),
                              }
                            }}
                          >
                            <MarkEmailRead />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Mesajı Sil" arrow>
                        <IconButton 
                          color="error"
                          onClick={(e) => handleOpenDeleteDialog(message, e)}
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
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <ReadMore color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Mesaj Detayı</Typography>
            </Box>
            {selectedMessage && (
              <StatusChip 
                status={selectedMessage.read ? 'read' : 'unread'}
                icon={selectedMessage.read ? <CheckCircle fontSize="small" /> : <Schedule fontSize="small" />}
                label={selectedMessage.read ? 'Okundu' : 'Okunmamış'}
                size="small"
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedMessage && (
            <Box>
              {/* Sender Info */}
              <Card sx={{ mb: 3, backgroundColor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    Gönderen Bilgileri
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 80 }}>Ad:</Typography>
                      <Typography variant="body2">{selectedMessage.name || 'Belirtilmemiş'}</Typography>
                    </Box>
                    {selectedMessage.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedMessage.email}</Typography>
                      </Box>
                    )}
                    {selectedMessage.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedMessage.phone}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{formatDate(selectedMessage.createdAt)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Message Content */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Konu: {selectedMessage.subject || 'Konu belirtilmemiş'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ 
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f9f9f9',
                  padding: 2,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}>
                  {selectedMessage.message || 'Mesaj içeriği bulunmuyor'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            Kapat
          </Button>
          {selectedMessage && !selectedMessage.read && (
            <StyledButton 
              onClick={() => {
                markAsRead(selectedMessage.id);
                handleCloseDialog();
              }}
              variant="contained"
              color="success"
              sx={{ fontWeight: 'bold' }}
            >
              Okundu İşaretle
            </StyledButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
            <Delete color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Mesajı Sil</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText>
            Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
          {messageToDelete && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2"><strong>Gönderen:</strong> {messageToDelete.name}</Typography>
              <Typography variant="body2"><strong>Konu:</strong> {messageToDelete.subject}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleDeleteMessage}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            sx={{ fontWeight: 'bold' }}
          >
            {deleteLoading ? <CircularProgress size={20} /> : 'Sil'}
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
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
};

export default AdminMessages; 