import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
  Alert,
  Snackbar,
  Chip,
  Stack,
  Container,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Grid,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add,
  Event,
  LocalShipping,
  FilterList,
  Update,
  Refresh,
  Assignment,
  Sort
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import useDocumentTitle from '../hooks/useDocumentTitle';
import '../styles/Orders.css';
import { OrderDialog } from './Customers';

// Stillendirilmiş bileşenler
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme, color = 'primary' }) => ({
  borderRadius: '10px',
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
    borderRadius: '10px',
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden'
}));

const AnimatedTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'transform 0.2s, background-color 0.2s',
  '&:hover': {
    backgroundColor: '#f8fafc !important',
    transform: 'translateX(5px)',
  }
}));

const getStatusChip = (status) => {
  // Status için renk ve isim mapping
  const statusConfig = {
    'PREPARING': { displayName: 'Hazırlanıyor', color: '#FF9800' },
    'FITTING': { displayName: 'Prova', color: '#2196F3' },
    'PRODUCTION': { displayName: 'Üretim', color: '#9C27B0' },
    'READY': { displayName: 'Hazır', color: '#4CAF50' },
    'DELIVERED': { displayName: 'Teslim Edildi', color: '#8BC34A' },
    'CANCELLED': { displayName: 'İptal', color: '#F44336' }
  }[status] || { displayName: status, color: '#78909C' };

  return (
    <Chip
      label={statusConfig.displayName}
      sx={{
        bgcolor: `${statusConfig.color}20`,
        color: statusConfig.color,
        fontWeight: 500,
        borderRadius: '10px',
        padding: '2px 4px',
        border: `1px solid ${statusConfig.color}40`
      }}
      size="small"
    />
  );
};

