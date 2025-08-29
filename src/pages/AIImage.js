import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Stack,
  Fade,
  Zoom,
  LinearProgress,
  Chip,
  Autocomplete,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  CloudUpload, 
  AutoAwesome, 
  PhotoCamera, 
  Download, 
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  Person,
  Straighten,
  ExpandMore,
  Palette,
  CenterFocusStrong,
  Visibility,
  SmartToy
} from '@mui/icons-material';
import api from '../services/api';
import axios from 'axios';
import apiService from '../services/apiService';
import useDocumentTitle from '../hooks/useDocumentTitle';
import colorExtractor from '../utils/colorExtraction';

// Modern Styled Components
const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    transform: 'translate(50%, -50%)',
  }
}));

const UploadCard = styled(Card)(({ theme, isDragOver }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  textAlign: 'center',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: isDragOver ? `3px dashed ${theme.palette.primary.main}` : '3px dashed #e0e0e0',
  background: isDragOver ? 
    'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : 
    'white',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

const PreviewCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  minWidth: 'auto',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: buttonVariant === 'contained' ? '0 6px 20px rgba(0, 0, 0, 0.15)' : 'none',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.2s ease',
}));

const AIImage = () => {
  useDocumentTitle('AI Manken Görselleştirme');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Renk analizi state'leri
  const [extractedColors, setExtractedColors] = useState([]);
  const [dominantColor, setDominantColor] = useState(null);
  const [colorAnalyzing, setColorAnalyzing] = useState(false);
  const [colorExtractionMethod, setColorExtractionMethod] = useState('smart'); // 'smart', 'ai', 'full'
  
  // Müşteri ve sipariş seçimi
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Müşteri listesini yükle
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await apiService.customers.getAll();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Müşteri listesi yüklenirken hata:', error);
      setError('Müşteri listesi yüklenemedi');
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Seçilen müşterinin siparişlerini yükle
  const fetchCustomerOrders = async (customerId) => {
    setLoadingOrders(true);
    try {
      const response = await api.get(`/api/ai-image/orders/by-customer/${customerId}`);
      console.log('Sipariş API yanıtı:', response.data);
      
      setCustomerOrders(response.data || []);
      console.log('Yüklenen siparişler:', response.data);
    } catch (error) {
      console.error('Müşteri siparişleri yüklenirken hata:', error);
      setError('Müşteri siparişleri yüklenemedi: ' + error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Müşteri seçimi değiştiğinde
  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    setCustomerOrders([]);
    setSelectedOrder(null);
    if (newValue) {
      fetchCustomerOrders(newValue.id);
    }
  };

  // Sipariş seçimi değiştiğinde
  const handleOrderChange = (event, newValue) => {
    setSelectedOrder(newValue);
  };

  // Sayfa yüklendiğinde müşteri listesini getir
  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Fotoğraf boyutu çok büyük (max 5MB). Lütfen daha küçük bir fotoğraf seçin.');
        setSelectedPhoto(null);
        setPhotoPreview(null);
        return;
      }
      
      setSelectedPhoto(file);
      setError('');
      setSuccess(false);
      setGeneratedImage(null);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Renk analizi başlat
      analyzeImageColors(file);
    }
  };

  // Renk analizi fonksiyonu - GELİŞTİRİLMİŞ
  const analyzeImageColors = async (imageFile) => {
    setColorAnalyzing(true);
    try {
      console.log(`🎨 Renk analizi başlıyor - Yöntem: ${colorExtractionMethod}`);
      
      // Seçilen yöntemle renk çıkarma
      const colors = await colorExtractor.extractDominantColors(imageFile, 5, colorExtractionMethod);
      const dominant = await colorExtractor.getDominantColor(imageFile);
      
      setExtractedColors(colors);
      setDominantColor(dominant);
      
      console.log(`✅ ${colors.length} renk tespit edildi (${colorExtractionMethod} yöntemi):`, colors);
      console.log('🎯 Dominant renk:', dominant);
      
      // Debug bilgisi kullanıcıya göster
      if (colors.length > 0) {
        const debugInfo = `Renk Analizi: ${colors.length} renk tespit edildi. En yüksek güven skoru: ${Math.max(...colors.map(c => c.confidence || 0))}`;
        console.log(debugInfo);
      }
    } catch (error) {
      console.error('Renk analizi hatası:', error);
      setError('Renk analizi sırasında hata oluştu: ' + error.message);
    } finally {
      setColorAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPhoto) {
      setError('Lütfen önce bir fotoğraf seçin');
      return;
    }

    if (!selectedCustomer) {
      setError('Lütfen bir müşteri seçin');
      return;
    }

    if (!selectedOrder) {
      setError('Lütfen bir sipariş seçin');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('productImage', selectedPhoto);
      formData.append('customerId', selectedCustomer.id);
      formData.append('orderId', selectedOrder.id);
      
      // Renk bilgisini ekle
      if (dominantColor) {
        formData.append('dominantColor', JSON.stringify(dominantColor));
        const colorPrompt = await colorExtractor.getColorPrompt(selectedPhoto);
        formData.append('colorPrompt', colorPrompt);
        console.log('AI\'ya gönderilen renk bilgisi:', { dominantColor, colorPrompt });
      }

      // AI endpoint'i için özel axios instance (JWT token olmadan)
      const aiApi = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://api.erdalguda.com'
    : (process.env.REACT_APP_API_URL || 'http://localhost:6767'),
  timeout: 120000
});
      
      const result = await aiApi.post('/api/ai-image/visualize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (result.data.success) {
        setGeneratedImage(result.data.imageUrl);
        setSuccess(true);
      } else {
        setError(result.data.error || 'AI görsel oluşturulamadı');
      }
    } catch (error) {
      console.error('AI görsel üretim hatası:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-mannequin-${Date.now()}.png`;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Modern Header */}
      <Fade in timeout={600}>
        <HeaderCard>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AutoAwesome sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                AI Manken Görselleştirme
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Fotoğrafınızı yükleyin, AI ile gerçekçi manken görseli oluşturun
              </Typography>
            </Box>
          </Stack>
        </HeaderCard>
      </Fade>


      {/* Müşteri ve Sipariş Seçimi */}
      <Fade in timeout={700}>
        <PreviewCard sx={{ mb: 4 }}>
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="primary" />
              Müşteri ve Sipariş Seçimi
            </Typography>
            
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              value={selectedCustomer}
              onChange={handleCustomerChange}
              loading={loadingCustomers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Müşteri Seçin"
                  placeholder="Müşteri adı yazın..."
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
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                      <Person color="primary" />
                      <Box>
                        <Typography variant="body1">
                          {option.firstName} {option.lastName}
                        </Typography>
                        {(option.height || option.weight) && (
                          <Typography variant="body2" color="text.secondary">
                            {option.height && `Boy: ${option.height}cm`}
                            {option.height && option.weight && ' • '}
                            {option.weight && `Kilo: ${option.weight}kg`}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                );
              }}
            />

            {/* Sipariş Seçimi */}
            {selectedCustomer && (
              <Autocomplete
                options={customerOrders}
                getOptionLabel={(option) => `${option.productType} - ${option.status} (${new Date(option.orderDate).toLocaleDateString('tr-TR')})`}
                value={selectedOrder}
                onChange={handleOrderChange}
                loading={loadingOrders}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sipariş Seçin"
                    placeholder="Hangi sipariş için görsel oluşturacaksınız?"
                    helperText="Seçilen siparişin ürün tipi ve özelleştirmeleri AI görselinde kullanılacak"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingOrders ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                        <AutoAwesome color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {option.productType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.customizations} • {option.status}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(option.orderDate).toLocaleDateString('tr-TR')} • ₺{option.totalPrice}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  );
                }}
              />
            )}

            {/* Seçilen Siparişin Detayları */}
            {selectedOrder && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome color="primary" />
                    Sipariş Detayları
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Chip
                        label={`Ürün: ${selectedOrder.productType}`}
                        color="primary"
                        variant="outlined"
                        sx={{ width: '100%', mb: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Chip
                        label={`Durum: ${selectedOrder.status}`}
                        color="secondary"
                        variant="outlined"
                        sx={{ width: '100%', mb: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Özelleştirmeler:</strong> {selectedOrder.customizations}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}
          </Stack>
        </PreviewCard>
      </Fade>

      <Grid container spacing={4}>
        {/* Sol Taraf - Upload ve Preview */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={800}>
            <Box>
              {/* Fotoğraf Yükleme */}
              <UploadCard>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                  <Stack alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        p: 3,
                        color: 'white'
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Fotoğraf Seçin
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Kumaş veya kıyafet fotoğrafınızı buraya yükleyin<br />
                      <Chip 
                        label="Max 5MB" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Typography>
                  </Stack>
                </label>
              </UploadCard>

              {/* Fotoğraf Preview */}
              {photoPreview && (
                <Fade in timeout={500}>
                  <PreviewCard sx={{ mt: 3 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle color="success" />
                        Seçilen Fotoğraf
                      </Typography>
                      <Box
                        component="img"
                        src={photoPreview}
                        alt="Preview"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 300,
                          borderRadius: 2,
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {selectedPhoto?.name} ({Math.round(selectedPhoto?.size / 1024)} KB)
                      </Typography>
                      
                      {/* Renk Çıkarma Yöntemi Seçici */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          🎯 Renk Analiz Yöntemi
                        </Typography>
                        <ToggleButtonGroup
                          value={colorExtractionMethod}
                          exclusive
                          onChange={(event, newMethod) => {
                            if (newMethod) {
                              setColorExtractionMethod(newMethod);
                              // Yöntem değiştiğinde renk analizini yenile
                              if (selectedPhoto) {
                                analyzeImageColors(selectedPhoto);
                              }
                            }
                          }}
                          size="small"
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          <ToggleButton value="smart" sx={{ px: 1, py: 0.5 }}>
                            <CenterFocusStrong sx={{ mr: 0.5, fontSize: 16 }} />
                            <Typography variant="caption">Akıllı Merkez</Typography>
                          </ToggleButton>
                          <ToggleButton value="ai" sx={{ px: 1, py: 0.5 }}>
                            <SmartToy sx={{ mr: 0.5, fontSize: 16 }} />
                            <Typography variant="caption">AI Segmentasyon</Typography>
                          </ToggleButton>
                          <ToggleButton value="full" sx={{ px: 1, py: 0.5 }}>
                            <Visibility sx={{ mr: 0.5, fontSize: 16 }} />
                            <Typography variant="caption">Tüm Görüntü</Typography>
                          </ToggleButton>
                        </ToggleButtonGroup>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ textAlign: 'center' }}>
                          {colorExtractionMethod === 'smart' && '🎯 Ürün merkezde varsayılarak analiz'}
                          {colorExtractionMethod === 'ai' && '🤖 AI ile ürün alanı tespit edilir'}
                          {colorExtractionMethod === 'full' && '👁️ Tüm görüntüden renk çıkarılır'}
                        </Typography>
                      </Box>

                      {/* Renk Analizi Sonuçları */}
                      {colorAnalyzing && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <CircularProgress size={20} />
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Renkler analiz ediliyor... ({colorExtractionMethod} yöntemi)
                          </Typography>
                        </Box>
                      )}
                      
                      {extractedColors.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            🎨 Tespit Edilen Renkler
                          </Typography>
                          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                            {extractedColors.slice(0, 5).map((color, index) => (
                              <Box key={index} sx={{ textAlign: 'center' }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: color.hex,
                                    borderRadius: 1,
                                    border: '2px solid #fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    mb: 0.5,
                                    position: 'relative'
                                  }}
                                >
                                  {color.dominant && (
                                    <Chip
                                      label="Ana"
                                      size="small"
                                      color="primary"
                                      sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        fontSize: '0.6rem',
                                        height: 16
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography variant="caption" display="block">
                                  {color.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  %{color.percentage}
                                </Typography>
                                {color.confidence && (
                                  <Typography variant="caption" display="block" 
                                    color={color.confidence > 70 ? 'success.main' : color.confidence > 50 ? 'warning.main' : 'error.main'}>
                                    ⭐{color.confidence}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Stack>
                          
                          {dominantColor && (
                            <Alert 
                              severity="info" 
                              sx={{ mt: 2 }}
                              icon={<Palette />}
                            >
                              <strong>Ana Renk ({colorExtractionMethod === 'smart' ? '🎯 Merkez Odaklı' : colorExtractionMethod === 'ai' ? '🤖 AI Segmentasyon' : '👁️ Tüm Görüntü'}):</strong> {dominantColor.name} - AI bu renkte ürün oluşturacak
                            </Alert>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </PreviewCard>
                </Fade>
              )}
            </Box>
          </Zoom>
        </Grid>

        {/* Sağ Taraf - Sonuç ve Kontroller */}
        <Grid item xs={12} md={6}>
          <Zoom in timeout={1000}>
            <Box>
              {/* AI Üretim Butonu */}
              <PreviewCard>
                <Stack alignItems="center" spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Görsel Üretimi
                  </Typography>
                  
                  <ActionButton
                    variant="contained"
                    size="large"
                    onClick={handleGenerate}
                    disabled={!selectedPhoto || !selectedCustomer || !selectedOrder || loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                    sx={{
                      background: (selectedCustomer && selectedOrder) ? 
                        (dominantColor ? 
                          `linear-gradient(135deg, ${dominantColor.hex} 0%, #764ba2 100%)` :
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        ) : 
                        'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? 'AI Çalışıyor...' : 
                     (selectedCustomer && selectedOrder) ? 
                       `${dominantColor ? dominantColor.name + ' ' : ''}${selectedOrder.productType} AI Görseli Oluştur` : 
                     'Müşteri ve Sipariş Seçin'}
                  </ActionButton>
                  
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                    {selectedOrder && (
                      <Chip
                        label={`${selectedOrder.productType} için özelleştirildi`}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {dominantColor && (
                      <Chip
                        label={`${dominantColor.name} renkte üretilecek`}
                        sx={{ 
                          backgroundColor: dominantColor.hex,
                          color: dominantColor.rgb.r + dominantColor.rgb.g + dominantColor.rgb.b > 400 ? '#000' : '#fff'
                        }}
                        size="small"
                      />
                    )}
                  </Stack>

                  {loading && (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress 
                        sx={{ 
                          borderRadius: 1,
                          height: 8,
                          background: 'rgba(102, 126, 234, 0.1)'
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                        Bu işlem 30-60 saniye sürebilir...
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </PreviewCard>

              {/* Üretilen Görsel */}
              {generatedImage && (
                <Fade in timeout={500}>
                  <PreviewCard sx={{ mt: 3 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesome color="primary" />
                        AI Manken Görseli
                      </Typography>
                      <Box
                        component="img"
                        src={generatedImage}
                        alt="AI Generated"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 400,
                          borderRadius: 2,
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                      <Stack direction="row" spacing={2}>
                        <ActionButton
                          variant="contained"
                          color="success"
                          startIcon={<Download />}
                          onClick={handleDownload}
                        >
                          İndir
                        </ActionButton>
                        <ActionButton
                          variant="outlined"
                          startIcon={<Refresh />}
                          onClick={() => {
                            setGeneratedImage(null);
                            setSuccess(false);
                          }}
                        >
                          Yeni Üretim
                        </ActionButton>
                      </Stack>
                    </Stack>
                  </PreviewCard>
                </Fade>
              )}
            </Box>
          </Zoom>
        </Grid>
      </Grid>

      {/* Hata ve Başarı Mesajları */}
      {error && (
        <Fade in timeout={300}>
          <Alert 
            severity="error" 
            sx={{ 
              mt: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
            icon={<ErrorIcon />}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in timeout={300}>
          <Alert 
            severity="success" 
            sx={{ 
              mt: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
            icon={<CheckCircle />}
          >
            AI görsel başarıyla oluşturuldu! 🎉
          </Alert>
        </Fade>
      )}
    </Container>
  );
};

export default AIImage;
