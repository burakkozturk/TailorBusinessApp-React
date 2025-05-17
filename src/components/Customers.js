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
  MenuItem,
  Container,
  Avatar,
  Chip
} from '@mui/material';
import { Edit, Delete, Search, KeyboardArrowDown, KeyboardArrowUp, Add, Event, LocalShipping, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import '../styles/Customers.css';
import { Order } from '../constants/orderTypes';

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

const CustomerAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 40,
  height: 40
}));

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
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [measurementValues, setMeasurementValues] = useState({
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchOrders();
      fetchMeasurements();
    }
  }, [open, customer.id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:6767/api/orders/customer/${customer.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeasurements = async () => {
    try {
      const response = await axios.get(`http://localhost:6767/api/measurements/${customer.id}`);
      if (response.data) {
        setMeasurementValues({
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
    }
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurementValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMeasurementSubmit = async () => {
    try {
      const method = orders.length > 0 ? 'put' : 'post';
      const response = await axios[method](
        `http://localhost:6767/api/measurements/${customer.id}`,
        measurementValues
      );
      if (method === 'put') {
        setOrders(prevOrders =>
          prevOrders.map(o => o.id === response.data.id ? response.data : o)
        );
      } else {
        setOrders(prevOrders => [response.data, ...prevOrders]);
      }
      setMeasurementOpen(false);
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
    fetchOrders();
    setOrderDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PREPARING': return '#FFC107';
      case 'CUTTING': return '#2196F3';
      case 'SEWING': return '#9C27B0';
      case 'FITTING': return '#3F51B5';
      case 'READY': return '#4CAF50';
      case 'DELIVERED': return '#8BC34A';
      case 'CANCELLED': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PREPARING': return 'Hazırlanıyor';
      case 'CUTTING': return 'Kesim';
      case 'SEWING': return 'Dikim';
      case 'FITTING': return 'Prova';
      case 'READY': return 'Hazır';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'CANCELLED': return 'İptal';
      default: return status;
    }
  };

  return (
    <>
      <TableRow sx={{ 
        '& > *': { borderBottom: 'unset' }, 
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
      }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ 
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomerAvatar alt={customer.firstName}>
              {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
            </CustomerAvatar>
            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {customer.firstName} {customer.lastName}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.address}</TableCell>
        <TableCell>
          {customer.height ? customer.height + ' cm' : '-'} / {customer.weight ? customer.weight + ' kg' : '-'}
        </TableCell>
        <TableCell align="center">
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onEdit(customer)}
            sx={{ 
              bgcolor: 'rgba(25, 118, 210, 0.1)', 
              mr: 1,
              transition: 'transform 0.2s',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.2)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => onDelete(customer.id)}
            sx={{ 
              bgcolor: 'rgba(211, 47, 47, 0.1)', 
              transition: 'transform 0.2s',
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.2)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Detay kısmı */}
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '0 0 16px 16px' }}>
              
              {/* Ölçüler ve Sipariş butonları */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Müşteri Detayı
                </Typography>
                <Box>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setMeasurementOpen(true)}
                    sx={{ mr: 1 }}
                  >
                    Ölçüler
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<Event />}
                    onClick={() => {
                      setSelectedOrder(null);
                      setOrderDialogOpen(true);
                    }}
                  >
                    Yeni Sipariş
                  </StyledButton>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Siparişler Listesi */}
              <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                Siparişler
              </Typography>
              
              {orders.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    {orders.map((order) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                            },
                            borderLeft: `5px solid ${getStatusColor(order.status)}`,
                          }}
                          onClick={() => handleOrderClick(order)}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {order.productType}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Durum:
                            </Typography>
                            <Chip
                              label={getStatusText(order.status)}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(order.status),
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Teslim:
                            </Typography>
                            <Typography variant="body2">
                              {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Tutar:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {order.totalPrice ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalPrice) : '-'}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                  {loading ? 'Siparişler yükleniyor...' : 'Bu müşteriye ait sipariş bulunamadı.'}
                </Typography>
              )}
              
              {/* Ölçü Modalı */}
              <Dialog 
                open={measurementOpen} 
                onClose={() => setMeasurementOpen(false)}
                PaperProps={{
                  sx: { borderRadius: 3 }
                }}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    Ölçüler: {customer.firstName} {customer.lastName}
                  </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="chest"
                        label="Göğüs"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.chest}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="waist"
                        label="Bel"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.waist}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="hip"
                        label="Kalça"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.hip}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="shoulder"
                        label="Omuz"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.shoulder}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="neck"
                        label="Boyun"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.neck}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="leftArm"
                        label="Sol Kol"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.leftArm}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="rightArm"
                        label="Sağ Kol"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.rightArm}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="leftThigh"
                        label="Sol Uyluk"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.leftThigh}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="rightThigh"
                        label="Sağ Uyluk"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.rightThigh}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="leftCalf"
                        label="Sol Baldır"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.leftCalf}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="rightCalf"
                        label="Sağ Baldır"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.rightCalf}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        name="elbowLength"
                        label="Dirsek Uzunluğu"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={measurementValues.elbowLength}
                        onChange={handleMeasurementChange}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Button onClick={() => setMeasurementOpen(false)}>İptal</Button>
                  <StyledButton
                    onClick={handleMeasurementSubmit}
                    color="primary"
                    variant="contained"
                  >
                    Kaydet
                  </StyledButton>
                </DialogActions>
              </Dialog>
              
              {/* Sipariş Modal */}
              <OrderDialog
                open={orderDialogOpen}
                onClose={() => setOrderDialogOpen(false)}
                customer={customer}
                order={selectedOrder}
                onSave={handleOrderSave}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          position: 'relative',
          display: 'inline-block',
          mb: 4,
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
          Müşteri Listesi
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              icon={<Person />} 
              label={`Toplam: ${customers.length} Müşteri`} 
              color="primary" 
              variant="outlined" 
              sx={{ mr: 2, fontWeight: 'bold' }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledTextField
              variant="outlined"
              placeholder="Müşteri Ara..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: '250px' }}
            />
            
            <StyledButton
              variant="contained"
              color="secondary"
              startIcon={<LocalShipping />}
              onClick={() => setOrderDialogOpen(true)}
            >
              Yeni Sipariş
            </StyledButton>
            
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
            >
              Yeni Müşteri
            </StyledButton>
          </Box>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: '50px' }} />
                <StyledTableCell>Müşteri</StyledTableCell>
                <StyledTableCell>Telefon</StyledTableCell>
                <StyledTableCell>Adres</StyledTableCell>
                <StyledTableCell>Boy / Kilo</StyledTableCell>
                <StyledTableCell align="center">İşlemler</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <Row
                    key={customer.id}
                    customer={customer}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {loading ? 'Müşteriler yükleniyor...' : 'Müşteri bulunamadı'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '8px',
            }
          }}
        />
      </Box>

      {/* Dialog bileşenleri */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>Müşteriyi Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu müşteriyi silmek istediğinize emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: '8px' }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <EditCustomerDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
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
        customer={null}
        onSave={() => {
          setSnackbar({
            open: true,
            message: 'Sipariş başarıyla oluşturuldu',
            severity: 'success'
          });
          setOrderDialogOpen(false);
        }}
      />

      {/* Bildirim */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Customers; 