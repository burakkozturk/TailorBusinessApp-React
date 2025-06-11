import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  InputAdornment,
  Alert
} from '@mui/material';
import { Order } from '../constants/orderTypes';

const OrderDialog = ({ open, onClose, customer = null, order = null, onSave }) => {
  const [formData, setFormData] = useState({
    productType: order?.productType || 'CEKET',
    fitType: order?.fitType || 'REGULAR',
    status: order?.status || 'PREPARING',
    estimatedDeliveryDate: order?.estimatedDeliveryDate || '',
    notes: order?.notes || '',
    totalPrice: order?.totalPrice || '',
    fabric: order?.fabric || null,
    customer: customer?.id || order?.customer?.id || null
  });

  const [customers, setCustomers] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://erdalguda.online/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Müşteri bilgileri çekilirken hata:', error);
    }
  };
  

  const fetchFabrics = async () => {
    try {
      const response = await axios.get('https://erdalguda.online/api/fabrics');
      setFabrics(response.data);
    } catch (error) {
      console.error('Kumaş bilgileri çekilirken hata:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchFabrics();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.customer) {
        setError('Lütfen bir müşteri seçin');
        setLoading(false);
        return;
      }
      
      if (formData.status === 'Tamamlandı' && !formData.estimatedDeliveryDate) {
        formData.estimatedDeliveryDate = new Date().toISOString().split('T')[0];
      }
      
      const response = await axios({
        method: order ? 'put' : 'post',
        url: `https://erdalguda.online/api/orders${order ? `/${order.id}` : ''}`,
        data: formData
      });
      
      setLoading(false);
      if (order) {
        onSave(response.data);
      } else {
        onSave(response.data);
      }
      onClose();
    } catch (error) {
      setLoading(false);
      console.error('Sipariş kaydedilirken hata:', error);
      setError('Sipariş kaydedilirken bir hata oluştu');
    }
  };

  const customerList = React.useMemo(() => {
    if (!Array.isArray(customers)) return [];
    return customers;
  }, [customers]);

  const fabricList = React.useMemo(() => {
    if (!Array.isArray(fabrics)) return [];
    return fabrics;
  }, [fabrics]);

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
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {!customer && (
            <FormControl fullWidth required>
              <InputLabel>Müşteri</InputLabel>
              <Select
                name="customer"
                value={formData.customer || ''}
                onChange={handleChange}
                label="Müşteri"
              >
                {customerList.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {`${c.firstName} ${c.lastName}`}
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
                const selectedFabric = fabricList.find(f => f.id === fabricId);
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
              {fabricList.map((fabric) => (
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

export default OrderDialog; 