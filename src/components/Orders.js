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
  Stack
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add,
  Event,
  LocalShipping
} from '@mui/icons-material';
import '../styles/Orders.css';
import { Order } from '../constants/orderTypes';
import { OrderDialog } from './Customers';

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
        fontWeight: 500
      }}
      size="small"
    />
  );
};

const Row = ({ order, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        className="order-row"
        onClick={() => setOpen(!open)}
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          '&:hover': {
            backgroundColor: '#f8fafc',
            cursor: 'pointer'
          }
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
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">
            {order.customer.firstName} {order.customer.lastName}
          </Typography>
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
          <Typography sx={{ color: 'success.main', fontWeight: 500 }}>
            {order.totalPrice?.toLocaleString('tr-TR')} ₺
          </Typography>
        </TableCell>
        <TableCell>
          {getStatusChip(order.status)}
        </TableCell>
        <TableCell>
          <IconButton 
            color="error" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(order.id);
            }}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Sipariş Detayları
              </Typography>
              <Box className="order-details">
                <div className="detail-section">
                  <Typography variant="subtitle2">Teslimat Adresi:</Typography>
                  <Typography>{order.deliveryAddress || order.customer.address}</Typography>
                </div>
                <div className="detail-section">
                  <Typography variant="subtitle2">Sipariş Notu:</Typography>
                  <Typography>{order.notes || 'Not bulunmuyor'}</Typography>
                </div>
                <div className="detail-section">
                  <Typography variant="subtitle2">Ürün Bilgileri:</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography>
                      <strong>Ürün Tipi:</strong> {Order.ProductType[order.productType]?.displayName || order.productType}
                    </Typography>
                    <Typography>
                      <strong>Kalıp:</strong> {Order.FitType[order.fitType]?.displayName || order.fitType}
                    </Typography>
                    {order.fabric && (
                      <Typography>
                        <strong>Kumaş:</strong> {order.fabric.name}
                      </Typography>
                    )}
                  </Box>
                </div>
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
      if (!order || !order.customer) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        order.customer.firstName.toLowerCase().includes(searchLower) ||
        order.customer.lastName.toLowerCase().includes(searchLower) ||
        order.customer.phone.includes(searchTerm) ||
        (order.productType && Order.ProductType[order.productType]?.displayName.toLowerCase().includes(searchLower))
      );
    });
  }, [orders, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (Array.isArray(filteredOrders)) {
      setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
      if (page > Math.ceil(filteredOrders.length / ordersPerPage)) {
        setPage(1);
      }
    }
  }, [filteredOrders, page, ordersPerPage]);

  const paginatedOrders = React.useMemo(() => {
    if (!Array.isArray(filteredOrders)) return [];
    
    return filteredOrders.slice(
      (page - 1) * ordersPerPage,
      page * ordersPerPage
    );
  }, [filteredOrders, page, ordersPerPage]);

  return (
    <div className="orders-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sipariş Listesi
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Sipariş Ara..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOrderDialogOpen(true)}
          >
            Yeni Sipariş
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50px' }} />
              <TableCell>MÜŞTERİ</TableCell>
              <TableCell>TELEFON</TableCell>
              <TableCell>SİPARİŞ TARİHİ</TableCell>
              <TableCell>TESLİM TARİHİ</TableCell>
              <TableCell>TUTAR</TableCell>
              <TableCell>DURUM</TableCell>
              <TableCell>İŞLEMLER</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Sipariş bulunamadı</TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <Row
                  key={order.id}
                  order={order}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && filteredOrders.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Siparişi Sil</DialogTitle>
        <DialogContent>
          Bu siparişi silmek istediğinizden emin misiniz?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <OrderDialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        onSave={(savedOrder) => {
          setOrders(prev => [savedOrder, ...prev]);
          setSnackbar({
            open: true,
            message: 'Sipariş başarıyla oluşturuldu',
            severity: 'success'
          });
          setOrderDialogOpen(false);
        }}
      />

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
    </div>
  );
};

export default Orders; 