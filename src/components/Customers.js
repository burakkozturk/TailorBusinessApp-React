import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import {
  Container, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Chip, Grid, Card, CardContent, CardActions, Collapse, Alert, Snackbar, MenuItem,
  Pagination, TableSortLabel, Tooltip, Badge, Avatar, Divider, Stack, Switch, FormControlLabel,
  InputAdornment, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, ListItemIcon,
  FormControl, Autocomplete, CircularProgress, Select, InputLabel
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, ExpandMore, KeyboardArrowDown, KeyboardArrowUp,
  Person, Phone, Email, Height, MonitorWeight, Search, Clear, FilterList,
  CameraAlt, CloudUpload, CloudDownload, CheckCircle, Cancel, Refresh, DeleteOutline, PhotoCamera, Groups, Preview
} from '@mui/icons-material';

import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import useDocumentTitle from '../hooks/useDocumentTitle';
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
    email: '',
    height: '',
    weight: '',
    address: '',

  });

  const [loading, setLoading] = useState(false);



  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        email: customer.email || '',
        height: customer.height || '',
        weight: customer.weight || '',
        address: customer.address || '',

              });
    }
  }, [customer]);

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
      
      // Müşteri bilgilerini güncelle
      const customerData = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      };

      const customerResponse = await apiService.customers.update(customer.id, customerData);

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

            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              sx={inputStyle}
              helperText="Sipariş durum güncellemeleri için gerekli"
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

