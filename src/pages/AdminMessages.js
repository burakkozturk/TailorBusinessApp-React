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
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:6767/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata oluştu:', error);
      setAlert({
        open: true,
        message: 'Mesajlar yüklenirken bir hata oluştu!',
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
      await axios.put(`http://localhost:6767/api/messages/${messageId}/read`);
      
      // Mesajlar listesini güncelle
      setMessages(messages.map(msg => 
        msg.id === messageId ? {...msg, read: true} : msg
      ));
      
      // Seçili mesaj açık durumdaysa onu da güncelle
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({...selectedMessage, read: true});
      }
    } catch (error) {
      console.error('Mesaj okundu olarak işaretlenirken hata oluştu:', error);
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
    try {
      await axios.delete(`http://localhost:6767/api/messages/${messageToDelete.id}`);
      
      // Listeleri güncelle
      setMessages(messages.filter(msg => msg.id !== messageToDelete.id));
      
      // Eğer silinen mesaj açık dialog'daysa onu da kapat
      if (selectedMessage && selectedMessage.id === messageToDelete.id) {
        setOpenDialog(false);
      }
      
      setAlert({
        open: true,
        message: 'Mesaj başarıyla silindi!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Mesaj silinirken hata oluştu:', error);
      setAlert({
        open: true,
        message: 'Mesaj silinirken bir hata oluştu!',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailIcon /> Mesaj Yönetimi
          </Box>
        </Typography>
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
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell width="5%">ID</StyledTableCell>
              <StyledTableCell width="15%">Gönderen</StyledTableCell>
              <StyledTableCell width="20%">E-posta</StyledTableCell>
              <StyledTableCell width="30%">Mesaj</StyledTableCell>
              <StyledTableCell width="15%">Tarih</StyledTableCell>
              <StyledTableCell width="5%">Durumu</StyledTableCell>
              <StyledTableCell width="10%" align="center">İşlemler</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {showOnlyUnread ? "Okunmamış mesaj bulunamadı" : "Henüz mesaj bulunmuyor"}
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((message) => (
                <TableRow 
                  key={message.id}
                  sx={{ 
                    backgroundColor: message.read ? 'inherit' : 'rgba(76, 175, 80, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <TableCell>{message.id}</TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {message.content}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    {message.read ? (
                      <Chip 
                        size="small" 
                        color="success" 
                        variant="outlined"
                        icon={<CheckCircleIcon fontSize="small" />}
                        label="Okundu" 
                      />
                    ) : (
                      <Chip 
                        size="small" 
                        color="primary" 
                        icon={<MailIcon fontSize="small" />}
                        label="Yeni" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="Mesajı Oku">
                        <IconButton 
                          color="primary" 
                          size="small" 
                          onClick={() => handleOpenMessage(message)}
                          sx={{ mr: 1 }}
                        >
                          <ReadMoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!message.read && (
                        <Tooltip title="Okundu İşaretle">
                          <IconButton 
                            color="success" 
                            size="small" 
                            onClick={() => markAsRead(message.id)}
                            sx={{ mr: 1 }}
                          >
                            <MarkEmailReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Mesajı Sil">
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={(e) => handleOpenDeleteDialog(message, e)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mesaj detay dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMessage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedMessage.name}</Typography>
                <Chip 
                  size="small" 
                  color={selectedMessage.read ? "success" : "primary"}
                  variant={selectedMessage.read ? "outlined" : "filled"}
                  label={selectedMessage.read ? "Okundu" : "Yeni"}
                  icon={selectedMessage.read ? <CheckCircleIcon fontSize="small" /> : <MailIcon fontSize="small" />}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>E-posta:</strong> {selectedMessage.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Tarih:</strong> {formatDate(selectedMessage.createdAt)}
                </Typography>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.content}
                </DialogContentText>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Kapat
              </Button>
              <Button 
                onClick={() => handleOpenDeleteDialog(selectedMessage)} 
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
              >
                Sil
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Silme onay dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Mesajı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {messageToDelete && `${messageToDelete.name} tarafından gönderilen mesajı silmek istediğinizden emin misiniz?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">İptal</Button>
          <Button onClick={handleDeleteMessage} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bildirim */}
      <Snackbar open={alert.open} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMessages; 