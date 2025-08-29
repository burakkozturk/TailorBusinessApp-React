// Enhanced Image Analysis Service
// Gelişmiş görsel analiz sistemi

class EnhancedImageAnalysisService {
  constructor() {
        this.apiUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.erdalguda.com'
      : (process.env.REACT_APP_API_URL || 'http://localhost:6767');
    this.analysisLayers = {
      ocr: true,
      objectDetection: true,
      fabricAnalysis: true,
      colorAnalysis: true,
      patternRecognition: true
    };
  }

  /**
   * Ana görsel analiz fonksiyonu - Çoklu katmanlı analiz
   */
  async analyzeImage(imageFile, analysisType = 'comprehensive') {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('analysisType', analysisType);
      formData.append('layers', JSON.stringify(this.analysisLayers));

      // Ön işleme
      const preprocessedImage = await this.preprocessImage(imageFile);
      formData.append('preprocessed', preprocessedImage);

      const response = await fetch(`${this.apiUrl}/api/enhanced-analysis`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        return this.processAnalysisResults(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Enhanced analysis error:', error);
      throw error;
    }
  }

  /**
   * Görsel ön işleme - Kalite artırma
   */
  async preprocessImage(imageFile) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Optimal boyut hesaplama
        const maxSize = 1920;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Görsel kalitesi artırma
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Kontrast artırma
        const imageData = ctx.getImageData(0, 0, width, height);
        this.enhanceContrast(imageData);
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  /**
   * Kontrast artırma algoritması
   */
  enhanceContrast(imageData) {
    const data = imageData.data;
    const factor = 1.2; // Kontrast faktörü
    
    for (let i = 0; i < data.length; i += 4) {
      // RGB kanalları için kontrast artırma
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128));     // R
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128)); // G
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128)); // B
    }
  }

  /**
   * Analiz sonuçlarını işleme
   */
  processAnalysisResults(rawData) {
    return {
      // OCR Sonuçları
      measurements: this.processMeasurements(rawData.ocr),
      
      // Nesne Tespiti
      detectedObjects: this.processObjectDetection(rawData.objects),
      
      // Kumaş Analizi
      fabricProperties: this.processFabricAnalysis(rawData.fabric),
      
      // Renk Analizi
      colorPalette: this.processColorAnalysis(rawData.colors),
      
      // Desen Tanıma
      patterns: this.processPatternRecognition(rawData.patterns),
      
      // Güven Skoru
      confidenceScore: this.calculateOverallConfidence(rawData),
      
      // Öneriler
      recommendations: this.generateRecommendations(rawData)
    };
  }

  /**
   * Ölçü verilerini işleme - Geliştirilmiş
   */
  processMeasurements(ocrData) {
    if (!ocrData || !ocrData.measurements) return [];
    
    return ocrData.measurements.map(measurement => ({
      ...measurement,
      confidence: measurement.confidence || 0,
      source: 'OCR',
      validated: measurement.confidence > 0.8
    }));
  }

  /**
   * Nesne tespiti sonuçları
   */
  processObjectDetection(objectData) {
    if (!objectData || !objectData.objects) return [];
    
    return objectData.objects.map(obj => ({
      type: obj.class,
      confidence: obj.confidence,
      boundingBox: obj.bbox,
      attributes: obj.attributes || {}
    }));
  }

  /**
   * Kumaş özelliklerini analiz etme
   */
  processFabricAnalysis(fabricData) {
    if (!fabricData) return {};
    
    return {
      texture: fabricData.texture || 'unknown',
      material: fabricData.material || 'unknown',
      quality: fabricData.quality || 'medium',
      stretch: fabricData.stretch || false,
      thickness: fabricData.thickness || 'medium',
      confidence: fabricData.confidence || 0
    };
  }

  /**
   * Renk analizi
   */
  processColorAnalysis(colorData) {
    if (!colorData || !colorData.palette) return [];
    
    return colorData.palette.map(color => ({
      hex: color.hex,
      rgb: color.rgb,
      name: color.name,
      percentage: color.percentage,
      dominant: color.dominant || false
    }));
  }

  /**
   * Desen tanıma
   */
  processPatternRecognition(patternData) {
    if (!patternData || !patternData.patterns) return [];
    
    return patternData.patterns.map(pattern => ({
      type: pattern.type, // 'stripes', 'dots', 'floral', etc.
      confidence: pattern.confidence,
      characteristics: pattern.characteristics || {}
    }));
  }

  /**
   * Genel güven skoru hesaplama
   */
  calculateOverallConfidence(rawData) {
    const scores = [];
    
    if (rawData.ocr && rawData.ocr.confidence) scores.push(rawData.ocr.confidence);
    if (rawData.objects && rawData.objects.confidence) scores.push(rawData.objects.confidence);
    if (rawData.fabric && rawData.fabric.confidence) scores.push(rawData.fabric.confidence);
    if (rawData.colors && rawData.colors.confidence) scores.push(rawData.colors.confidence);
    if (rawData.patterns && rawData.patterns.confidence) scores.push(rawData.patterns.confidence);
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
  }

  /**
   * AI tabanlı öneriler
   */
  generateRecommendations(rawData) {
    const recommendations = [];
    
    // Düşük güven skorlu ölçümler için öneri
    if (rawData.ocr && rawData.ocr.confidence < 0.7) {
      recommendations.push({
        type: 'measurement_quality',
        message: 'Ölçü okunabilirliği düşük. Daha net bir fotoğraf çekin.',
        priority: 'high'
      });
    }
    
    // Kumaş kalitesi önerisi
    if (rawData.fabric && rawData.fabric.quality === 'low') {
      recommendations.push({
        type: 'fabric_quality',
        message: 'Kumaş kalitesi düşük görünüyor. Daha yakın çekim deneyin.',
        priority: 'medium'
      });
    }
    
    // Renk analizi önerisi
    if (rawData.colors && rawData.colors.palette && rawData.colors.palette.length < 2) {
      recommendations.push({
        type: 'color_analysis',
        message: 'Renk çeşitliliği az. Daha iyi aydınlatmada çekim yapın.',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  /**
   * Fitdays spesifik analiz
   */
  async analyzeFitdaysImage(imageFile) {
    return this.analyzeImage(imageFile, 'fitdays_measurements');
  }

  /**
   * Kumaş spesifik analiz
   */
  async analyzeFabricImage(imageFile) {
    return this.analyzeImage(imageFile, 'fabric_analysis');
  }

  /**
   * Kıyafet spesifik analiz
   */
  async analyzeGarmentImage(imageFile) {
    return this.analyzeImage(imageFile, 'garment_analysis');
  }
}

export default new EnhancedImageAnalysisService();