const Row = ({ order, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Notlardan fotoğraf URL'lerini çıkar
  const extractImagesFromNotes = (notes) => {
    if (!notes) return { images: [], textNotes: '' };
    
    // Markdown image pattern: ![alt](url)
    const imagePattern = /!\[.*?\]\((.*?)\)/g;
    const images = [];
    let match;
    
    while ((match = imagePattern.exec(notes)) !== null) {
      images.push(match[1]);
    }
    
    // Fotoğraf linklerini çıkarıp sadece text notları al
    const textNotes = notes.replace(imagePattern, '').trim();
    
    return { images, textNotes };
  };

  const { images, textNotes } = extractImagesFromNotes(order.notes);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  return (
    <>
      <AnimatedTableRow 
        className="order-row"
        onClick={() => setOpen(!open)}
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          backgroundColor: open ? '#f8fafc' : 'transparent',
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            sx={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                width: 36, 
                height: 36,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {order.customer.firstName?.charAt(0)}{order.customer.lastName?.charAt(0)}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {order.customer.firstName} {order.customer.lastName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{order.customer.phone}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event fontSize="small" color="action" />
            {new Date(order.orderDate).toLocaleDateString('tr-TR')}
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping fontSize="small" color="action" />
            {order.estimatedDeliveryDate ? 
              new Date(order.estimatedDeliveryDate).toLocaleDateString('tr-TR') : 
              'Belirlenmedi'
            }
          </Box>
        </TableCell>
        <TableCell>
          <Typography sx={{ color: 'success.main', fontWeight: 600 }}>
            {order.totalPrice?.toLocaleString('tr-TR')} ₺
          </Typography>
        </TableCell>
        <TableCell>
          {getStatusChip(order.status)}
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              color="primary" 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(order);
              }}
              sx={{ 
                transition: 'transform 0.2s', 
                '&:hover': { transform: 'scale(1.2)' },
                mr: 1
              }}
            >
              <Edit />
            </IconButton>
            <IconButton 
              color="error" 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(order.id);
              }}
              sx={{ 
                transition: 'transform 0.2s', 
                '&:hover': { transform: 'scale(1.2)' } 
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        </TableCell>
      </AnimatedTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, mt: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ 
                fontWeight: 'bold', 
                position: 'relative',
                display: 'inline-block',
                mb: 3,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '40px',
                  height: '3px',
                  bottom: '-8px',
                  left: '0',
                  backgroundColor: '#1976d2',
                  borderRadius: '8px'
                }
              }}>
                Sipariş Detayları
              </Typography>
              <Box className="order-details">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2, 
                        height: '100%',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          Teslimat Adresi:
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem' }}>
                          {order.deliveryAddress || order.customer.address || 'Adres belirtilmemiş'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2, 
                        height: '100%',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          Sipariş Notu:
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem' }}>
                          {textNotes || 'Not bulunmuyor'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 2, 
                        height: '100%',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                          Ürün Bilgileri:
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          <Typography sx={{ fontSize: '0.95rem' }}>
                            <strong>Ürün Tipi:</strong> {order.productType}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Fotoğraf Galerisi */}
                  {images.length > 0 && (
                    <Grid item xs={12}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          borderRadius: 2, 
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                            📸 Sipariş Fotoğrafları ({images.length})
                          </Typography>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            {images.map((imageUrl, index) => (
                              <Grid item xs={6} sm={4} md={3} key={index}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                                    }
                                  }}
                                  onClick={() => handleImageClick(imageUrl)}
                                >
                                  <img 
                                    src={imageUrl} 
                                    alt={`Sipariş fotoğrafı ${index + 1}`} 
                                    style={{ 
                                      width: '100%', 
                                      height: '120px', 
                                      objectFit: 'cover',
                                      display: 'block'
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)',
                                      display: 'flex',
                                      alignItems: 'flex-end',
                                      justifyContent: 'center',
                                      p: 1
                                    }}
                                  >
                                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                      Fotoğraf {index + 1}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      
      {/* Fotoğraf Modal */}
      <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📸 Sipariş Fotoğrafı - {order.customer.firstName} {order.customer.lastName}
          </Typography>
          <IconButton
            onClick={() => setImageModalOpen(false)}
            sx={{ color: 'white' }}
          >
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <img
                src={selectedImage}
                alt="Büyük görünüm"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Button 
            onClick={() => setImageModalOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Kapat
          </Button>
          <Button 
            href={selectedImage} 
            target="_blank" 
            variant="contained"
            sx={{ borderRadius: '8px' }}
          >
            Orijinal Boyutta Aç
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Sıralama seçenekleri
const sortOptions = [
  { value: 'date_desc', label: '📅 Yeni Siparişler Önce' },
  { value: 'date_asc', label: '📅 Eski Siparişler Önce' },
  { value: 'delivery_asc', label: '🚚 Teslimat Yakın → Uzak' },
  { value: 'delivery_desc', label: '🚚 Teslimat Uzak → Yakın' },
  { value: 'customer_asc', label: '👤 Müşteri A → Z' },
  { value: 'customer_desc', label: '👤 Müşteri Z → A' },
  { value: 'price_asc', label: '💰 Fiyat Düşük → Yüksek' },
  { value: 'price_desc', label: '💰 Fiyat Yüksek → Düşük' },
  { value: 'status_asc', label: '🏷️ Durum A → Z' }
];

// Siparişleri sıralama fonksiyonu
const sortOrders = (orders, sortBy) => {
  const sorted = [...orders];
  
  switch (sortBy) {
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'delivery_asc':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.estimatedDeliveryDate);
        const dateB = new Date(b.estimatedDeliveryDate);
        return dateA - dateB;
      });
    case 'delivery_desc':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.estimatedDeliveryDate);
        const dateB = new Date(b.estimatedDeliveryDate);
        return dateB - dateA;
      });
    case 'customer_asc':
      return sorted.sort((a, b) => {
        const nameA = `${a.customer?.firstName || ''} ${a.customer?.lastName || ''}`.toLowerCase();
        const nameB = `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB, 'tr');
      });
    case 'customer_desc':
      return sorted.sort((a, b) => {
        const nameA = `${a.customer?.firstName || ''} ${a.customer?.lastName || ''}`.toLowerCase();
        const nameB = `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.toLowerCase();
        return nameB.localeCompare(nameA, 'tr');
      });
    case 'price_asc':
      return sorted.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
    case 'price_desc':
      return sorted.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
    case 'status_asc':
      return sorted.sort((a, b) => (a.status || '').localeCompare(b.status || '', 'tr'));
    default:
      return sorted;
  }
};