export const OrderDialog = ({ open, onClose, customer = null, order = null, onSave, handleFileUpload, canSeePrices = true, canEditAll = true }) => {
  const [formData, setFormData] = useState({
    productType: order?.productType || 'CEKET',
    status: order?.status || 'PREPARING',
    estimatedDeliveryDate: order?.estimatedDeliveryDate || '',
    notes: order?.notes || '',
    totalPrice: order?.totalPrice || '',
    customer: customer || null,
    deliveryDate: order?.deliveryDate || '',
    
    // === GÖMLEK ÖZELLEŞTİRMELERİ ===
    collarType: order?.collarType || '',
    sleeveType: order?.sleeveType || '',
    
    // === PANTOLON ÖZELLEŞTİRMELERİ ===
    waistType: order?.waistType || '',
    pleatType: order?.pleatType || '',
    legType: order?.legType || '',
    
    // === CEKET ÖZELLEŞTİRMELERİ ===
    buttonType: order?.buttonType || '',
    pocketType: order?.pocketType || '',
    ventType: order?.ventType || '',
    backType: order?.backType || ''
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInputValue, setCustomerInputValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  
  // Fotoğraf yükleme state'leri
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  // Sipariş fotoğrafı yükleme için AWS S3 kullan
  const localHandleFileUpload = handleFileUpload || ((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // handleImageChange fonksiyonunu kullan (AWS S3 için)
    handleImageChange(event);
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Sipariş düzenleme durumunda form verilerini güncelle
    if (order) {
      setFormData({
        productType: order.productType || 'CEKET',
        status: order.status || 'PREPARING',
        estimatedDeliveryDate: order.estimatedDeliveryDate || '',
        notes: order.notes || '',
        totalPrice: order.totalPrice || '',
        customer: order.customer || null,
        deliveryDate: order.deliveryDate || '',
        
        // Ürün özelleştirmeleri - backend'den gelen değerler
        collarType: order.collarType || '',
        sleeveType: order.sleeveType || '',
        waistType: order.waistType || '',
        pleatType: order.pleatType || '',
        legType: order.legType || '',
        buttonType: order.buttonType || '',
        pocketType: order.pocketType || '',
        ventType: order.ventType || '',
        backType: order.backType || ''
      });
      
      // Mevcut notlardaki resimleri extract et
      if (order.notes) {
        const imageRegex = /!\[.*?\]\((https?:\/\/[^\)]+)\)/g;
        const foundImages = [];
        let match;
        while ((match = imageRegex.exec(order.notes)) !== null) {
          foundImages.push(match[1]);
        }
        setUploadedImageUrls(foundImages);
      }
    } else {
      // Yeni sipariş durumunda varsayılan değerler
      setFormData({
        productType: 'CEKET',
        status: 'PREPARING',
        estimatedDeliveryDate: '',
        notes: '',
        totalPrice: '',
        customer: customer || null,
        deliveryDate: '',
        
        // Yeni sipariş için boş özelleştirme değerleri
        collarType: '',
        sleeveType: '',
        waistType: '',
        pleatType: '',
        legType: '',
        buttonType: '',
        pocketType: '',
        ventType: '',
        backType: ''
      });
      
      // Yeni sipariş için resimleri temizle
      setUploadedImageUrls([]);
    }
    
    // Dialog her açıldığında fotoğraf state'lerini temizle
    setImageFile(null);
    setImagePreview(null);
    setImageUploading(false);
  }, [order, customer]);

  const fetchCustomers = async () => {
    try {
      setSearchLoading(true);
      const response = await apiService.customers.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setCustomers(data);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata oluştu:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Ürün tipine göre özelleştirme seçeneklerini al
  const getCustomizationOptions = () => {
    return Order.getCustomizationOptions(formData.productType);
  };

  // Fotoğraf yükleme fonksiyonları
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya türü kontrolü
      if (!file.type.match('image.*')) {
        alert('Lütfen bir resim dosyası seçin');
        return;
      }
      
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5242880) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      
      setImageFile(file);
      
      // Önizleme için FileReader kullan
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    console.log('🔥 handleImageUpload çağrıldı', { imageFile, hasFile: !!imageFile });
    
    if (!imageFile) {
      console.warn('❌ imageFile bulunamadı!');
      return;
    }
    
    try {
      setImageUploading(true);
      console.log('📤 Upload başlatılıyor...', imageFile.name, imageFile.size);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      
      console.log('🌐 API çağrısı yapılıyor...');
      const response = await apiService.upload.uploadFile(uploadFormData);
      console.log('✅ API Response:', response);
      
      if (response.data && response.data.url) {
        const newImageUrl = response.data.url;
        console.log('🖼️ Yeni image URL:', newImageUrl);
        
        setUploadedImageUrls(prev => {
          const newUrls = [...prev, newImageUrl];
          console.log('📋 uploadedImageUrls güncellendi:', newUrls);
          return newUrls;
        });
        
        // Notlara resim URL'ini ekle
        const currentNotes = formData.notes || '';
        const imageMarkdown = `\n![Sipariş Resmi](${newImageUrl})\n`;
        console.log('📝 Notes güncelleniyor:', { currentNotes, imageMarkdown });
        
        setFormData(prev => {
          const updated = {
            ...prev,
            notes: currentNotes + imageMarkdown
          };
          console.log('💾 formData.notes güncellendi:', updated.notes);
          return updated;
        });
        
        // Temizle
        setImageFile(null);
        setImagePreview(null);
        
        alert('Fotoğraf başarıyla yüklendi!');
        console.log('🎉 Upload tamamlandı!');
      } else {
        console.error('❌ Response data veya url eksik:', response);
      }
    } catch (error) {
      console.error('💥 Fotoğraf yüklenirken hata:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu: ' + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl) => {
    // Yüklenen resimler listesinden çıkar
    setUploadedImageUrls(prev => prev.filter(url => url !== imageUrl));
    
    // Notlardan resim URL'ini çıkar
    const imageMarkdown = `![Sipariş Resmi](${imageUrl})`;
    const updatedNotes = formData.notes.replace(imageMarkdown, '').replace(/\n\n+/g, '\n\n').trim();
    setFormData(prev => ({
      ...prev,
      notes: updatedNotes
    }));
  };

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit başladı');
    console.log('📝 formData:', formData);
    console.log('📋 uploadedImageUrls:', uploadedImageUrls);
    
    try {
      setLoading(true);
      
      // Form verilerini temizle - boş alanları çıkar
      let orderData = { ...formData };
      console.log('💾 orderData (kopyalandı):', orderData);
      
      // Boş özelleştirme alanlarını temizle
      Object.keys(orderData).forEach(key => {
        if (['collarType', 'sleeveType', 'waistType', 'pleatType', 'legType', 
             'buttonType', 'pocketType', 'ventType', 'backType'].includes(key)) {
          if (!orderData[key] || orderData[key] === '') {
            delete orderData[key];
          }
        }
      });
      
      console.log('🧹 orderData (temizlendi):', orderData);
      
      // Müşteri verisi düzeltme
      if (formData.customer && typeof formData.customer !== 'object') {
        const selectedCustomer = customers.find(c => c.id === formData.customer);
        orderData.customer = { id: formData.customer };
      } else if (formData.customer && typeof formData.customer === 'object') {
        orderData.customer = { id: formData.customer.id };
      }

      let response;
      
      // DELIVERED durumunda doğrudan deliveryDate değerini ayarla
      if (orderData.status === 'DELIVERED' && !orderData.deliveryDate) {
        const today = new Date().toISOString().split('T')[0];
        orderData.deliveryDate = today;
      }

      // Yeni sipariş için customerId alanını ekle
      if (!order && orderData.customer && orderData.customer.id) {
        orderData.customerId = orderData.customer.id;
        delete orderData.customer; // customer nesnesini kaldır, sadece customerId kullan
      }
      
      if (order) {
        // Güncelleme işlemi - gelişmiş endpoint kullan
        console.log('🔄 Sipariş güncelleme işlemi başlatılıyor...');
        console.log('📤 Gönderilen orderData:', orderData);
        
        try {
          response = await apiService.orders.updateAdvanced(order.id, orderData);
          console.log("✅ Sipariş başarıyla güncellendi:", response.data);
          
          onSave(response.data);
          onClose();
        } catch (updateError) {
          console.error("💥 Sipariş güncellenirken hata:", updateError);
          
          let errorMessage = 'Sipariş güncellenirken bir hata oluştu';
          if (updateError.response) {
            if (updateError.response.data) {
              errorMessage += ': ' + (typeof updateError.response.data === 'string' 
                ? updateError.response.data 
                : JSON.stringify(updateError.response.data));
            }
          }
          throw new Error(errorMessage);
        }
      } else {
        // Yeni oluşturma işlemi - yeni endpoint kullan
        console.log('🆕 Yeni sipariş oluşturma işlemi başlatılıyor...');
        console.log('📤 Gönderilen orderData:', orderData);
        
        try {
          response = await apiService.orders.createNew(orderData);
          console.log("✅ Yeni sipariş başarıyla oluşturuldu:", response.data);
          console.log("📥 Backend'ten dönen data:", response.data);
          
          onSave(response.data);
          onClose();
        } catch (createError) {
          console.error("💥 Sipariş oluşturulurken hata:", createError);
          console.error("❌ Error details:", createError.response?.data);
          
          let errorMessage = 'Sipariş oluşturulurken bir hata oluştu';
          if (createError.response) {
            if (createError.response.data) {
              errorMessage += ': ' + (typeof createError.response.data === 'string' 
                ? createError.response.data 
                : JSON.stringify(createError.response.data));
            }
          }
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      alert(error.message || 'Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filtrelenmış müşteriler
  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes((customerInputValue || '').toLowerCase()) || 
           (c.phone && c.phone.includes(customerInputValue));
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxHeight: '90vh'
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
          {/* Müşteri alanı - sadece yeni sipariş için göster */}
          {!customer && !order && (
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <Autocomplete
                id="customer-search"
                options={filteredCustomers}
                loading={searchLoading}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}${option.phone ? ` (${option.phone})` : ''}`}
                value={customers.find(c => c.id === formData.customer) || null}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    customer: newValue?.id || null
                  }));
                }}
                inputValue={customerInputValue}
                onInputChange={(event, newInputValue) => {
                  setCustomerInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Müşteri Ara" 
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1.5, 
                          bgcolor: 'primary.main',
                          fontSize: '0.8rem'
                        }}
                      >
                        {option.firstName?.charAt(0)}{option.lastName?.charAt(0)}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {option.firstName} {option.lastName}
                        </Typography>
                        {option.phone && (
                          <Typography variant="caption" color="text.secondary">
                            {option.phone}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </li>
                )}
                noOptionsText="Müşteri bulunamadı"
                loadingText="Müşteriler yükleniyor..."
                sx={{ width: '100%' }}
              />
            </FormControl>
          )}

          {/* Müşteri bilgisi gösterimi - Düzenleme sırasında */}
          {order && (
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 40, 
                  height: 40
                }}
              >
                {order.customer?.firstName?.charAt(0)}{order.customer?.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {order.customer?.firstName} {order.customer?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.customer?.phone || 'Telefon bilgisi yok'}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Temel sipariş bilgileri */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Ürün Tipi</InputLabel>
                <Select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  label="Ürün Tipi"
                  disabled={order !== null}
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
          </Grid>

          {/* ÜRÜN ÖZELLEŞTİRMELERİ - Dinamik olarak göster */}
          {(() => {
            const customizationOptions = getCustomizationOptions();
            
            if (Object.keys(customizationOptions).length === 0) {
              return null;
            }

            return (
              <>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    color: 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    paddingBottom: 1
                  }}
                >
                  {formData.productType === 'GÖMLEK' ? 'Gömlek' : 
                   formData.productType === 'PANTOLON' ? 'Pantolon' : 
                   formData.productType === 'CEKET' ? 'Ceket' : 
                   formData.productType === 'TAKIM' ? 'Takım Elbise' : 
                   'Diğer'} Özelleştirmeleri
                </Typography>
          <Grid container spacing={2}>
                  {Object.entries(customizationOptions).map(([optionKey, optionValues]) => (
                    <Grid item xs={12} sm={6} md={4} key={optionKey}>
                      <FormControl fullWidth>
                        <InputLabel>
                          {optionKey === 'collarType' ? 'Yaka Türü' :
                           optionKey === 'sleeveType' ? 'Kol Türü' :
                           optionKey === 'waistType' ? 'Bel Türü' :
                           optionKey === 'pleatType' ? 'Pile Türü' :
                           optionKey === 'legType' ? 'Paça Türü' :
                           optionKey === 'buttonType' ? 'Düğme Türü' :
                           optionKey === 'pocketType' ? 'Cep Türü' :
                           optionKey === 'ventType' ? 'Yırtmaç Türü' :
                           optionKey === 'backType' ? 'Sırt Türü' : optionKey}
                        </InputLabel>
                <Select
                          name={optionKey}
                          value={formData[optionKey] || ''}
                  onChange={handleChange}
                          label={optionKey === 'collarType' ? 'Yaka Türü' :
                                 optionKey === 'sleeveType' ? 'Kol Türü' :
                                 optionKey === 'waistType' ? 'Bel Türü' :
                                 optionKey === 'pleatType' ? 'Pile Türü' :
                                 optionKey === 'legType' ? 'Paça Türü' :
                                 optionKey === 'buttonType' ? 'Düğme Türü' :
                                 optionKey === 'pocketType' ? 'Cep Türü' :
                                 optionKey === 'ventType' ? 'Yırtmaç Türü' :
                                 optionKey === 'backType' ? 'Sırt Türü' : optionKey}
                        >
                          <MenuItem value="">
                            <em>Seçiniz</em>
                          </MenuItem>
                          {Object.entries(optionValues).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
                  ))}
                </Grid>
              </>
            );
          })()}

          {/* Durum ve tarih bilgileri */}
          <Grid container spacing={2}>
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

          {/* Teslim tarihi alanı - Düzenleme sırasında göster */}
          {order && (
            <TextField
              name="deliveryDate"
              label="Gerçek Teslim Tarihi"
              type="date"
              value={formData.deliveryDate || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Teslim tarihini sadece ürün teslim edildiyse girin"
            />
          )}

          {canSeePrices && (
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
          )}

          <TextField
            name="notes"
            label="Notlar"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />

          {/* Fotoğraf yükleme bölümü */}
          <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PhotoCamera sx={{ mr: 1 }} />
              Sipariş Fotoğrafları
            </Typography>
            
            {/* Yüklenen fotoğrafları göster */}
            {uploadedImageUrls.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Yüklenen Fotoğraflar:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {uploadedImageUrls.map((imageUrl, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        position: 'relative',
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: 'grey.300'
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Sipariş resmi ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(imageUrl)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'error.main',
                          color: 'white',
                          width: 24,
                          height: 24,
                          '&:hover': {
                            bgcolor: 'error.dark'
                          }
                        }}
                        size="small"
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Fotoğraf seçimi ve önizleme */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setMeasurementOpen(true)}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'primary.50'
                    }
                  }}
                >
                  Ölçüler
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  color="primary"
                  size="small"
                  component="label"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'primary.50'
                    }
                  }}
                >
                  Fotoğraf Yükle
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={localHandleFileUpload}
                  />
                </StyledButton>
              </Box>

              {/* Önizleme ve S3 Yükleme */}
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Önizleme:
                  </Typography>
                  <img
                    src={imagePreview}
                    alt="Önizleme"
                    style={{
                      maxWidth: 200,
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #ddd'
                    }}
                  />
                  
                  {/* S3'e Yükle Butonu */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <StyledButton
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={handleImageUpload}
                      disabled={imageUploading || !imageFile}
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'success.dark'
                        },
                        '&:disabled': {
                          bgcolor: 'grey.300'
                        }
                      }}
                    >
                      {imageUploading ? 'Yükleniyor...' : 'Yükle'}
                    </StyledButton>
                    
                    <StyledButton
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      sx={{
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          backgroundColor: 'error.50'
                        }
                      }}
                    >
                      İptal
                    </StyledButton>
                  </Box>
                </Box>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              * Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG, GIF
            </Typography>
          </Box>
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
          disabled={loading || (!order && !formData.customer) || !formData.productType || !formData.status || !formData.estimatedDeliveryDate || (canSeePrices && !formData.totalPrice)}
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

const Row = ({ customer, onDelete, onEdit, onSnackbar, onFileUpload, canSeePrices = true, canEditAll = true, measurementCounts = {}, onMeasurementOpen, isReadOnly = false, canDeleteCustomers = true }) => {
  const [open, setOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  // Ölçü modalını aç
  const handleMeasurementOpen = (customer) => {
    if (onMeasurementOpen) {
      onMeasurementOpen(customer);
    } else {
      setMeasurementOpen(true);
      fetchMeasurements();
    }
  };
  const [orderSortBy, setOrderSortBy] = useState('orderDate');
  const [orderSortOrder, setOrderSortOrder] = useState('desc');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOrderSave = (savedOrder) => {
    // Sipariş kaydedildikten sonra yapılacak işlemler
    setOrderDialogOpen(false);
    if (onSnackbar) {
      onSnackbar({
        open: true,
        message: 'Sipariş başarıyla kaydedildi',
        severity: 'success'
      });
    }
    // Orders listesini yenile
    fetchOrders();
  };

  // Dosya yükleme işlemi
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('🚀 Dosya seçildi:', file.name, file.type, file.size);

    const formData = new FormData();
    formData.append('file', file);
    
    console.log('📤 API isteği gönderiliyor... Customer ID:', customer.id);

    try {
      console.log('🔄 OCR işlemi başlıyor...');
      
      // AWS Textract ile ölçü verilerini işle
      const response = await apiService.measurements.uploadFile(customer.id, formData);
      
      console.log('✅ API response alındı:', response);
      console.log('📊 Response data:', response.data);
      console.log('🎯 Success flag:', response.data?.success);
      console.log('📏 Measurements count:', response.data?.count);
      if (response.data && response.data.success) {
        if (onSnackbar) {
          onSnackbar({
            open: true,
            message: `${response.data.count || 0} ölçü başarıyla kaydedildi! (AWS Textract)`,
            severity: 'success'
          });
        }
        // Ölçüleri yenile
        fetchMeasurements();
        // Siparişleri yenile (güncel veriler için)
        fetchOrders();
      } else {
        if (onSnackbar) {
          onSnackbar({
            open: true,
            message: response.data?.error || 'Ölçüler yüklenirken hata oluştu.',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('AWS Textract yükleme hatası:', error);
      let errorMessage = 'Fotoğraf yüklenirken hata oluştu.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (onSnackbar) {
        onSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open, customer.id]);

  // Ölçüleri getir
  const fetchMeasurements = async () => {
    try {
      const response = await apiService.measurements.getByCustomer(customer.id);
      if (response.data && response.data.success) {
        setMeasurements(response.data.measurements || []);
      } else {
        setMeasurements([]);
      }
    } catch (error) {
      console.error('Ölçüler yüklenirken hata oluştu:', error);
      setMeasurements([]);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.orders.getByCustomer(customer.id);
      
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      console.log("Müşteri siparişleri:", data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata oluştu:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };







  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const handleOrderSort = (field) => {
    const newOrder = orderSortBy === field && orderSortOrder === 'asc' ? 'desc' : 'asc';
    setOrderSortBy(field);
    setOrderSortOrder(newOrder);
  };

  // Sıralanmış siparişler
  const sortedOrders = [...orders].sort((a, b) => {
    let aValue, bValue;
    
    switch (orderSortBy) {
      case 'orderDate':
        aValue = new Date(a.orderDate || a.createdAt);
        bValue = new Date(b.orderDate || b.createdAt);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'totalPrice':
        aValue = a.totalPrice || 0;
        bValue = b.totalPrice || 0;
        break;
      case 'estimatedDeliveryDate':
        aValue = new Date(a.estimatedDeliveryDate || '9999-12-31');
        bValue = new Date(b.estimatedDeliveryDate || '9999-12-31');
        break;
      default:
        aValue = new Date(a.orderDate || a.createdAt);
        bValue = new Date(b.orderDate || b.createdAt);
    }
    
    if (orderSortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
          {!isReadOnly && (
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
          )}
          {canDeleteCustomers && (
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
          )}
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleMeasurementOpen(customer)}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.50'
                      }
                    }}
                  >
                    📏 Ölçüler ({measurementCounts[customer.id] || 0})
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="primary"
                    size="small"
                    component="label"
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.50'
                      }
                    }}
                  >
                    Fotoğraf Yükle
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </StyledButton>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Siparişler Listesi */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 3 }}>
                  Siparişler
                </Typography>
                {orders.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleOrderSort('orderDate')}
                      sx={{ 
                        minWidth: 'auto',
                        color: orderSortBy === 'orderDate' ? 'primary.main' : 'text.secondary',
                        fontWeight: orderSortBy === 'orderDate' ? 'bold' : 'normal'
                      }}
                    >
                      Tarih {orderSortBy === 'orderDate' && (orderSortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleOrderSort('status')}
                      sx={{ 
                        minWidth: 'auto',
                        color: orderSortBy === 'status' ? 'primary.main' : 'text.secondary',
                        fontWeight: orderSortBy === 'status' ? 'bold' : 'normal'
                      }}
                    >
                      Durum {orderSortBy === 'status' && (orderSortOrder === 'asc' ? '↑' : '↓')}
                    </Button>
                    {canSeePrices && (
                      <Button
                        size="small"
                        onClick={() => handleOrderSort('totalPrice')}
                        sx={{ 
                          minWidth: 'auto',
                          color: orderSortBy === 'totalPrice' ? 'primary.main' : 'text.secondary',
                          fontWeight: orderSortBy === 'totalPrice' ? 'bold' : 'normal'
                        }}
                      >
                        Tutar {orderSortBy === 'totalPrice' && (orderSortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
              
              {orders.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    {sortedOrders.map((order) => (
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
                          {canSeePrices && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">
                                Tutar:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {order.totalPrice ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalPrice) : '-'}
                              </Typography>
                            </Box>
                          )}
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

              {/* Ölçü Modal */}
              <MeasurementModal
                open={measurementOpen}
                onClose={() => setMeasurementOpen(false)}
                customer={customer}
                measurements={measurements}
                onMeasurementsUpdate={() => fetchMeasurements(customer?.id)}
              />

              {/* Sipariş Modal */}
              <OrderDialog
                open={orderDialogOpen}
                onClose={() => setOrderDialogOpen(false)}
                customer={customer}
                order={selectedOrder}
                onSave={handleOrderSave}
                handleFileUpload={handleFileUpload}
                canSeePrices={canSeePrices}
                canEditAll={canEditAll}
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
    email: '',
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

      const response = await apiService.customers.create(customerData);
      onAdd(response.data);
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
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

          {/* Email */}
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={inputStyle}
            helperText="Sipariş durum güncellemeleri için gerekli"
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
  useDocumentTitle('Müşteri Yönetimi');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { 
    user, 
    isKesimhane, 
    isDikimhane, 
    isAdmin,
    canManageCustomers,
    canDeleteCustomers,
    canViewOrderPrices
  } = useAuth();

  // Rol tabanlı yetki kontrolleri - AuthContext'ten alınan değerler
  const canEditAll = canManageCustomers; // ADMIN, USTA, ÖLÇÜM
  const isReadOnly = isDikimhane || isKesimhane; // Dikimhane/Kesimhane sadece görüntüleme
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const customersPerPage = 10;
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [measurementCounts, setMeasurementCounts] = useState({});

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.customers.getAll();
      const data = Array.isArray(response.data) ? response.data : (Array.isArray(response.data.customers) ? response.data.customers : []);
      setCustomers(data);
      setTotalPages(Math.ceil(data.length / customersPerPage));
      
      // Her müşteri için ölçü sayısını getir
      const counts = {};
      for (const customer of data) {
        try {
          const measurementResponse = await apiService.measurements.getByCustomer(customer.id);
          counts[customer.id] = measurementResponse.data?.count || 0;
        } catch (error) {
          console.warn(`Müşteri ${customer.id} için ölçü sayısı alınamadı:`, error);
          counts[customer.id] = 0;
        }
      }
      setMeasurementCounts(counts);
      
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

  // Müşteri ölçülerini getir
  const fetchMeasurements = async (customerId) => {
    try {
      const response = await apiService.measurements.getByCustomer(customerId);
      if (response.data && response.data.success) {
        setMeasurements(response.data.measurements || []);
        // Ölçü sayısını güncelle
        setMeasurementCounts(prev => ({
          ...prev,
          [customerId]: response.data.count || 0
        }));
      }
    } catch (error) {
      console.error('Ölçüler yüklenirken hata oluştu:', error);
      setMeasurements([]);
    }
  };

  // Ölçü modalını aç
  const handleMeasurementOpen = (customer) => {
    setCustomer(customer);
    setMeasurementOpen(true);
    fetchMeasurements(customer.id);
  };

  const handleDelete = async (customerId) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await apiService.customers.delete(customerToDelete);
      
      if (response.status === 204) {
        setCustomers(customers.filter(c => c.id !== customerToDelete));
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
      setCustomerToDelete(null);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Sıralama fonksiyonu
  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
  };

  // Sıralanmış müşteriler
  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'firstName':
        aValue = a.firstName?.toLowerCase() || '';
        bValue = b.firstName?.toLowerCase() || '';
        break;
      case 'lastName':
        aValue = a.lastName?.toLowerCase() || '';
        bValue = b.lastName?.toLowerCase() || '';
        break;
      case 'phone':
        aValue = a.phone || '';
        bValue = b.phone || '';
        break;
      case 'height':
        aValue = a.height || 0;
        bValue = b.height || 0;
        break;
      case 'weight':
        aValue = a.weight || 0;
        bValue = b.weight || 0;
        break;
      default:
        aValue = a.firstName?.toLowerCase() || '';
        bValue = b.firstName?.toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Filtrelenmiş müşteriler (sıralı)
  const filteredCustomers = sortedCustomers.filter(customer =>
    customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Genel dosya yükleme (S3'e sadece upload)
      const response = await apiService.measurements.uploadFileGeneral(formData);
      if (response.data && response.data.url) {
        setSnackbar({
          open: true,
          message: 'Dosya başarıyla yüklendi!',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Dosya yüklenirken hata oluştu.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      setSnackbar({
        open: true,
        message: 'Dosya yüklenirken hata oluştu.',
        severity: 'error'
      });
    }
  };

  const handleSnackbar = (snackbarData) => {
    setSnackbar(snackbarData);
  };

  const handleOrderSave = async (savedOrder) => {
    try {
      // Siparişler listesini yenile
      await fetchCustomers(); // Müşteri listesini yenile ki güncel sipariş bilgileri gelsin
      setOrderDialogOpen(false);
      setSelectedOrder(null);
      setCustomer(null);
      setSnackbar({
        open: true,
        message: selectedOrder ? 'Sipariş başarıyla güncellendi' : 'Sipariş başarıyla oluşturuldu',
        severity: 'success'
      });
    } catch (error) {
      console.error('Sipariş işleminde hata oluştu:', error);
      setSnackbar({
        open: true,
        message: 'Sipariş işleminde bir hata oluştu',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Card */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <CardContent sx={{ py: { xs: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 0 }
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                fontWeight: 700, 
                mb: 1, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <Groups sx={{ mr: 2, fontSize: { xs: '2rem', md: '2.5rem' } }} />
                Müşteri Yönetimi
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
                Müşteri bilgilerini görüntüleyin, düzenleyin ve yeni siparişler oluşturun
              </Typography>
            </Box>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <Groups sx={{ fontSize: '2.5rem' }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Stats and Actions Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 0 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Badge badgeContent={customers.length} color="primary" max={999}>
              <Chip 
                icon={<Groups />} 
                label="Toplam Müşteri" 
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
                label={`${filteredCustomers.length} sonuç`}
                color="secondary" 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', md: 'auto' }
          }}>
            <StyledTextField
              variant="outlined"
              placeholder="Ad, soyad veya telefon ile ara..."
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
              sx={{ 
                minWidth: { xs: '100%', sm: '240px', md: '280px' },
                maxWidth: { xs: '100%', md: '280px' }
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'row', sm: 'row' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <StyledButton
                variant="outlined"
                startIcon={isMobile ? null : <Refresh />}
                onClick={fetchCustomers}
                disabled={loading}
                sx={{ 
                  flex: { xs: 1, sm: 'none' },
                  minWidth: { xs: 'auto', sm: '120px' }
                }}
              >
                {isMobile ? <Refresh /> : 'Yenile'}
              </StyledButton>
              
              {!isReadOnly && (
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={isMobile ? null : <Add />}
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ 
                    flex: { xs: 1, sm: 'none' },
                    minWidth: { xs: 'auto', sm: '140px' }
                  }}
                >
                  {isMobile ? <Add /> : 'Yeni Müşteri'}
                </StyledButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Desktop Table View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)', mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ width: '50px' }} />
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('firstName')}>
                      Müşteri
                      <IconButton size="small" sx={{ color: 'white', ml: 1 }}>
                        {sortBy === 'firstName' && sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('phone')}>
                      Telefon
                      <IconButton size="small" sx={{ color: 'white', ml: 1 }}>
                        {sortBy === 'phone' && sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Adres</StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('height')}>
                      Boy / Kilo
                      <IconButton size="small" sx={{ color: 'white', ml: 1 }}>
                        {sortBy === 'height' && sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </Box>
                  </StyledTableCell>
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
                  onSnackbar={setSnackbar}
                  onFileUpload={handleFileUpload}
                  canSeePrices={canViewOrderPrices}
                  canEditAll={canEditAll}
                  isReadOnly={isReadOnly}
                  canDeleteCustomers={canDeleteCustomers}
                  measurementCounts={measurementCounts}
                  onMeasurementOpen={handleMeasurementOpen}
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
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ mb: 4 }}>
          {paginatedCustomers.length > 0 ? (
            <Stack spacing={2}>
              {paginatedCustomers.map((customer) => (
                <Card key={customer.id} sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CustomerAvatar>
                          {customer.firstName ? customer.firstName.charAt(0).toUpperCase() : '?'}
                        </CustomerAvatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {customer.firstName} {customer.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {customer.phone}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleMeasurementOpen(customer)}
                          sx={{ 
                            backgroundColor: 'info.main',
                            color: 'white',
                            '&:hover': { backgroundColor: 'info.dark' },
                            position: 'relative'
                          }}
                        >
                          <PhotoCamera />
                          {measurementCounts[customer.id] > 0 && (
                            <Badge
                              badgeContent={measurementCounts[customer.id]}
                              color="success"
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                '& .MuiBadge-badge': {
                                  fontSize: '0.6rem',
                                  minWidth: '16px',
                                  height: '16px'
                                }
                              }}
                            />
                          )}
                        </IconButton>
                        {!isReadOnly && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(customer)}
                            sx={{ 
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'primary.dark' }
                            }}
                          >
                            <Edit />
                          </IconButton>
                        )}
                        {canDeleteCustomers && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(customer.id)}
                            sx={{ 
                              backgroundColor: 'error.main',
                              color: 'white',
                              '&:hover': { backgroundColor: 'error.dark' }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Adres:</strong> {customer.address || 'Belirtilmemiş'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Boy:</strong> {customer.height ? `${customer.height} cm` : 'Belirtilmemiş'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Kilo:</strong> {customer.weight ? `${customer.weight} kg` : 'Belirtilmemiş'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Ölçüler:</strong>
                          </Typography>
                          <Chip
                            size="small"
                            label={`${measurementCounts[customer.id] || 0} ölçü`}
                            color={measurementCounts[customer.id] > 0 ? 'success' : 'default'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
              <CardContent>
                <Groups sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {loading ? 'Müşteriler yükleniyor...' : 'Müşteri bulunamadı'}
                </Typography>
                {!loading && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Yeni müşteri eklemek için yukarıdaki butonu kullanabilirsiniz.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

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
        customer={customer}
        order={selectedOrder}
        onSave={handleOrderSave}
        handleFileUpload={handleFileUpload}
        canSeePrices={canViewOrderPrices}
        canEditAll={canEditAll}
      />

      <MeasurementModal
        open={measurementOpen}
        onClose={() => setMeasurementOpen(false)}
        customer={customer}
        measurements={measurements}
        onMeasurementsUpdate={() => fetchMeasurements(customer?.id)}
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

// Ölçü Modal Bileşeni
const MeasurementModal = ({ open, onClose, customer, measurements, onMeasurementsUpdate }) => {
  const [newMeasurement, setNewMeasurement] = useState({
    regionName: '',
    value: '',
    unit: 'cm'
  });
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrPreview, setOcrPreview] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState([]);
  const [showOcrResults, setShowOcrResults] = useState(false);

  // Modal açıldığında ölçüleri yükle
  useEffect(() => {
    if (open && customer && onMeasurementsUpdate) {
      onMeasurementsUpdate();
    }
  }, [open, customer, onMeasurementsUpdate]);

  // Yeni ölçü ekleme
  const handleAddMeasurement = async () => {
    if (!newMeasurement.regionName.trim() || !newMeasurement.value) {
      alert('Lütfen bölge adı ve değer girin');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.measurements.add(customer.id, {
        regionName: newMeasurement.regionName.trim(),
        value: parseFloat(newMeasurement.value),
        unit: newMeasurement.unit
      });

      if (response.data && response.data.success) {
        setNewMeasurement({ regionName: '', value: '', unit: 'cm' });
        onMeasurementsUpdate(); // Listeyi yenile
        alert('Ölçü başarıyla eklendi!');
      } else {
        alert(response.data?.error || 'Ölçü eklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Ölçü ekleme hatası:', error);
      alert(error.response?.data?.error || 'Ölçü eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ölçü düzenleme
  const handleEditMeasurement = async (measurementId) => {
    if (!editingMeasurement.regionName.trim() || !editingMeasurement.value) {
      alert('Lütfen bölge adı ve değer girin');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.measurements.update(measurementId, {
        regionName: editingMeasurement.regionName.trim(),
        value: parseFloat(editingMeasurement.value),
        unit: editingMeasurement.unit
      });

      if (response.data && response.data.success) {
        setEditingMeasurement(null);
        onMeasurementsUpdate(); // Listeyi yenile
        alert('Ölçü başarıyla güncellendi!');
      } else {
        alert(response.data?.error || 'Ölçü güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Ölçü güncelleme hatası:', error);
      alert(error.response?.data?.error || 'Ölçü güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ölçü silme
  const handleDeleteMeasurement = async (measurementId, regionName) => {
    if (!window.confirm(`"${regionName}" ölçüsünü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.measurements.delete(measurementId);

      if (response.data && response.data.success) {
        onMeasurementsUpdate(); // Listeyi yenile
        alert('Ölçü başarıyla silindi!');
      } else {
        alert(response.data?.error || 'Ölçü silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Ölçü silme hatası:', error);
      alert(error.response?.data?.error || 'Ölçü silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // OCR dosya seçimi
  const handleOcrFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Dosya türü kontrolü
    if (!file.type.match('image.*')) {
      alert('Lütfen bir resim dosyası seçin');
      return;
    }

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10485760) {
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setOcrFile(file);
    setOcrResults([]);
    setShowOcrResults(false);

    // Önizleme için FileReader kullan
    const reader = new FileReader();
    reader.onloadend = () => {
      setOcrPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // OCR analizi başlat
  const handleOcrAnalyze = async () => {
    if (!ocrFile) {
      alert('Lütfen önce bir resim seçin');
      return;
    }

    const formData = new FormData();
    formData.append('file', ocrFile);

    try {
      setOcrLoading(true);
      console.log('🔍 OCR analizi başlatılıyor...');
      
      const response = await apiService.measurements.uploadFile(customer.id, formData);
      
      if (response.data && response.data.success) {
        setOcrResults(response.data.measurements || []);
        setShowOcrResults(true);
        console.log('✅ OCR başarılı:', response.data.measurements);
        
        // Ölçüleri otomatik yenile
        if (onMeasurementsUpdate) {
          onMeasurementsUpdate();
        }
        
        alert(`🎉 ${response.data.count || 0} ölçü başarıyla kaydedildi!`);
      } else {
        alert(response.data?.error || 'Ölçüler çıkarılırken hata oluştu.');
      }
    } catch (error) {
      console.error('❌ OCR hatası:', error);
      let errorMessage = 'Fitdays fotoğrafı analiz edilirken hata oluştu.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setOcrLoading(false);
    }
  };

  // OCR temizle
  const handleOcrClear = () => {
    setOcrFile(null);
    setOcrPreview(null);
    setOcrResults([]);
    setShowOcrResults(false);
  };

  // Ölçü verilerini TXT olarak indir
  const handleDownloadTxt = async () => {
    if (!customer || !measurements || measurements.length === 0) {
      alert('İndirilecek ölçü verisi bulunamadı');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.measurements.exportTxt(customer.id);
      
      // Blob'u dosya olarak indir
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${customer.firstName}_${customer.lastName}_olculer.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('📄 Ölçü verileri başarıyla indirildi!');
    } catch (error) {
      console.error('Ölçü indirme hatası:', error);
      alert('Dosya indirilirken hata oluştu: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          📏 Ölçüler: {customer?.firstName} {customer?.lastName}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {/* Fitdays OCR Upload */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'primary.50', borderRadius: 2, border: '2px dashed', borderColor: 'primary.200' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CameraAlt /> 📱 Fitdays OCR - Ölçü Fotoğrafı Yükle
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="ocr-file-input"
                type="file"
                onChange={handleOcrFileSelect}
              />
              <label htmlFor="ocr-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Fitdays Fotoğrafı Seç
                </Button>
              </label>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                onClick={handleOcrAnalyze}
                disabled={!ocrFile || ocrLoading}
                startIcon={ocrLoading ? <CircularProgress size={20} /> : <Preview />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {ocrLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Button
                variant="text"
                onClick={handleOcrClear}
                disabled={!ocrFile && !ocrPreview}
                startIcon={<DeleteOutline />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Temizle
              </Button>
            </Grid>
          </Grid>

          {/* OCR Önizleme */}
          {ocrPreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📷 Seçilen Fotoğraf:
              </Typography>
              <Box
                component="img"
                src={ocrPreview}
                alt="OCR Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {ocrFile?.name} ({(ocrFile?.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            </Box>
          )}

          {/* OCR Sonuçları */}
          {showOcrResults && ocrResults.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle fontSize="small" /> Çıkarılan Ölçüler ({ocrResults.length})
              </Typography>
              <Grid container spacing={1}>
                {ocrResults.map((result, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'success.300' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {result.regionName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {result.value} {result.unit}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        {/* Yeni Ölçü Ekleme */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
            ➕ Manuel Ölçü Ekle
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Bölge Adı"
                value={newMeasurement.regionName}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, regionName: e.target.value }))}
                fullWidth
                size="small"
                placeholder="örn: Göğüs, Bel, Sol Kol..."
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Değer"
                type="number"
                value={newMeasurement.value}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, value: e.target.value }))}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                select
                label="Birim"
                value={newMeasurement.unit}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, unit: e.target.value }))}
                fullWidth
                size="small"
              >
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="mm">mm</MenuItem>
                <MenuItem value="m">m</MenuItem>
                <MenuItem value="inch">inch</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                onClick={handleAddMeasurement}
                disabled={loading}
                fullWidth
                sx={{ py: 1 }}
              >
                Ekle
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Mevcut Ölçüler */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
          📋 Mevcut Ölçüler ({measurements?.length || 0})
        </Typography>

        {measurements?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Henüz ölçü eklenmemiş. Yukarıdaki formu kullanarak ölçü ekleyebilirsiniz.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {measurements?.map((measurement) => (
              <Box
                key={measurement.id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                {editingMeasurement?.id === measurement.id ? (
                  // Düzenleme modu
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Bölge Adı"
                        value={editingMeasurement.regionName}
                        onChange={(e) => setEditingMeasurement(prev => ({ ...prev, regionName: e.target.value }))}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Değer"
                        type="number"
                        value={editingMeasurement.value}
                        onChange={(e) => setEditingMeasurement(prev => ({ ...prev, value: e.target.value }))}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        select
                        label="Birim"
                        value={editingMeasurement.unit}
                        onChange={(e) => setEditingMeasurement(prev => ({ ...prev, unit: e.target.value }))}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="cm">cm</MenuItem>
                        <MenuItem value="mm">mm</MenuItem>
                        <MenuItem value="m">m</MenuItem>
                        <MenuItem value="inch">inch</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleEditMeasurement(measurement.id)}
                          disabled={loading}
                        >
                          Kaydet
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setEditingMeasurement(null)}
                          disabled={loading}
                        >
                          İptal
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  // Görüntüleme modu
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {measurement.regionName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {measurement.value} {measurement.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => setEditingMeasurement({
                          id: measurement.id,
                          regionName: measurement.regionName,
                          value: measurement.value,
                          unit: measurement.unit
                        })}
                        disabled={loading}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteMeasurement(measurement.id, measurement.regionName)}
                        disabled={loading}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<CloudDownload />}
          onClick={handleDownloadTxt}
          disabled={loading || !measurements || measurements.length === 0}
          sx={{ color: 'success.main', borderColor: 'success.main' }}
        >
          TXT İndir ({measurements?.length || 0} ölçü)
        </Button>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Customers; 