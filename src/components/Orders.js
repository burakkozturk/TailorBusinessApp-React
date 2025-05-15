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
  Chip
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  KeyboardArrowDown,
  KeyboardArrowUp,
  AccessTime,
  Done,
  LocalShipping,
  Cancel,
  Add
} from '@mui/icons-material';
import '../styles/Orders.css';
import { Order } from '../constants/orderTypes';
import { OrderDialog } from './Customers';

const getStatusChip = (status) => {
  const statusConfig = {
    PENDING: { color: 'warning', icon: <AccessTime />, label: 'Beklemede' },
    IN_PROGRESS: { color: 'info', icon: <LocalShipping />, label: 'Hazırlanıyor' },
    COMPLETED: { color: 'success', icon: <Done />, label: 'Tamamlandı' },
    CANCELLED: { color: 'error', icon: <Cancel />, label: 'İptal Edildi' }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
    />
  );
};

const Row = ({ order, onDelete }) => {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PREPARING':
        return '#FFA726';
      case 'CUTTING':
        return '#29B6F6';
      case 'SEWING':
        return '#66BB6A';
      case 'FITTING':
        return '#AB47BC';
      case 'READY':
        return '#26A69A';
      case 'DELIVERED':
        return '#2E7D32';
      case 'CANCELLED':
        return '#EF5350';
      default:
        return '#78909C';
    }
  };

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
        <TableCell>{order.orderNumber}</TableCell>
        <TableCell>
          <Typography variant="subtitle2">
            {order.customer.firstName} {order.customer.lastName}
          </Typography>
        </TableCell>
        <TableCell>{order.customer.phone}</TableCell>
        <TableCell>{new Date(order.orderDate).toLocaleDateString('tr-TR')}</TableCell>
        <TableCell>
          <Typography sx={{ color: 'success.main', fontWeight: 500 }}>
            {order.totalAmount?.toLocaleString('tr-TR')} ₺
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={Order.OrderStatus[order.status]?.displayName || order.status}
            sx={{
              bgcolor: `${getStatusColor(order.status)}20`,
              color: getStatusColor(order.status),
              fontWeight: 500
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton 
            color="primary" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Edit işlemi buraya gelecek
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
  const ordersPerPage = 8;
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6767/api/orders');
      setOrders(response.data);
      setTotalPages(Math.ceil(response.data.length / ordersPerPage));
    } catch (error) {
      console.error('Siparişler yüklenirken hata oluştu:', error);
      setSnackbar({
        open: true,
        message: 'Siparişler yüklenirken bir hata oluştu',
        severity: 'error'
      });
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
        setOrders(orders.filter(o => o.id !== selectedOrderId));
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
      let errorMessage = 'Sipariş silinirken bir hata oluştu';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Sipariş bulunamadı';
        } else if (error.response.data && typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
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

  const filteredOrders = orders.filter(order =>
    order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.phone.includes(searchTerm) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredOrders.length / ordersPerPage));
    if (page > Math.ceil(filteredOrders.length / ordersPerPage)) {
      setPage(1);
    }
  }, [filteredOrders]);

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
              <TableCell>Sipariş No</TableCell>
              <TableCell>Müşteri</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Tarih</TableCell>
              <TableCell>Tutar</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
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
        <Box className="pagination-container">
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