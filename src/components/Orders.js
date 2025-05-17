import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Grid
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
  Update
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import '../styles/Orders.css';
import { Order } from '../constants/orderTypes';
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
  const statusConfig = Order.OrderStatus[status] || {
    displayName: status,
    color: '#78909C'
  };

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
                          {order.notes || 'Not bulunmuyor'}
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
                            <strong>Ürün Tipi:</strong> {Order.ProductType[order.productType]?.displayName || order.productType}
                          </Typography>
                          <Typography sx={{ fontSize: '0.95rem' }}>
                            <strong>Kalıp:</strong> {Order.FitType[order.fitType]?.displayName || order.fitType}
                          </Typography>
                          {order.fabric && (
                            <Typography sx={{ fontSize: '0.95rem' }}>
                              <strong>Kumaş:</strong> {order.fabric.name}
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Orders = () => {
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
  const ordersPerPage = 8;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6767/api/orders');
      
      // API'den gelen veriyi kontrol et ve diziye dönüştür
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setTotalPages(Math.ceil(data.length / ordersPerPage));
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
      const response = await axios.delete(`http://localhost:6767/api/orders/${selectedOrderId}`);
      
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
    
    return orders.filter(order => {
      const customerName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
      const searchValue = searchTerm.toLowerCase();
      
      return customerName.includes(searchValue) || 
        (order.customer.phone && order.customer.phone.includes(searchValue)) ||
        (Order.ProductType[order.productType]?.displayName.toLowerCase().includes(searchValue));
    });
  }, [orders, searchTerm]);

  const paginatedOrders = React.useMemo(() => {
    const startIndex = (page - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, page]);

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
          Siparişler
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <StyledTextField
            placeholder="Müşteri adı veya telefon ara..."
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
            sx={{ minWidth: 300 }}
          />
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