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
  Stack,
  Container,
  Grid,
  TextField,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
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
  Refresh,
  Message as MessageIcon,
  Reply
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
  transition: 'transform 0.2s, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#f8fafc !important',
    transform: 'translateX(5px)',
  },
  '& td': {
    padding: theme.spacing(2),
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
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

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden'
}));

const AdminMessages = () => {
  useDocumentTitle('Mesaj Yönetimi');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
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

  // Reply state variables
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [messageToReply, setMessageToReply] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

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

  // Reply handlers
  const handleOpenReplyDialog = (message, event) => {
    if (event) {
      event.stopPropagation();
    }
    setMessageToReply(message);
    setReplySubject(`Re: ${message.name} - Mesajınıza Yanıt`);
    setReplyContent('');
    setOpenReplyDialog(true);
  };

  const handleCloseReplyDialog = () => {
    setOpenReplyDialog(false);
    setMessageToReply(null);
    setReplySubject('');
    setReplyContent('');
  };

  const handleSendReply = async () => {
    if (!messageToReply || !replySubject.trim() || !replyContent.trim()) {
      setAlert({
        open: true,
        message: 'Konu ve içerik alanları boş olamaz',
        severity: 'error'
      });
      return;
    }

    try {
      setReplyLoading(true);
      await apiService.messages.reply(messageToReply.id, {
        subject: replySubject,
        content: replyContent
      });

      setAlert({
        open: true,
        message: 'Yanıt başarıyla gönderildi',
        severity: 'success'
      });

      handleCloseReplyDialog();
      fetchMessages(); // Refresh messages to show updated read status
      
    } catch (error) {
      console.error('Reply gönderilirken hata:', error);
      setAlert({
        open: true,
        message: 'Yanıt gönderilirken hata oluştu',
        severity: 'error'
      });
    } finally {
      setReplyLoading(false);
    }
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
                <MessageIcon sx={{ mr: 2, fontSize: '2.5rem' }} />
                Mesaj Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Gelen mesajları görüntüleyin ve yönetin
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <MessageIcon sx={{ fontSize: '2.5rem' }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {totalMessages}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Mesaj
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <MessageIcon sx={{ fontSize: '1.5rem' }} />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {totalUnread}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Okunmamış Mesaj
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <Mail sx={{ fontSize: '1.5rem' }} />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {totalMessages - totalUnread}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Okunmuş Mesaj
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <CheckCircle sx={{ fontSize: '1.5rem' }} />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                    {totalUnread > 0 ? Math.round((totalUnread / totalMessages) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Okunmamış Oran
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Schedule sx={{ fontSize: '1.5rem' }} />
                </Avatar>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Filtreler ve Yenile Butonu */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyUnread}
                onChange={(e) => setShowOnlyUnread(e.target.checked)}
                color="primary"
              />
            }
            label="Sadece Okunmamış Mesajlar"
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

      {/* Mesaj Tablosu */}
      <StyledCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Gönderen</StyledTableCell>
                <StyledTableCell>E-posta</StyledTableCell>
                <StyledTableCell>Mesaj</StyledTableCell>
                <StyledTableCell>Tarih</StyledTableCell>
                <StyledTableCell>Durum</StyledTableCell>
                <StyledTableCell align="center">İşlemler</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                (showOnlyUnread ? messages.filter(msg => !msg.read) : messages).map((message) => (
                  <StyledTableRow key={message.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MessageAvatar status={message.read ? 'read' : 'unread'}>
                          <Person />
                        </MessageAvatar>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {message.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {message.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {message.content}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(message.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={message.read ? 'read' : 'unread'}
                        label={message.read ? 'Okundu' : 'Okunmadı'}
                        icon={message.read ? <CheckCircle /> : <Schedule />}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Mesajı Oku">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenMessage(message)}
                          sx={{ mr: 1 }}
                        >
                          <ReadMore />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cevapla">
                        <IconButton
                          color="info"
                          size="small"
                          onClick={(e) => handleOpenReplyDialog(message, e)}
                          sx={{ mr: 1 }}
                        >
                          <Reply />
                        </IconButton>
                      </Tooltip>
                      {!message.read && (
                        <Tooltip title="Okundu Olarak İşaretle">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => markAsRead(message.id)}
                            sx={{ mr: 1 }}
                          >
                            <MarkEmailRead />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Mesajı Sil">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => handleOpenDeleteDialog(message, e)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledCard>

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
                  Mesaj İçeriği:
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
                  {selectedMessage.content || 'Mesaj içeriği bulunmuyor'}
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

      {/* Reply Dialog */}
      <Dialog
        open={openReplyDialog}
        onClose={handleCloseReplyDialog}
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
          <Box display="flex" alignItems="center">
            <Reply color="info" sx={{ mr: 1 }} />
            <Typography variant="h6">Mesajı Yanıtla</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {messageToReply && (
            <Box sx={{ mb: 3 }}>
              {/* Original Message Info */}
              <Card sx={{ mb: 3, backgroundColor: '#f8fafc' }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Yanıtlanan Mesaj:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{messageToReply.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{messageToReply.email}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    mt: 2, 
                    p: 2, 
                    backgroundColor: 'white', 
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    maxHeight: '100px',
                    overflow: 'auto'
                  }}>
                    {messageToReply.content}
                  </Typography>
                </CardContent>
              </Card>

              {/* Reply Form */}
              <TextField
                fullWidth
                label="Konu"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                sx={{ mb: 2 }}
                variant="outlined"
              />
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Yanıt İçeriği"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Yanıtınızı buraya yazın..."
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleCloseReplyDialog}
            sx={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            İptal
          </Button>
          <StyledButton 
            onClick={handleSendReply}
            variant="contained"
            color="info"
            disabled={replyLoading || !replySubject.trim() || !replyContent.trim()}
            sx={{ fontWeight: 'bold' }}
          >
            {replyLoading ? <CircularProgress size={20} /> : 'Yanıtı Gönder'}
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
    </Container>
  );
};

export default AdminMessages; 