import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  IconButton,
  useTheme,
  useMediaQuery,
  Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import apiService from '../services/apiService';
import aiModelService from '../services/aiModelService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light + '10',
    borderColor: theme.palette.primary.dark
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  }
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '300px',
  borderRadius: '8px',
  objectFit: 'cover'
});

const ModelCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[8],
    '& .model-overlay': {
      opacity: 1
    }
  }
}));

const ModelOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  borderRadius: theme.spacing(1),
  color: 'white'
}));

const ImageDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '90vw',
    maxHeight: '90vh',
    margin: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1),
      maxWidth: '95vw',
      maxHeight: '95vh'
    }
  }
}));

const AIModel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [fabricImage, setFabricImage] = useState(null);
  const [fabricImagePreview, setFabricImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedModel, setGeneratedModel] = useState(null);
  const [generatedCombination, setGeneratedCombination] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [modelAge, setModelAge] = useState(30);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  
  // Popup states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  // Müşterileri yükle
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log('Müşteriler yükleniyor...');
        const response = await apiService.customers.getAll();
        console.log('Müşteri API yanıtı:', response);
        
        if (response && response.data) {
          setCustomers(response.data);
          console.log('Yüklenen müşteri sayısı:', response.data.length);
        } else {
          console.warn('API yanıtında data bulunamadı:', response);
          setError('Müşteri verileri alınamadı');
        }
      } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        
        if (error.code === 'ERR_NETWORK') {
          setError('Backend sunucusuna bağlanılamıyor. Lütfen sunucunun çalıştığından emin olun.');
        } else if (error.response?.status === 401) {
          setError('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
        } else if (error.response?.status === 403) {
          setError('Bu işlem için yetkiniz bulunmuyor.');
        } else {
          setError(`Müşteriler yüklenemedi: ${error.message || 'Bilinmeyen hata'}`);
        }
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  // Seçilen müşterinin siparişlerini yükle
  useEffect(() => {
    if (selectedCustomer) {
      const fetchOrders = async () => {
        try {
          console.log('Müşteri siparişleri yükleniyor:', selectedCustomer);
          const response = await apiService.orders.filterByCustomer(selectedCustomer);
          console.log('Sipariş API yanıtı:', response);
          
          if (response && response.data) {
            setOrders(response.data);
            setSelectedOrder('');
            setOrderDetails(null);
            console.log('Yüklenen sipariş sayısı:', response.data.length);
          } else {
            console.warn('Sipariş API yanıtında data bulunamadı:', response);
            setOrders([]);
          }
        } catch (error) {
          console.error('Siparişler yüklenirken hata:', error);
          setError(`Siparişler yüklenemedi: ${error.message || 'Bilinmeyen hata'}`);
          setOrders([]);
        }
      };
      fetchOrders();

      // Müşteri detaylarını al
      const customer = customers.find(c => c.id === selectedCustomer);
      setCustomerDetails(customer);
    }
  }, [selectedCustomer, customers]);

  // Seçilen siparişin detaylarını yükle
  useEffect(() => {
    if (selectedOrder) {
      const order = orders.find(o => o.id === selectedOrder);
      setOrderDetails(order);
    }
  }, [selectedOrder, orders]);

  const handleFabricImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFabricImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFabricImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
        setError('');
      } else {
        setError('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG)');
      }
    }
  };

  const generateAIModel = async () => {
    if (!selectedCustomer || !selectedOrder || !fabricImage) {
      setError('Lütfen müşteri, sipariş ve kumaş fotoğrafı seçin');
      return;
    }

    // API servisi hazır mı kontrol et
    if (!aiModelService.hasApiKey()) {
      setError('AI servisi yapılandırılmamış. Lütfen sistem yöneticisine başvurun.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clothing prompt oluştur
      const clothingPrompt = aiModelService.generateClothingPrompt(customerDetails, orderDetails);
      
      // Demografik bilgileri çıkar (yaş girişi ile)
      const demographics = aiModelService.extractDemographics(customerDetails, modelAge);
      
      // Vücut tipi açıklaması oluştur
      const bodyTypeDescription = aiModelService.generateBodyTypeDescription(customerDetails);
      
      console.log('AI Model generation started:', {
        customer: customerDetails ? `${customerDetails.firstName} ${customerDetails.lastName}` : '',
        order: orderDetails?.productType,
        prompt: clothingPrompt,
        demographics,
        bodyType: bodyTypeDescription
      });

      // Ana ürün için AI Model oluştur
      const aiResult = await aiModelService.generateModel({
        fabricImage: fabricImage,
        clothingPrompt: clothingPrompt,
        gender: demographics.gender,
        country: demographics.country,
        age: demographics.age,
        additionalInfo: bodyTypeDescription,
        customerDetails: customerDetails,
        orderDetails: orderDetails
      });

      console.log('AI API Response:', aiResult);

      // Başarılı sonucu işle
      const aiImageUrl = aiResult.aiResult?.imageUrl || aiResult.aiResult?.image_url || aiResult.imageUrl || aiResult.image_url || aiResult.result_url;
      
      console.log('🖼️ AI Image URL:', aiImageUrl);
      console.log('🔍 Full AI Result:', aiResult);
      
      const generatedModelData = {
        id: Date.now(),
        imageUrl: aiImageUrl || fabricImagePreview,
        customer: customerDetails ? `${customerDetails.firstName} ${customerDetails.lastName}` : '',
        order: orderDetails?.productType,
        prompt: clothingPrompt,
        demographics: demographics,
        apiResponse: aiResult,
        createdAt: new Date().toISOString()
      };

      setGeneratedModel(generatedModelData);

      // Gömlek veya pantolon siparişi ise kombin önerisi de oluştur
      const productType = orderDetails?.productType?.toLowerCase();
      const isShirtOrPants = productType === 'gömlek' || productType === 'GÖMLEK' || 
                            productType === 'pantolon' || productType === 'PANTOLON';

      if (isShirtOrPants) {
        console.log('🎨 Kombin önerisi de oluşturuluyor...');
        
        // Kumaş fotoğrafından renk çıkar
        const fabricColor = extractColorFromFabricImage(fabricImage);
        
        let topItem, bottomItem, topColor, bottomColor;

        if (productType === 'gömlek' || productType === 'GÖMLEK') {
          // Gömlek siparişi - kumaş rengi gömlek için, uyumlu pantolon rengi
          topItem = 'gömlek';
          bottomItem = 'pantolon';
          topColor = fabricColor;
          bottomColor = getComplementaryColor(fabricColor, 'pantolon');
        } else {
          // Pantolon siparişi - kumaş rengi pantolon için, uyumlu gömlek rengi
          topItem = 'gömlek';
          bottomItem = 'pantolon';
          topColor = getComplementaryColor(fabricColor, 'gömlek');
          bottomColor = fabricColor;
        }

        console.log('🎨 Kombin parametreleri:', { 
          productType, 
          fabricColor,
          topItem, 
          topColor, 
          bottomItem, 
          bottomColor 
        });

        // Kombin için prompt oluştur - hangi parçanın kumaş fotoğrafından olacağını belirt
        let combinationPrompt;
        if (productType === 'gömlek' || productType === 'GÖMLEK') {
          // Gömlek siparişi: kumaş fotoğrafı gömlek için
          combinationPrompt = `A complete professional outfit: man wearing a ${topColor} dress shirt made from the uploaded fabric pattern, paired with ${bottomColor} ${bottomItem}, full body shot, professional styling, well-coordinated business attire, clean background, fashion photography style`;
        } else {
          // Pantolon siparişi: kumaş fotoğrafı pantolon için  
          combinationPrompt = `A complete professional outfit: man wearing a ${topColor} ${topItem} paired with ${bottomColor} trousers made from the uploaded fabric pattern, full body shot, professional styling, well-coordinated business attire, clean background, fashion photography style`;
        }

        // Kombin için AI Model oluştur (kumaş fotoğrafını da gönder)
        const combinationResult = await aiModelService.generateModel({
          fabricImage: fabricImage, // Kombin için de kumaş fotoğrafını gönder
          clothingPrompt: combinationPrompt,
          gender: demographics.gender,
          country: demographics.country,
          age: demographics.age,
          additionalInfo: bodyTypeDescription,
          customerDetails: customerDetails,
          orderDetails: orderDetails
        });

        console.log('🎨 Kombin API Response:', combinationResult);

        // Kombin sonucunu işle
        const combinationImageUrl = combinationResult.aiResult?.imageUrl || combinationResult.aiResult?.image_url || combinationResult.imageUrl || combinationResult.image_url || combinationResult.result_url;
        
        const combinationData = {
          id: Date.now() + 1,
          imageUrl: combinationImageUrl || '/placeholder-combination.jpg',
          customer: customerDetails ? `${customerDetails.firstName} ${customerDetails.lastName}` : '',
          combination: {
            topItem,
            topColor,
            bottomItem,
            bottomColor
          },
          apiResponse: combinationResult,
          createdAt: new Date().toISOString()
        };

        setGeneratedCombination(combinationData);
        setSuccess(`AI Manken ve kombin önerisi başarıyla oluşturuldu! ${fabricColor} ${productType} için hem tekil model hem de uyumlu kombinasyon hazırlandı.`);
      } else {
        setSuccess('AI Manken başarıyla oluşturuldu!');
      }

      // Opsiyonel: Backend'e kaydet
      try {
        await apiService.aiModel.generate({
          customerId: selectedCustomer,
          orderId: selectedOrder,
          imageUrl: generatedModelData.imageUrl,
          prompt: clothingPrompt,
          demographics: JSON.stringify(demographics),
          apiResponse: JSON.stringify(aiResult)
        });
        console.log('AI Model saved to backend');
      } catch (backendError) {
        console.warn('Backend save failed, but AI generation succeeded:', backendError);
      }

    } catch (error) {
      console.error('AI Model oluşturulurken hata:', error);
      
      let errorMessage = 'AI Model oluşturulamadı. ';
      
      if (error.message.includes('API Error')) {
        errorMessage += 'AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
      } else if (error.message.includes('network')) {
        errorMessage += 'İnternet bağlantınızı kontrol edin.';
      } else {
        errorMessage += 'Lütfen tekrar deneyin veya sistem yöneticisine başvurun.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Kumaş fotoğrafından renk tahmini yapan fonksiyon
  const extractColorFromFabricImage = (fabricImageFile) => {
    // Basit renk tahmini - gerçek projede image processing kullanılabilir
    if (!fabricImageFile || !fabricImageFile.name) return 'klasik';
    
    const fileName = fabricImageFile.name.toLowerCase();
    
    // Dosya adından renk tahmini
    if (fileName.includes('bordo') || fileName.includes('burgundy') || fileName.includes('maroon')) return 'bordo';
    if (fileName.includes('beyaz') || fileName.includes('white')) return 'beyaz';
    if (fileName.includes('siyah') || fileName.includes('black')) return 'siyah';
    if (fileName.includes('mavi') || fileName.includes('blue')) return 'mavi';
    if (fileName.includes('gri') || fileName.includes('gray') || fileName.includes('grey')) return 'gri';
    if (fileName.includes('lacivert') || fileName.includes('navy')) return 'lacivert';
    if (fileName.includes('kahverengi') || fileName.includes('brown')) return 'kahverengi';
    if (fileName.includes('yeşil') || fileName.includes('green')) return 'yeşil';
    if (fileName.includes('sarı') || fileName.includes('yellow')) return 'sarı';
    if (fileName.includes('pembe') || fileName.includes('pink')) return 'pembe';
    if (fileName.includes('mor') || fileName.includes('purple')) return 'mor';
    if (fileName.includes('turuncu') || fileName.includes('orange')) return 'turuncu';
    
    // Varsayılan renk
    return 'klasik';
  };

  // Kombin için uyumlu renk önerisi
  const getComplementaryColor = (baseColor, itemType) => {
    const colorCombinations = {
      // Gömlek renkleri için pantolon önerileri
      'bordo': itemType === 'pantolon' ? 'lacivert' : 'gri',
      'beyaz': itemType === 'pantolon' ? 'lacivert' : 'siyah', 
      'mavi': itemType === 'pantolon' ? 'gri' : 'lacivert',
      'siyah': itemType === 'pantolon' ? 'gri' : 'beyaz',
      'lacivert': itemType === 'pantolon' ? 'gri' : 'beyaz',
      'gri': itemType === 'pantolon' ? 'lacivert' : 'beyaz',
      'kahverengi': itemType === 'pantolon' ? 'bej' : 'gri',
      'yeşil': itemType === 'pantolon' ? 'kahverengi' : 'gri',
      'sarı': itemType === 'pantolon' ? 'lacivert' : 'gri',
      'pembe': itemType === 'pantolon' ? 'gri' : 'lacivert',
      'mor': itemType === 'pantolon' ? 'gri' : 'beyaz',
      'turuncu': itemType === 'pantolon' ? 'lacivert' : 'gri'
    };
    
    return colorCombinations[baseColor] || (itemType === 'pantolon' ? 'lacivert' : 'gri');
  };

  const resetForm = () => {
    setSelectedCustomer('');
    setSelectedOrder('');
    setFabricImage(null);
    setFabricImagePreview('');
    setGeneratedModel(null);
    setGeneratedCombination(null);
    setError('');
    setSuccess('');
    setOrderDetails(null);
    setCustomerDetails(null);
    setModelAge(30);
  };

  const handleSendEmail = async () => {
    if (!generatedModel || !customerDetails || !customerDetails.email) {
      setError('Email göndermek için müşteri email adresi gerekli');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.aiModel.sendEmail({
        customerId: selectedCustomer,
        orderId: selectedOrder,
        imageUrl: generatedModel.imageUrl
      });

      if (response.data.success) {
        setSuccess(`AI Model fotoğrafı ${customerDetails.email} adresine gönderildi!`);
      } else {
        setError('Email gönderilirken hata oluştu: ' + response.data.message);
      }
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      setError('Email gönderilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = () => {
    setGeneratedModel(null);
    setGeneratedCombination(null);
    setError('');
    setSuccess('');
  };

  // Kombin önerisini email olarak gönder
  const handleSendCombinationEmail = async () => {
    if (!generatedCombination || !customerDetails?.email) {
      setError('Email göndermek için kombin önerisi ve müşteri email adresi gerekli');
      return;
    }

    try {
      setLoading(true);
      
      await apiService.aiModel.sendCombinationEmail({
        customerId: selectedCustomer,
        imageUrl: generatedCombination.imageUrl,
        combination: generatedCombination.combination
      });

      setSuccess(`Kombin önerisi ${customerDetails.email} adresine gönderildi!`);
    } catch (error) {
      console.error('Kombin email gönderilirken hata:', error);
      setError(`Email gönderilirken hata: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Image popup handlers
  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
      <Box sx={{ mb: isMobile ? 3 : 4 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 'bold',
            color: 'primary.main',
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          <AutoAwesomeIcon fontSize={isMobile ? "medium" : "large"} />
          AI Manken Oluşturucu
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          Müşteri ölçüleri ve sipariş özelliklerine göre AI destekli manken fotoğrafı oluşturun
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sol Panel - Form */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              Müşteri ve Sipariş Seçimi
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                fullWidth
                options={customers}
                getOptionLabel={(customer) => `${customer.firstName} ${customer.lastName} - ${customer.email || 'Email yok'}`}
                value={customers.find(c => c.id === selectedCustomer) || null}
                onChange={(event, newValue) => {
                  setSelectedCustomer(newValue ? newValue.id : '');
                }}
                loading={loadingCustomers}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Müşteri Ara ve Seç"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCustomers ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, customer) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">
                        {customer.firstName} {customer.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.email || 'Email yok'} • Tel: {customer.phone || 'Telefon yok'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                noOptionsText={loadingCustomers ? "Müşteriler yükleniyor..." : "Müşteri bulunamadı"}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedCustomer}>
                <InputLabel>Sipariş Seçin</InputLabel>
                <Select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  label="Sipariş Seçin"
                >
                  {orders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {order.productType || 'Ürün Tipi Belirtilmemiş'} - {new Date(order.createdAt || order.orderDate).toLocaleDateString('tr-TR')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Model Yaşı"
                value={modelAge}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 30;
                  setModelAge(Math.max(20, Math.min(70, value)));
                }}
                onKeyPress={(e) => {
                  // Sadece sayı girişine izin ver
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                  }
                }}
                inputProps={{ 
                  min: 20, 
                  max: 70,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                helperText="AI model için yaş (20-70 arası). Varsayılan: 30"
                sx={{ mb: 2 }}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhotoCameraIcon />
              Kumaş Fotoğrafı
            </Typography>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="fabric-upload"
              type="file"
              onChange={handleFabricImageUpload}
            />
            <label htmlFor="fabric-upload">
              <UploadBox component="div">
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Kumaş Fotoğrafı Yükle
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  JPEG veya PNG formatında kumaş fotoğrafı seçin
                </Typography>
              </UploadBox>
            </label>

            {fabricImagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <PreviewImage src={fabricImagePreview} alt="Kumaş Önizleme" />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Seçilen kumaş fotoğrafı
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Ana buton - tek buton ile her şey */}
              <Button
                variant="contained"
                onClick={generateAIModel}
                disabled={loading || !selectedCustomer || !selectedOrder || !fabricImage}
                startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                fullWidth
                size="large"
              >
                {loading ? 'AI Manken Oluşturuluyor...' : 'AI Manken Oluştur'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={resetForm}
                disabled={loading}
                size="large"
              >
                Temizle
              </Button>
            </Box>
          </StyledPaper>
        </Grid>

        {/* Sağ Panel - Önizleme ve Sonuç */}
        <Grid item xs={12} md={6}>

          {/* Oluşturulan AI Model */}
          {generatedModel && (
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                ✨ Oluşturulan AI Manken
              </Typography>
              
              <ModelCard onClick={() => handleImageClick({
                url: generatedModel.imageUrl,
                title: `${generatedModel.customer} - ${generatedModel.order}`,
                type: 'Ana Model'
              })}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? "300" : "400"}
                    image={generatedModel.imageUrl}
                    alt="AI Generated Model"
                  />
                  <ModelOverlay className="model-overlay">
                    <FullscreenIcon fontSize="large" />
                  </ModelOverlay>
                  {generatedModel.mock && (
                    <Chip
                      label="🧪 TEST MODU"
                      color="warning"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {generatedModel.customer} - {generatedModel.order}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Oluşturulma: {new Date(generatedModel.createdAt).toLocaleString('tr-TR')}
                  </Typography>
                  {generatedModel.mock && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                      ⚠️ Bu gerçek bir AI sonucu değildir. Gerçek AI generation için API anahtarı gereklidir.
                    </Typography>
                  )}
                  
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendEmail();
                      }}
                      disabled={loading || !customerDetails?.email}
                      startIcon={loading ? <CircularProgress size={16} /> : <EmailIcon />}
                      fullWidth={isMobile}
                    >
                      {loading ? 'Gönderiliyor...' : 'Email Gönder'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(generatedModel.imageUrl, '_blank');
                      }}
                      startIcon={<DownloadIcon />}
                      fullWidth={isMobile}
                    >
                      İndir
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateNew();
                      }}
                      startIcon={<RefreshIcon />}
                      fullWidth={isMobile}
                    >
                      Yeni Oluştur
                    </Button>
                  </Box>
                  
                  {!customerDetails?.email && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      ⚠️ Müşterinin email adresi bulunmuyor, email gönderilemez
                    </Typography>
                  )}
                </CardContent>
              </ModelCard>
            </StyledPaper>
          )}

          {/* Oluşturulan Kombin Önerisi */}
          {generatedCombination && (
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🎨 Kombin Önerisi
                <Chip 
                  label="AI Generated" 
                  size="small" 
                  color="secondary" 
                  variant="outlined" 
                />
              </Typography>
              
              <ModelCard onClick={() => handleImageClick({
                url: generatedCombination.imageUrl,
                title: `${generatedCombination.customer} - Kombin Önerisi`,
                type: 'Kombin',
                details: generatedCombination.combination
              })}>
                <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: isMobile ? 'column' : 'row' }}>
                  <Box sx={{ flex: isMobile ? '1' : '0 0 300px', position: 'relative' }}>
                    <img
                      src={generatedCombination.imageUrl}
                      alt="Kombin Önerisi"
                      style={{
                        width: '100%',
                        height: isMobile ? '300px' : '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0'
                      }}
                      onError={(e) => {
                        e.target.src = '/placeholder-combination.jpg';
                      }}
                    />
                    <ModelOverlay className="model-overlay">
                      <FullscreenIcon fontSize="large" />
                    </ModelOverlay>
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Müşteri:</strong> {generatedCombination.customer}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Kombin Detayları:</strong>
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2">
                        👔 <strong>Üst:</strong> {generatedCombination.combination.topColor} {generatedCombination.combination.topItem}
                      </Typography>
                      <Typography variant="body2">
                        👖 <strong>Alt:</strong> {generatedCombination.combination.bottomColor} {generatedCombination.combination.bottomItem}
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Oluşturulma: {new Date(generatedCombination.createdAt).toLocaleString('tr-TR')}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  flexWrap: 'wrap',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendCombinationEmail();
                    }}
                    disabled={loading || !customerDetails?.email}
                    startIcon={loading ? <CircularProgress size={16} /> : <EmailIcon />}
                    fullWidth={isMobile}
                  >
                    {loading ? 'Gönderiliyor...' : 'Email Gönder'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(generatedCombination.imageUrl, '_blank');
                    }}
                    startIcon={<DownloadIcon />}
                    fullWidth={isMobile}
                  >
                    İndir
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateNew();
                    }}
                    startIcon={<RefreshIcon />}
                    fullWidth={isMobile}
                  >
                    Yeni Oluştur
                  </Button>
                </Box>
                
                {!customerDetails?.email && (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                    ⚠️ Müşterinin email adresi bulunmuyor, email gönderilemez
                  </Typography>
                )}
              </ModelCard>
            </StyledPaper>
          )}

          {/* Kombin Yükleniyor durumu - artık ana loading ile beraber */}
          {loading && (
            <StyledPaper>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI Manken Oluşturuluyor...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {(() => {
                    const productType = orderDetails?.productType?.toLowerCase();
                    const isShirtOrPants = productType === 'gömlek' || productType === 'GÖMLEK' || 
                                          productType === 'pantolon' || productType === 'PANTOLON';
                    
                    if (isShirtOrPants) {
                      return 'Ana ürün ve kombin önerisi oluşturuluyor. Bu işlem birkaç dakika sürebilir.';
                    }
                    return 'Bu işlem birkaç dakika sürebilir. Lütfen bekleyin.';
                  })()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ✨ Yapay zeka kumaş deseninizi analiz ediyor<br/>
                  👗 Müşteri ölçülerine uygun model oluşturuyor<br/>
                  🎨 Profesyonel fotoğraf render ediliyor
                  {(() => {
                    const productType = orderDetails?.productType?.toLowerCase();
                    const isShirtOrPants = productType === 'gömlek' || productType === 'GÖMLEK' || 
                                          productType === 'pantolon' || productType === 'PANTOLON';
                    
                    if (isShirtOrPants) {
                      return <><br/>🎭 Kombin önerisi hazırlanıyor</>;
                    }
                    return null;
                  })()}
                </Typography>
              </Box>
            </StyledPaper>
          )}
        </Grid>
      </Grid>

      {/* Image Popup Dialog */}
      <ImageDialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth={false}
        fullScreen={isMobile}
      >
        {selectedImage && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pb: 1
            }}>
              <Box>
                <Typography variant="h6" component="div">
                  {selectedImage.title}
                </Typography>
                <Chip 
                  label={selectedImage.type} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>
              <IconButton onClick={handleCloseImageDialog} size="large">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, textAlign: 'center' }}>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: isMobile ? '70vh' : '80vh',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.target.src = '/placeholder-model.jpg';
                }}
              />
              
              {selectedImage.details && (
                <Box sx={{ p: 3, bgcolor: 'grey.50', mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Kombin Detayları
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Üst</Typography>
                      <Typography variant="body1">
                        👔 {selectedImage.details.topColor} {selectedImage.details.topItem}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Alt</Typography>
                      <Typography variant="body1">
                        👖 {selectedImage.details.bottomColor} {selectedImage.details.bottomItem}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => window.open(selectedImage.url, '_blank')}
                startIcon={<DownloadIcon />}
                size={isMobile ? "medium" : "small"}
              >
                İndir
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseImageDialog}
                size={isMobile ? "medium" : "small"}
              >
                Kapat
              </Button>
            </DialogActions>
          </>
        )}
      </ImageDialog>
    </Container>
  );
};

export default AIModel;
