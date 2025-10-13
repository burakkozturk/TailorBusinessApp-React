import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Save,
  Cancel,
  CloudUpload,
  CloudDownload,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  TableChart,
  ViewModule
} from '@mui/icons-material';
import { 
  MEASUREMENT_FIELDS, 
  MEASUREMENT_CATEGORIES, 
  getMeasurementsByCategory,
  validateMeasurementValue,
  formatMeasurementValue,
  getInitialMeasurementValues
} from '../constants/measurements';
import apiService from '../services/apiService';

const MeasurementModal = ({ open, onClose, customer, measurements = [], onMeasurementsUpdate }) => {
  const [measurementValues, setMeasurementValues] = useState(getInitialMeasurementValues());
  const [activeCategory, setActiveCategory] = useState('boyun');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [ocrLoading, setOcrLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' veya 'category'

  // Modal açıldığında mevcut ölçüleri yükle
  useEffect(() => {
    if (open && measurements.length > 0) {
      const initialValues = getInitialMeasurementValues();
      
      // Mevcut ölçüleri forma doldur
      measurements.forEach(measurement => {
        const field = MEASUREMENT_FIELDS.find(f => 
          f.name === measurement.regionName || f.id === measurement.regionName
        );
        if (field) {
          initialValues[field.id] = measurement.value;
        }
      });
      
      setMeasurementValues(initialValues);
    }
  }, [open, measurements]);

  // Ölçü değeri değiştiğinde
  const handleMeasurementChange = (fieldId, value) => {
    setMeasurementValues(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Validasyon
    if (value && !validateMeasurementValue(value)) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: 'Geçersiz ölçü değeri (10-200 cm arasında olmalı)'
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Tüm ölçüleri kaydet
  const handleSaveAll = async () => {
    setSaving(true);
    const savedMeasurements = [];
    const failedMeasurements = [];

    try {
      for (const field of MEASUREMENT_FIELDS) {
        const value = measurementValues[field.id];
        
        if (value && validateMeasurementValue(value)) {
          try {
            const response = await apiService.measurements.add(customer.id, {
              regionName: field.name,
              value: parseFloat(value),
              unit: field.unit
            });
            
            if (response.data && response.data.success) {
              savedMeasurements.push(field.name);
            } else {
              failedMeasurements.push(field.name);
            }
          } catch (error) {
            console.error(`Ölçü kaydetme hatası - ${field.name}:`, error);
            failedMeasurements.push(field.name);
          }
        }
      }

      // Başarı/hata mesajı
      if (savedMeasurements.length > 0) {
        alert(`${savedMeasurements.length} ölçü başarıyla kaydedildi!`);
        if (onMeasurementsUpdate) {
          onMeasurementsUpdate();
        }
      }
      
      if (failedMeasurements.length > 0) {
        alert(`${failedMeasurements.length} ölçü kaydedilemedi: ${failedMeasurements.join(', ')}`);
      }

    } catch (error) {
      console.error('Toplu ölçü kaydetme hatası:', error);
      alert('Ölçüler kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Fitdays OCR Upload
  const handleFitdaysUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiService.measurements.uploadFitdaysImage(customer.id, formData);
      
      if (response.data && response.data.success) {
        // OCR sonuçlarını forma doldur
        const newValues = { ...measurementValues };
        const measurements = response.data.measurements || [];
        
        measurements.forEach(measurement => {
          const field = MEASUREMENT_FIELDS.find(f => 
            f.name === measurement.regionName
          );
          
          if (field && validateMeasurementValue(measurement.value)) {
            newValues[field.id] = measurement.value;
          }
        });
        
        setMeasurementValues(newValues);
        alert(`🎉 Fitdays AWS Textract ile ${measurements.length} ölçü çıkarıldı ve kaydedildi!`);
        
        // Ölçü listesini yenile
        if (onMeasurementsUpdate) {
          onMeasurementsUpdate();
        }
      } else {
        alert('Fitdays OCR işleminde bir hata oluştu: ' + (response.data?.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Fitdays OCR hatası:', error);
      alert('Fitdays fotoğrafı işlenirken hata oluştu: ' + (error.response?.data?.error || error.message));
    } finally {
      setOcrLoading(false);
    }
  };

  // TXT dosyası indir
  const handleDownloadTxt = () => {
    const filledMeasurements = MEASUREMENT_FIELDS
      .filter(field => measurementValues[field.id])
      .map(field => `${field.name}: ${measurementValues[field.id]} ${field.unit}`)
      .join('\n');

    if (!filledMeasurements) {
      alert('İndirilecek ölçü bulunmuyor');
      return;
    }

    const blob = new Blob([
      `${customer.firstName} ${customer.lastName} - Ölçüler\n`,
      `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n`,
      filledMeasurements
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customer.firstName}_${customer.lastName}_olcular.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Kategori değiştir
  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
  };

  // Aktif kategorideki ölçü alanları
  const activeMeasurements = getMeasurementsByCategory(activeCategory);

  // Dolu ölçü sayısı
  const filledCount = MEASUREMENT_FIELDS.filter(field => measurementValues[field.id]).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div">
              {customer?.firstName} {customer?.lastName} - Ölçüler
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filledCount} / {MEASUREMENT_FIELDS.length} ölçü girildi
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewMode === 'table'}
                  onChange={(e) => setViewMode(e.target.checked ? 'table' : 'category')}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {viewMode === 'table' ? <TableChart fontSize="small" /> : <ViewModule fontSize="small" />}
                  <Typography variant="caption">
                    {viewMode === 'table' ? 'Tablo' : 'Kategori'}
                  </Typography>
                </Box>
              }
              sx={{ mr: 2 }}
            />
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="fitdays-ocr-upload"
              type="file"
              onChange={handleFitdaysUpload}
              disabled={ocrLoading}
            />
            <label htmlFor="fitdays-ocr-upload">
              <Tooltip title="Fitdays ölçü fotoğrafı yükle (OCR)">
                <IconButton component="span" disabled={ocrLoading}>
                  {ocrLoading ? <CircularProgress size={24} /> : <CloudUpload />}
                </IconButton>
              </Tooltip>
            </label>
            
            <Tooltip title="TXT dosyası olarak indir">
              <IconButton onClick={handleDownloadTxt} disabled={filledCount === 0}>
                <CloudDownload />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {viewMode === 'category' ? (
          <>
            {/* Kategori Sekmeleri */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
              <Tabs
                value={activeCategory}
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {Object.entries(MEASUREMENT_CATEGORIES).map(([key, category]) => (
                  <Tab
                    key={key}
                    value={key}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <Chip
                          size="small"
                          label={getMeasurementsByCategory(key).filter(field => measurementValues[field.id]).length}
                          sx={{ 
                            ml: 1, 
                            backgroundColor: category.color + '20',
                            color: category.color,
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Box>

            {/* Ölçü Alanları - Kategori Görünümü */}
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {activeMeasurements.map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field.id}>
                    <Card
                      sx={{
                        border: measurementValues[field.id] ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 3
                        }
                      }}
                    >
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium" sx={{ flexGrow: 1 }}>
                            {field.name}
                          </Typography>
                          {measurementValues[field.id] && (
                            <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                          )}
                        </Box>
                        
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={measurementValues[field.id] || ''}
                          onChange={(e) => handleMeasurementChange(field.id, e.target.value)}
                          placeholder="Ölçü girin"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">{field.unit}</InputAdornment>,
                            inputProps: { min: 10, max: 200, step: 0.1 }
                          }}
                          error={!!errors[field.id]}
                          helperText={errors[field.id]}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: measurementValues[field.id] ? '#f8fff8' : '#fafafa'
                            }
                          }}
                        />
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {field.nameEn}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {activeMeasurements.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Bu kategoride ölçü alanı bulunmuyor.
                </Alert>
              )}
            </Box>
          </>
        ) : (
          /* Tablo Görünümü - Tüm Ölçüler */
          <Box sx={{ p: 2 }}>
            <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Ölçü Adı
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      İngilizce
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', minWidth: 120 }}>
                      Değer
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Birim
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      Durum
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MEASUREMENT_FIELDS.map((field, index) => (
                    <TableRow
                      key={field.id}
                      sx={{
                        backgroundColor: measurementValues[field.id] 
                          ? 'rgba(76, 175, 80, 0.05)' 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: measurementValues[field.id] 
                            ? 'rgba(76, 175, 80, 0.1)' 
                            : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#666' }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {field.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {field.nameEn}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={measurementValues[field.id] || ''}
                          onChange={(e) => handleMeasurementChange(field.id, e.target.value)}
                          placeholder="Değer"
                          InputProps={{
                            inputProps: { min: 10, max: 200, step: 0.1 }
                          }}
                          error={!!errors[field.id]}
                          sx={{
                            width: '100px',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: measurementValues[field.id] ? '#f8fff8' : '#fafafa'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {field.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {measurementValues[field.id] ? (
                          <Chip
                            size="small"
                            icon={<CheckCircle sx={{ fontSize: 16 }} />}
                            label="Girildi"
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            size="small"
                            label="Boş"
                            variant="outlined"
                            sx={{ color: '#666', borderColor: '#ddd' }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0, 0, 0, 0.12)', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={saving}
        >
          Kapat
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSaveAll}
          disabled={saving || filledCount === 0}
          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          sx={{ minWidth: 140 }}
        >
          {saving ? 'Kaydediliyor...' : `Tümünü Kaydet (${filledCount})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeasurementModal;