const Orders = () => {
  useDocumentTitle('Sipariş Yönetimi');
  
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('date_desc'); // Varsayılan: Yeni siparişler önce
  const ordersPerPage = 8;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.orders.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      // totalPages artık filteredOrders useEffect'inde hesaplanıyor
    } catch (error) {
      console.error('Siparişler yüklenirken hata oluştu:', error);
      setSnackbar({
        open: true,
        message: 'Siparişler yüklenirken bir hata oluştu',
        severity: 'error'
      });
      setOrders([]); // Hata durumunda boş dizi set et
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    setSelectedOrderId(orderId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await apiService.orders.delete(selectedOrderId);
      
      if (response.status === 204) {
        setOrders(prevOrders => prevOrders.filter(o => o.id !== selectedOrderId));
        setSnackbar({
          open: true,
          message: 'Sipariş başarıyla silindi',
          severity: 'success'
        });
      } else {
        throw new Error('Sipariş silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Sipariş silinirken hata oluştu:', error);
      setSnackbar({
        open: true,
        message: 'Sipariş silinirken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredOrders = React.useMemo(() => {
    if (!Array.isArray(orders)) return [];
    
    // Önce filtreleme yap
    const filtered = orders.filter(order => {
      if (!order || !order.customer) return false;
      
      const customerName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.toLowerCase();
      const searchValue = searchTerm.toLowerCase();
      
      return customerName.includes(searchValue) || 
        (order.customer.phone && order.customer.phone.includes(searchValue)) ||
        (order.productType && order.productType.toLowerCase().includes(searchValue));
    });
    
    // Sonra sıralama yap
    return sortOrders(filtered, sortBy);
  }, [orders, searchTerm, sortBy]);

  const paginatedOrders = React.useMemo(() => {
    const startIndex = (page - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, page]);

  // TotalPages güncellemesi - filteredOrders değiştiğinde
  React.useEffect(() => {
    setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
  }, [filteredOrders]);

  // Sıralama değiştiğinde sayfa 1'e dön
  React.useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const handleOrderSave = async (savedOrder) => {
    try {
      // Eğer mevcut siparişi güncellediyse, orders listesini güncelle
      if (selectedOrder) {
        setOrders(prevOrders => 
          prevOrders.map(o => o.id === savedOrder.id ? savedOrder : o)
        );
        setSnackbar({
          open: true,
          message: 'Sipariş başarıyla güncellendi',
          severity: 'success'
        });
      } else {
        // Yeni sipariş oluşturulduysa, orders listesini güncelle
        fetchOrders();
        setSnackbar({
          open: true,
          message: 'Sipariş başarıyla oluşturuldu',
          severity: 'success'
        });
      }
      setOrderDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Sipariş işleminde hata oluştu:', error);
      setSnackbar({
        open: true,
        message: 'Sipariş işleminde bir hata oluştu',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
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
                <Assignment sx={{ mr: 2, fontSize: '2.5rem' }} />
                Sipariş Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Siparişleri görüntüleyin, düzenleyin ve yeni siparişler oluşturun
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <Assignment sx={{ fontSize: '2.5rem' }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Stats and Actions Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={orders.length} color="primary" max={999}>
              <Chip 
                icon={<Assignment />} 
                label="Toplam Sipariş" 
                color="primary" 
                variant="outlined" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  px: 1,
                  '& .MuiChip-icon': { fontSize: '1.2rem' }
                }} 
              />
            </Badge>
            {searchTerm && (
              <Chip 
                label={`${filteredOrders.length} sonuç`}
                color="secondary" 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledTextField
              placeholder="Müşteri adı veya telefon ile ara..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Sort fontSize="small" />
                  Sıralama
                </Box>
              </InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sıralama"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                    }
                  },
                }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <StyledButton
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchOrders}
              disabled={loading}
            >
              Yenile
            </StyledButton>
            
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setOrderDialogOpen(true)}
            >
              Yeni Sipariş
            </StyledButton>
          </Box>
        </Box>
      </Box>

      <StyledCard elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell width="60px"></StyledTableCell>
                <StyledTableCell>Müşteri</StyledTableCell>
                <StyledTableCell>Telefon</StyledTableCell>
                <StyledTableCell>Sipariş Tarihi</StyledTableCell>
                <StyledTableCell>Teslim Tarihi</StyledTableCell>
                <StyledTableCell>Toplam</StyledTableCell>
                <StyledTableCell>Durum</StyledTableCell>
                <StyledTableCell width="60px">İşlem</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <Row 
                    key={order.id} 
                    order={order} 
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      {searchTerm ? 'Arama sonucunda sipariş bulunamadı.' : 'Henüz kayıtlı sipariş bulunmuyor.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledCard>

      {filteredOrders.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '10px',
              }
            }}
          />
        </Box>
      )}

      {/* Silme Onay Dialogu */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Siparişi Sil</DialogTitle>
        <DialogContent>
          Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bildirim */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Sipariş Ekleme/Düzenleme Dialog */}
      <OrderDialog
        open={orderDialogOpen}
        onClose={() => {
          setOrderDialogOpen(false);
          setSelectedOrder(null);
        }}
        onSave={handleOrderSave}
        order={selectedOrder}
      />
    </Container>
  );
};

export default Orders; 