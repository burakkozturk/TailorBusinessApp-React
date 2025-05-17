import React, { useState, useEffect, useCallback } from 'react';
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
  Grid,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit, Delete, Search, KeyboardArrowDown, KeyboardArrowUp, Add, Event, LocalShipping } from '@mui/icons-material';
import '../styles/Customers.css';
import { Order } from '../constants/orderTypes';

const EditCustomerDialog = ({ open, onClose, customer, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    height: '',
    weight: '',
    address: '',
    measurements: {
      chest: '',
      waist: '',
      hip: '',
      shoulder: '',
      neck: '',
      leftArm: '',
      rightArm: '',
      leftThigh: '',
      rightThigh: '',
      leftCalf: '',
      rightCalf: '',
      elbowLength: ''
    }
  });

  const [loading, setLoading] = useState(false);

  const fetchMeasurements = useCallback(async () => {
    if (!customer) return;

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:6767/api/measurements/${customer.id}`);
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          measurements: {
            chest: response.data.chest || '',
            waist: response.data.waist || '',
            hip: response.data.hip || '',
            shoulder: response.data.shoulder || '',
            neck: response.data.neck || '',
            leftArm: response.data.leftArm || '',
            rightArm: response.data.rightArm || '',
            leftThigh: response.data.leftThigh || '',
            rightThigh: response.data.rightThigh || '',
            leftCalf: response.data.leftCalf || '',
            rightCalf: response.data.rightCalf || '',
            elbowLength: response.data.elbowLength || ''
          }
        }));
      }
    } catch (error) {
      console.error('Ölçüler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        height: customer.height || '',
        weight: customer.weight || '',
        address: customer.address || '',
        measurements: {
          chest: '',
          waist: '',
          hip: '',
          shoulder: '',
          neck: '',
          leftArm: '',
          rightArm: '',
          leftThigh: '',
          rightThigh: '',
          leftCalf: '',
          rightCalf: '',
          elbowLength: ''
        }
      });

      fetchMeasurements();
    }
  }, [customer, fetchMeasurements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [name]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Müşteri bilgilerini güncelle
      const customerData = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      };
      delete customerData.measurements;

      const customerResponse = await axios.put(`http://localhost:6767/api/customers/${customer.id}`, customerData);

      // Ölçüleri güncelle
      const measurementData = {
        ...formData.measurements,
        chest: formData.measurements.chest ? parseFloat(formData.measurements.chest) : null,
        waist: formData.measurements.waist ? parseFloat(formData.measurements.waist) : null,
        hip: formData.measurements.hip ? parseFloat(formData.measurements.hip) : null,
        shoulder: formData.measurements.shoulder ? parseFloat(formData.measurements.shoulder) : null,
        neck: formData.measurements.neck ? parseFloat(formData.measurements.neck) : null,
        leftArm: formData.measurements.leftArm ? parseFloat(formData.measurements.leftArm) : null,
        rightArm: formData.measurements.rightArm ? parseFloat(formData.measurements.rightArm) : null,
        leftThigh: formData.measurements.leftThigh ? parseFloat(formData.measurements.leftThigh) : null,
        rightThigh: formData.measurements.rightThigh ? parseFloat(formData.measurements.rightThigh) : null,
        leftCalf: formData.measurements.leftCalf ? parseFloat(formData.measurements.leftCalf) : null,
        rightCalf: formData.measurements.rightCalf ? parseFloat(formData.measurements.rightCalf) : null,
        elbowLength: formData.measurements.elbowLength ? parseFloat(formData.measurements.elbowLength) : null
      };

      await axios.put(`http://localhost:6767/api/measurements/${customer.id}`, measurementData);

      onUpdate(customerResponse.data);
      onClose();
    } catch (error) {
      console.error('Güncelleme sırasında hata oluştu:', error);
      alert('Güncelleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
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
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e2e8f0',
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2.5,
          fontSize: '1.5rem',
          fontWeight: 500
        }}
      >
        Müşteri Düzenle
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Yükleniyor...</Typography>
          </Box>
        ) : (
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Temel Bilgiler */}
            <Typography variant="h6" gutterBottom>
              Temel Bilgiler
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="Ad"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Soyad"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <TextField
              name="phone"
              label="Telefon"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={inputStyle}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="height"
                  label="Boy (cm)"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="weight"
                  label="Kilo (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <TextField
              name="address"
              label="Adres"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={inputStyle}
            />

            {/* Ölçüler */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ölçüler
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="chest"
                  label="Göğüs"
                  type="number"
                  value={formData.measurements.chest}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="waist"
                  label="Bel"
                  type="number"
                  value={formData.measurements.waist}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="hip"
                  label="Kalça"
                  type="number"
                  value={formData.measurements.hip}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="shoulder"
                  label="Omuz"
                  type="number"
                  value={formData.measurements.shoulder}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="neck"
                  label="Boyun"
                  type="number"
                  value={formData.measurements.neck}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="leftArm"
                  label="Sol Kol"
                  type="number"
                  value={formData.measurements.leftArm}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="rightArm"
                  label="Sağ Kol"
                  type="number"
                  value={formData.measurements.rightArm}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="leftThigh"
                  label="Sol Uyluk"
                  type="number"
                  value={formData.measurements.leftThigh}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="rightThigh"
                  label="Sağ Uyluk"
                  type="number"
                  value={formData.measurements.rightThigh}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="leftCalf"
                  label="Sol Baldır"
                  type="number"
                  value={formData.measurements.leftCalf}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="rightCalf"
                  label="Sağ Baldır"
                  type="number"
                  value={formData.measurements.rightCalf}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="elbowLength"
                  label="Dirsek Uzunluğu"
                  type="number"
                  value={formData.measurements.elbowLength}
                  onChange={handleMeasurementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </Stack>
        )}
      </DialogContent>
      <DialogActions 
        sx={{ 
          p: 3, 
          bgcolor: 'grey.50',
          gap: 1
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            color: 'grey.700',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50'
            }
          }}
        >
          İptal
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.firstName || !formData.lastName || !formData.phone || loading}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const OrderDialog = ({ open, onClose, customer = null, order = null, onSave }) => {
  const [formData, setFormData] = useState({
    productType: order?.productType || 'CEKET',
    fitType: order?.fitType || 'REGULAR',
    status: order?.status || 'PREPARING',
    estimatedDeliveryDate: order?.estimatedDeliveryDate || '',
    notes: order?.notes || '',
    totalPrice: order?.totalPrice || '',
    fabric: order?.fabric || null,
    customer: customer || null
  });

  const [customers, setCustomers] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchFabrics();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:6767/api/customers');
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data.customers) ? response.data.customers : []);
      setCustomers(data);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error);
    }
  };

  const fetchFabrics = async () => {
    try {
      const response = await axios.get('http://localhost:6767/api/fabrics');
      setFabrics(response.data);
    } catch (error) {
      console.error('Kumaşlar yüklenirken hata oluştu:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const orderData = {
        ...formData,
        customer: { id: formData.customer }
      };

      const response = await axios[order ? 'put' : 'post'](
        `http://localhost:6767/api/orders${order ? `/${order.id}` : ''}`,
        orderData
      );

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Sipariş kaydedilirken hata oluştu:', error);
      alert('Sipariş kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 2.5,
          fontSize: '1.5rem',
          fontWeight: 500
        }}
      >
        {order ? 'Siparişi Düzenle' : 'Yeni Sipariş'}
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {!customer && (
            <FormControl fullWidth required>
              <InputLabel>Müşteri</InputLabel>
              <Select
                name="customer"
                value={formData.customer?.id || ''}
                onChange={(e) => {
                  const customerId = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    customer: customerId
                  }));
                }}
                label="Müşteri"
              >
                <MenuItem value="">
                  <em>Seçiniz</em>
                </MenuItem>
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Ürün Tipi</InputLabel>
                <Select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  label="Ürün Tipi"
                >
                  {Object.entries(Order.ProductType).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kalıp Tipi</InputLabel>
                <Select
                  name="fitType"
                  value={formData.fitType}
                  onChange={handleChange}
                  label="Kalıp Tipi"
                >
                  {Object.entries(Order.FitType).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Durum</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Durum"
                >
                  {Object.entries(Order.OrderStatus).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="estimatedDeliveryDate"
                label="Tahmini Teslim Tarihi"
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel>Kumaş</InputLabel>
            <Select
              name="fabric"
              value={formData.fabric?.id || ''}
              onChange={(e) => {
                const fabricId = e.target.value;
                const selectedFabric = fabrics.find(f => f.id === fabricId);
                setFormData(prev => ({
                  ...prev,
                  fabric: selectedFabric
                }));
              }}
              label="Kumaş"
            >
              <MenuItem value="">
                <em>Seçiniz</em>
              </MenuItem>
              {fabrics.map((fabric) => (
                <MenuItem key={fabric.id} value={fabric.id}>
                  {fabric.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="totalPrice"
            label="Toplam Fiyat"
            type="number"
            value={formData.totalPrice}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">₺</InputAdornment>,
            }}
          />

          <TextField
            name="notes"
            label="Notlar"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          bgcolor: 'grey.50',
          gap: 1
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            color: 'grey.700',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50'
            }
          }}
        >
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !formData.customer || !formData.productType || !formData.fitType || !formData.status || !formData.estimatedDeliveryDate || !formData.totalPrice}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          {loading ? 'Kaydediliyor...' : (order ? 'Güncelle' : 'Kaydet')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Row = ({ customer, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [measurementForm, setMeasurementForm] = useState({
    chest: '',
    waist: '',
    hip: '',
    shoulder: '',
    neck: '',
    leftArm: '',
    rightArm: '',
    leftThigh: '',
    rightThigh: '',
    leftCalf: '',
    rightCalf: '',
    elbowLength: ''
  });
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const inputStyle = {
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
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e2e8f0',
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(`http://localhost:6767/api/orders/by-customer/${customer.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata oluştu:', error);
    } finally {
      setOrdersLoading(false);
    }
  }, [customer.id]);

  const fetchMeasurements = useCallback(async () => {
    if (!customer) return;

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:6767/api/measurements/${customer.id}`);
      setMeasurements(response.data);
      if (response.data) {
        setMeasurementForm({
          chest: response.data.chest || '',
          waist: response.data.waist || '',
          hip: response.data.hip || '',
          shoulder: response.data.shoulder || '',
          neck: response.data.neck || '',
          leftArm: response.data.leftArm || '',
          rightArm: response.data.rightArm || '',
          leftThigh: response.data.leftThigh || '',
          rightThigh: response.data.rightThigh || '',
          leftCalf: response.data.leftCalf || '',
          rightCalf: response.data.rightCalf || '',
          elbowLength: response.data.elbowLength || ''
        });
      }
    } catch (error) {
      console.error('Ölçüler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (open) {
      fetchMeasurements();
      fetchOrders();
    }
  }, [open, fetchMeasurements, fetchOrders]);

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurementForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMeasurementSubmit = async () => {
    try {
      const method = measurements ? 'put' : 'post';
      const response = await axios[method](
        `http://localhost:6767/api/measurements/${customer.id}`,
        measurementForm
      );
      setMeasurements(response.data);
      alert('Ölçüler başarıyla kaydedildi');
    } catch (error) {
      console.error('Ölçüler kaydedilirken hata oluştu:', error);
      alert('Ölçüler kaydedilirken bir hata oluştu');
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const handleOrderSave = (savedOrder) => {
    if (selectedOrder) {
      // Güncelleme
      setOrders(prevOrders =>
        prevOrders.map(o => o.id === savedOrder.id ? savedOrder : o)
      );
    } else {
      // Yeni ekleme
      setOrders(prevOrders => [savedOrder, ...prevOrders]);
    }
  };

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
        className="customer-row"
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
        <TableCell sx={{ fontWeight: 500 }}>{customer.firstName}</TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{customer.lastName}</TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.address}</TableCell>
        <TableCell align="right">{customer.height} cm</TableCell>
        <TableCell align="right">{customer.weight} kg</TableCell>
        <TableCell>
          <IconButton 
            color="primary" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(customer);
            }}
            sx={{ mr: 1 }}
          >
            <Edit />
          </IconButton>
          <IconButton 
            color="error" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(customer.id);
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
              <Grid container spacing={3}>
                {/* Ölçüler Bölümü */}
                <Grid item xs={12} lg={6}>
                  <Typography variant="h6" gutterBottom>
                    Ölçüler
                  </Typography>
                  {loading ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography>Yükleniyor...</Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="chest"
                          label="Göğüs"
                          type="number"
                          value={measurementForm.chest}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="waist"
                          label="Bel"
                          type="number"
                          value={measurementForm.waist}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="hip"
                          label="Kalça"
                          type="number"
                          value={measurementForm.hip}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="shoulder"
                          label="Omuz"
                          type="number"
                          value={measurementForm.shoulder}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="neck"
                          label="Boyun"
                          type="number"
                          value={measurementForm.neck}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="leftArm"
                          label="Sol Kol"
                          type="number"
                          value={measurementForm.leftArm}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="rightArm"
                          label="Sağ Kol"
                          type="number"
                          value={measurementForm.rightArm}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="leftThigh"
                          label="Sol Uyluk"
                          type="number"
                          value={measurementForm.leftThigh}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="rightThigh"
                          label="Sağ Uyluk"
                          type="number"
                          value={measurementForm.rightThigh}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="leftCalf"
                          label="Sol Baldır"
                          type="number"
                          value={measurementForm.leftCalf}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="rightCalf"
                          label="Sağ Baldır"
                          type="number"
                          value={measurementForm.rightCalf}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="elbowLength"
                          label="Dirsek Uzunluğu"
                          type="number"
                          value={measurementForm.elbowLength}
                          onChange={handleMeasurementChange}
                          fullWidth
                          size="small"
                          sx={inputStyle}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleMeasurementSubmit}
                          sx={{ mt: 2 }}
                        >
                          Ölçüleri Kaydet
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>

                {/* Siparişler Bölümü */}
                <Grid item xs={12} lg={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Siparişler
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => {
                        setSelectedOrder(null);
                        setOrderDialogOpen(true);
                      }}
                    >
                      Yeni Sipariş
                    </Button>
                  </Box>
                  
                  {ordersLoading ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography>Siparişler Yükleniyor...</Typography>
                    </Box>
                  ) : orders.length === 0 ? (
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                      <Typography color="textSecondary">
                        Henüz sipariş bulunmuyor
                      </Typography>
                    </Paper>
                  ) : (
                    <Stack spacing={2}>
                      {orders.map((order) => (
                        <Paper
                          key={order.id}
                          sx={{
                            p: 2,
                            '&:hover': {
                              bgcolor: 'grey.50',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleOrderClick(order)}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {Order.ProductType[order.productType]?.displayName || order.productType}
                                </Typography>
                                <Box
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor: getStatusColor(order.status) + '20',
                                    color: getStatusColor(order.status)
                                  }}
                                >
                                  {Order.OrderStatus[order.status]?.displayName || order.status}
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="textSecondary">
                                Kalıp: {Order.FitType[order.fitType]?.displayName || order.fitType}
                              </Typography>
                              {order.fabric && (
                                <Typography variant="body2" color="textSecondary">
                                  Kumaş: {order.fabric.name}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Event fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  Sipariş: {new Date(order.orderDate).toLocaleDateString('tr-TR')}
                                </Typography>
                              </Box>
                              {order.estimatedDeliveryDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocalShipping fontSize="small" color="action" />
                                  <Typography variant="body2" color="textSecondary">
                                    Teslim: {new Date(order.estimatedDeliveryDate).toLocaleDateString('tr-TR')}
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                            {order.notes && (
                              <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                  Notlar: {order.notes}
                                </Typography>
                              </Grid>
                            )}
                            {order.totalPrice && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                  Toplam: {order.totalPrice.toLocaleString('tr-TR')} ₺
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <OrderDialog
        open={orderDialogOpen}
        onClose={() => {
          setOrderDialogOpen(false);
          setSelectedOrder(null);
        }}
        customer={customer}
        order={selectedOrder}
        onSave={handleOrderSave}
      />
    </>
  );
};

const AddCustomerDialog = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    height: '',
    weight: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const customerData = {
        ...formData,
        height: parseInt(formData.height),
        weight: parseInt(formData.weight)
      };

      const response = await axios.post('http://localhost:6767/api/customers', customerData);
      onAdd(response.data);
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        height: '',
        weight: '',
        address: ''
      });
    } catch (error) {
      console.error('Müşteri eklenirken hata oluştu:', error);
    }
  };

  const inputStyle = {
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
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e2e8f0',
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2.5,
          fontSize: '1.5rem',
          fontWeight: 500
        }}
      >
        Yeni Müşteri Ekle
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* İsim Soyisim */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="Ad"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Soyad"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>
          </Grid>

          {/* Telefon */}
          <TextField
            name="phone"
            label="Telefon"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            sx={inputStyle}
          />

          {/* Boy Kilo */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="height"
                label="Boy (cm)"
                type="number"
                value={formData.height}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="weight"
                label="Kilo (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={inputStyle}
              />
            </Grid>
          </Grid>

          {/* Adres */}
          <TextField
            name="address"
            label="Adres"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            sx={inputStyle}
          />
        </Stack>
      </DialogContent>
      <DialogActions 
        sx={{ 
          p: 3, 
          bgcolor: 'grey.50',
          gap: 1
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            color: 'grey.700',
            borderColor: 'grey.300',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50'
            }
          }}
        >
          İptal
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!formData.firstName || !formData.lastName || !formData.phone}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const customersPerPage = 8;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6767/api/customers');
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data.customers) ? response.data.customers : []);
      setCustomers(data);
      setTotalPages(Math.ceil(data.length / customersPerPage));
      setLoading(false);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Müşteriler yüklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (customerId) => {
    setSelectedCustomerId(customerId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:6767/api/customers/safe/${selectedCustomerId}`);
      
      if (response.status === 204) {
        setCustomers(customers.filter(c => c.id !== selectedCustomerId));
        setSnackbar({
          open: true,
          message: 'Müşteri başarıyla silindi',
          severity: 'success'
        });
      } else {
        throw new Error('Müşteri silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Müşteri silinirken hata oluştu:', error);
      let errorMessage = 'Müşteri silinirken bir hata oluştu';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Müşteri bulunamadı';
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
      setSelectedCustomerId(null);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * customersPerPage,
    page * customersPerPage
  );

  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setSnackbar({
      open: true,
      message: 'Müşteri başarıyla eklendi',
      severity: 'success'
    });
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleUpdate = (updatedCustomer) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(c =>
        c.id === updatedCustomer.id ? updatedCustomer : c
      )
    );
    setSnackbar({
      open: true,
      message: 'Müşteri başarıyla güncellendi',
      severity: 'success'
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCustomers.length / customersPerPage));
    if (page > Math.ceil(filteredCustomers.length / customersPerPage)) {
      setPage(1);
    }
  }, [filteredCustomers, customersPerPage, page]);

  return (
    <div className="customers-container">
      <Box className="customers-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Müşteri Listesi
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            className="search-field"
            variant="outlined"
            placeholder="Müşteri Ara..."
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
            color="secondary"
            startIcon={<LocalShipping />}
            onClick={() => setOrderDialogOpen(true)}
            sx={{
              bgcolor: 'secondary.main',
              '&:hover': {
                bgcolor: 'secondary.dark',
              }
            }}
          >
            Yeni Sipariş
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setAddDialogOpen(true)}
          >
            Yeni Müşteri
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50px' }} />
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  width: '150px'
                }}
              >
                AD
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  width: '150px'
                }}
              >
                SOYAD
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  width: '150px'
                }}
              >
                TELEFON
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  flex: 1
                }}
              >
                ADRES
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  width: '100px'
                }}
              >
                BOY
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  width: '100px'
                }}
              >
                KİLO
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff',
                  backgroundColor: '#2c3e50',
                  width: '120px'
                }}
              >
                İŞLEMLER
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Yükleniyor...</TableCell>
              </TableRow>
            ) : paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Müşteri bulunamadı</TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <Row key={customer.id} customer={customer} onDelete={handleDelete} onEdit={handleEdit} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && filteredCustomers.length > 0 && (
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
        <DialogTitle>Müşteriyi Sil</DialogTitle>
        <DialogContent>
          Bu müşteriyi silmek istediğinizden emin misiniz?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <EditCustomerDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onUpdate={handleUpdate}
      />

      <AddCustomerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddCustomer}
      />

      <OrderDialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        onSave={(savedOrder) => {
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

export default Customers; 