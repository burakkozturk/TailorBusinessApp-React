import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
  AutoAwesome,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  Visibility,
  Palette,
  TextureSharp,
  Straighten
} from '@mui/icons-material';
import enhancedImageAnalysis from '../services/enhancedImageAnalysis';

const EnhancedImageUpload = ({ onAnalysisComplete, analysisType = 'comprehensive' }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu çok büyük (max 10MB)');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setError('Lütfen bir resim dosyası seçin');
        return;
      }

      setSelectedImage(file);
      setError('');
      setAnalysisResult(null);

      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Lütfen önce bir resim seçin');
      return;
    }

    setAnalyzing(true);
    setError('');
    setProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await enhancedImageAnalysis.analyzeImage(selectedImage, analysisType);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setAnalysisResult(result);
      
      // Parent component'e sonucu gönder
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

    } catch (error) {
      console.error('Analiz hatası:', error);
      setError('Görsel analizi sırasında hata oluştu: ' + error.message);
    } finally {
      setAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'Yüksek Güven';
    if (confidence >= 0.6) return 'Orta Güven';
    return 'Düşük Güven';
  };

  return (
    <Box>
      {/* Upload Area */}
      <Card 
        sx={{ 
          mb: 3, 
          border: '2px dashed #e0e0e0',
          '&:hover': { borderColor: 'primary.main' },
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          
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
              Gelişmiş Görsel Analizi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kıyafet, kumaş veya ölçü fotoğrafınızı yükleyin
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="OCR" size="small" color="primary" variant="outlined" />
              <Chip label="Nesne Tespiti" size="small" color="secondary" variant="outlined" />
              <Chip label="Kumaş Analizi" size="small" color="success" variant="outlined" />
              <Chip label="Renk Analizi" size="small" color="warning" variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {imagePreview && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility color="primary" />
              Seçilen Görsel
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedImage?.name} ({Math.round(selectedImage?.size / 1024)} KB)
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAnalyze}
                disabled={analyzing}
                startIcon={analyzing ? <AutoAwesome className="rotating" /> : <AutoAwesome />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4,
                  py: 1.5
                }}
              >
                {analyzing ? 'Analiz Ediliyor...' : 'AI Analizi Başlat'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {analyzing && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Görsel analizi devam ediyor...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              %{progress} tamamlandı
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <CheckCircle color="success" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Analiz Sonuçları
              </Typography>
              <Chip 
                label={`${getConfidenceText(analysisResult.confidenceScore)} (%${Math.round(analysisResult.confidenceScore * 100)})`}
                color={getConfidenceColor(analysisResult.confidenceScore)}
                size="small"
              />
            </Stack>

            {/* Measurements */}
            {analysisResult.measurements && analysisResult.measurements.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Straighten color="primary" />
                    <Typography sx={{ fontWeight: 600 }}>
                      Ölçüler ({analysisResult.measurements.length})
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {analysisResult.measurements.map((measurement, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card variant="outlined">
                          <CardContent sx={{ py: 2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {measurement.regionName}
                              </Typography>
                              <Typography variant="h6" color="primary.main">
                                {measurement.value} {measurement.unit}
                              </Typography>
                            </Stack>
                            {measurement.confidence && (
                              <Chip 
                                label={`%${Math.round(measurement.confidence * 100)} güven`}
                                size="small"
                                color={getConfidenceColor(measurement.confidence)}
                                sx={{ mt: 1 }}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Detected Objects */}
            {analysisResult.detectedObjects && analysisResult.detectedObjects.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Visibility color="secondary" />
                    <Typography sx={{ fontWeight: 600 }}>
                      Tespit Edilen Nesneler ({analysisResult.detectedObjects.length})
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {analysisResult.detectedObjects.map((obj, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={obj.type}
                          secondary={`Güven: %${Math.round(obj.confidence * 100)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Fabric Properties */}
            {analysisResult.fabricProperties && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <TextureSharp color="info" />
                    <Typography sx={{ fontWeight: 600 }}>
                      Kumaş Özellikleri
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Doku</Typography>
                      <Typography variant="body1">{analysisResult.fabricProperties.texture}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Malzeme</Typography>
                      <Typography variant="body1">{analysisResult.fabricProperties.material}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Kalite</Typography>
                      <Typography variant="body1">{analysisResult.fabricProperties.quality}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Kalınlık</Typography>
                      <Typography variant="body1">{analysisResult.fabricProperties.thickness}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Color Palette */}
            {analysisResult.colorPalette && analysisResult.colorPalette.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Palette color="warning" />
                    <Typography sx={{ fontWeight: 600 }}>
                      Renk Paleti ({analysisResult.colorPalette.length})
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {analysisResult.colorPalette.map((color, index) => (
                      <Box key={index} sx={{ textAlign: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: color.hex,
                            borderRadius: 2,
                            border: '2px solid #e0e0e0',
                            mb: 1
                          }}
                        />
                        <Typography variant="caption" display="block">
                          {color.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          %{Math.round(color.percentage)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info color="info" />
                  AI Önerileri
                </Typography>
                <Stack spacing={1}>
                  {analysisResult.recommendations.map((rec, index) => (
                    <Alert 
                      key={index}
                      severity={rec.priority === 'high' ? 'warning' : rec.priority === 'medium' ? 'info' : 'success'}
                      variant="outlined"
                    >
                      {rec.message}
                    </Alert>
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rotating {
          animation: rotate 2s linear infinite;
        }
      `}</style>
    </Box>
  );
};

export default EnhancedImageUpload;
