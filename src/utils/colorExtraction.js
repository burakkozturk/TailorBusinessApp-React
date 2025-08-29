// Enhanced Color Extraction Utility
// Yüklenen görselden ÜRÜN-ODAKLI dominant renkleri çıkarma

class ColorExtractor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.segmentationCanvas = document.createElement('canvas');
    this.segmentationCtx = this.segmentationCanvas.getContext('2d');
  }

  /**
   * Görselden ÜRÜN-ODAKLI dominant renkleri çıkar
   * @param {File|string} imageSource - Resim dosyası veya URL
   * @param {number} colorCount - Çıkarılacak renk sayısı (default: 5)
   * @param {string} method - 'smart' (akıllı merkez), 'ai' (AI segmentasyon), 'full' (tüm görüntü)
   * @returns {Promise<Array>} - Dominant renkler array'i
   */
  async extractDominantColors(imageSource, colorCount = 5, method = 'smart') {
    try {
      console.log(`🎨 Renk çıkarma başlatılıyor - Yöntem: ${method}`);
      
      const imageData = await this.loadImageData(imageSource);
      let productPixels;
      
      switch (method) {
        case 'ai':
          productPixels = await this.extractProductPixelsWithAI(imageSource, imageData);
          break;
        case 'smart':
          productPixels = this.extractProductPixelsSmart(imageData);
          break;
        case 'full':
        default:
          productPixels = this.getPixels(imageData);
          break;
      }
      
      console.log(`📊 Analiz edilen pixel sayısı: ${productPixels.length}`);
      
      if (productPixels.length === 0) {
        console.warn('⚠️ Ürün pixeli bulunamadı, tüm görüntü analiz ediliyor');
        productPixels = this.getPixels(imageData);
      }
      
      const colors = this.analyzeColors({ data: this.pixelsToImageData(productPixels) }, colorCount);
      const formattedColors = this.formatColors(colors);
      
      console.log(`✅ ${formattedColors.length} renk tespit edildi`);
      return formattedColors;
      
    } catch (error) {
      console.error('Renk çıkarma hatası:', error);
      // Fallback olarak standart metodu dene
      return this.extractDominantColors(imageSource, colorCount, 'full');
    }
  }

  /**
   * Resmi yükle ve ImageData olarak döndür
   */
  async loadImageData(imageSource) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // Canvas boyutunu ayarla (performans için küçült)
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Resmi canvas'a çiz
        this.ctx.drawImage(img, 0, 0, width, height);
        
        // ImageData'yı al
        const imageData = this.ctx.getImageData(0, 0, width, height);
        resolve(imageData);
      };
      
      img.onerror = reject;
      
      // Resim kaynağını ayarla
      if (imageSource instanceof File) {
        img.src = URL.createObjectURL(imageSource);
      } else {
        img.src = imageSource;
      }
    });
  }

  /**
   * K-means clustering ile renk analizi
   */
  analyzeColors(imageData, colorCount) {
    const pixels = this.getPixels(imageData);
    const clusters = this.kMeansClustering(pixels, colorCount);
    return clusters;
  }

  /**
   * 🎯 AKILLI ÜRÜN PIXEL ÇıKARMA - Merkez odaklı yaklaşım
   * Ürünün genellikle fotoğrafın merkezinde olduğunu varsayar
   */
  extractProductPixelsSmart(imageData) {
    const pixels = [];
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Merkez alanı belirle - daha akıllı hesaplama
    // Gömlek fotoğrafları genellikle dikey formatta
    const aspectRatio = width / height;
    let centerMarginX, centerMarginY;
    
    if (aspectRatio > 1.2) {
      // Yatay fotoğraf - daha geniş merkez
      centerMarginX = 0.15;
      centerMarginY = 0.25;
    } else if (aspectRatio < 0.8) {
      // Dikey fotoğraf - gömlek için optimize
      centerMarginX = 0.25;
      centerMarginY = 0.15;
    } else {
      // Kare fotoğraf
      centerMarginX = 0.2;
      centerMarginY = 0.2;
    }
    
    const startX = Math.floor(width * centerMarginX);
    const endX = Math.floor(width * (1 - centerMarginX));
    const startY = Math.floor(height * centerMarginY);
    const endY = Math.floor(height * (1 - centerMarginY));
    
    console.log(`🎯 Akıllı merkez alanı: ${startX},${startY} - ${endX},${endY}`);
    
    // Merkez alanda kenar tespiti yap
    const edgeDetected = this.detectProductEdges(imageData, startX, startY, endX, endY);
    
    // Merkez alandaki pixelleri örnekle (yoğun örnekleme)
    for (let y = startY; y < endY; y += 2) { // Her 2 pixel
      for (let x = startX; x < endX; x += 2) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        // Şeffaf pixel'leri ve çok açık/koyu background'ları atla
        if (a > 128 && !this.isBackgroundColor(r, g, b)) {
          // Kenar tespiti varsa edge yakınlığına göre ağırlık ver
          const edgeWeight = edgeDetected ? this.getEdgeWeight(x, y, edgeDetected) : 1;
          
          // Ağırlık faktörüne göre pixel'i birden fazla ekle
          for (let w = 0; w < edgeWeight; w++) {
            pixels.push([r, g, b]);
          }
        }
      }
    }
    
    console.log(`🎯 Akıllı merkez analizi: ${pixels.length} pixel`);
    return pixels;
  }
  
  /**
   * 🤖 AI DESTEKLİ ÜRÜN PIXEL ÇıKARMA
   * GPT-4 Vision ile ürün alanını tespit eder
   */
  async extractProductPixelsWithAI(imageSource, imageData) {
    try {
      console.log('🤖 AI destekli ürün segmentasyonu başlatılıyor...');
      
      // Görseli base64'e çevir
      const base64Image = await this.imageToBase64(imageSource);
      
      // GPT-4 Vision ile ürün koordinatlarını al
      const productRegions = await this.getProductRegionsFromAI(base64Image);
      
      if (!productRegions || productRegions.length === 0) {
        console.warn('⚠️ AI ürün alanı bulamadı, akıllı metoda geçiliyor');
        return this.extractProductPixelsSmart(imageData);
      }
      
      // Belirlenen alanlardan pixel çıkar
      const pixels = [];
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      productRegions.forEach(region => {
        const startX = Math.floor(region.x * width);
        const endX = Math.floor((region.x + region.width) * width);
        const startY = Math.floor(region.y * height);
        const endY = Math.floor((region.y + region.height) * height);
        
        for (let y = startY; y < endY; y += 1) {
          for (let x = startX; x < endX; x += 1) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            
            if (a > 128 && !this.isBackgroundColor(r, g, b)) {
              pixels.push([r, g, b]);
            }
          }
        }
      });
      
      console.log(`🤖 AI segmentasyon: ${pixels.length} pixel`);
      return pixels;
      
    } catch (error) {
      console.error('AI segmentasyon hatası:', error);
      return this.extractProductPixelsSmart(imageData);
    }
  }
  
  /**
   * GELİŞTİRİLMİŞ arka plan tespiti - Kumaş fotoğrafları için optimize
   */
  isBackgroundColor(r, g, b) {
    // Çok açık renkler (beyaz/krem background)
    if (r > 235 && g > 235 && b > 235) return true;
    
    // Çok koyu renkler (siyah background)
    if (r < 20 && g < 20 && b < 20) return true;
    
    // Gri tonları kontrol - daha sıkı filtre
    const avg = (r + g + b) / 3;
    const maxDiff = Math.max(Math.abs(r - avg), Math.abs(g - avg), Math.abs(b - avg));
    
    // Monoton gri tonları
    if (maxDiff < 15 && avg > 200) return true; // Açık gri
    if (maxDiff < 10 && avg < 50) return true;  // Koyu gri
    
    // Studio ışık yansımalarını tespit et
    const brightness = Math.max(r, g, b);
    const saturation = this.calculateSaturation(r, g, b);
    
    // Yüksek parlaklık + düşük doygunluk = muhtemelen ışık yansıması
    if (brightness > 250 && saturation < 0.1) return true;
    
    // Çok solgun/pastel renkler (background noise olabilir)
    if (saturation < 0.05 && avg > 180) return true;
    
    return false;
  }
  
  /**
   * Renk doygunluğunu hesapla (0-1 arası)
   */
  calculateSaturation(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    if (max === 0) return 0;
    return (max - min) / max;
  }
  
  /**
   * Kenar tespiti algoritması
   */
  detectProductEdges(imageData, startX, startY, endX, endY) {
    // Basit Sobel edge detection
    const width = imageData.width;
    const data = imageData.data;
    const edges = [];
    
    for (let y = startY + 1; y < endY - 1; y++) {
      for (let x = startX + 1; x < endX - 1; x++) {
        const index = (y * width + x) * 4;
        
        // Sobel gradientleri hesapla
        const gx = this.getSobelGx(data, x, y, width);
        const gy = this.getSobelGy(data, x, y, width);
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        
        if (magnitude > 50) { // Edge threshold
          edges.push({ x, y, magnitude });
        }
      }
    }
    
    return edges;
  }
  
  /**
   * ImageData'dan pixel verilerini çıkar (eski method - fallback için)
   */
  getPixels(imageData) {
    const pixels = [];
    const data = imageData.data;
    
    // Her 4. pixel'i al (performans için sampling)
    for (let i = 0; i < data.length; i += 16) { // 4 pixel atlayarak
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Şeffaf pixel'leri atla
      if (a > 128) {
        pixels.push([r, g, b]);
      }
    }
    
    return pixels;
  }

  /**
   * Basitleştirilmiş K-means clustering
   */
  kMeansClustering(pixels, k) {
    if (pixels.length === 0) return [];
    
    // İlk centroid'leri rastgele seç
    let centroids = [];
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * pixels.length);
      centroids.push([...pixels[randomIndex]]);
    }
    
    // 10 iterasyon yap
    for (let iter = 0; iter < 10; iter++) {
      const clusters = Array(k).fill().map(() => []);
      
      // Her pixel'i en yakın centroid'e ata
      pixels.forEach(pixel => {
        let minDistance = Infinity;
        let closestCluster = 0;
        
        centroids.forEach((centroid, index) => {
          const distance = this.colorDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            closestCluster = index;
          }
        });
        
        clusters[closestCluster].push(pixel);
      });
      
      // Yeni centroid'leri hesapla
      centroids = clusters.map(cluster => {
        if (cluster.length === 0) return centroids[0]; // Boş cluster durumu
        
        const r = cluster.reduce((sum, p) => sum + p[0], 0) / cluster.length;
        const g = cluster.reduce((sum, p) => sum + p[1], 0) / cluster.length;
        const b = cluster.reduce((sum, p) => sum + p[2], 0) / cluster.length;
        
        return [Math.round(r), Math.round(g), Math.round(b)];
      });
    }
    
    // Cluster büyüklüklerini hesapla
    const clusterSizes = Array(k).fill(0);
    pixels.forEach(pixel => {
      let minDistance = Infinity;
      let closestCluster = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = this.colorDistance(pixel, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = index;
        }
      });
      
      clusterSizes[closestCluster]++;
    });
    
    // Sonuçları büyüklüğe göre sırala
    const results = centroids.map((centroid, index) => ({
      rgb: centroid,
      size: clusterSizes[index],
      percentage: (clusterSizes[index] / pixels.length) * 100
    }));
    
    return results.sort((a, b) => b.size - a.size);
  }

  /**
   * İki renk arasındaki Euclidean mesafe
   */
  colorDistance(color1, color2) {
    const dr = color1[0] - color2[0];
    const dg = color1[1] - color2[1];
    const db = color1[2] - color2[2];
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * GELİŞTİRİLMİŞ renk formatlama - Tutarlılık için filtreler ekle
   */
  formatColors(clusters) {
    const validColors = clusters
      .filter(cluster => {
        const [r, g, b] = cluster.rgb;
        
        // %5'den küçük renkleri filtrele (daha kesin)
        if (cluster.percentage < 5) return false;
        
        // Arka plan renklerini tekrar kontrol et
        if (this.isBackgroundColor(r, g, b)) return false;
        
        // Çok düşük doygunluklu renkleri filtrele (gri tonları)
        const saturation = this.calculateSaturation(r, g, b);
        if (saturation < 0.15 && cluster.percentage < 15) return false;
        
        return true;
      })
      .map((cluster, index) => {
        const [r, g, b] = cluster.rgb;
        const hex = this.rgbToHex(r, g, b);
        const name = this.getColorName(r, g, b);
        const saturation = this.calculateSaturation(r, g, b);
        
        return {
          rgb: { r, g, b },
          hex,
          name,
          percentage: Math.round(cluster.percentage),
          dominant: index === 0, // İlk geçerli renk dominant
          saturation: Math.round(saturation * 100),
          confidence: this.calculateColorConfidence(r, g, b, cluster.percentage)
        };
      })
      .sort((a, b) => b.confidence - a.confidence); // Güven skoruna göre sırala
    
    // Eğer hiç geçerli renk kalmadıysa, en büyük 2 cluster'ı al
    if (validColors.length === 0) {
      console.warn('⚠️ Hiç geçerli renk bulunamadı, fallback kullanılıyor');
      return clusters.slice(0, 2).map((cluster, index) => {
        const [r, g, b] = cluster.rgb;
        return {
          rgb: { r, g, b },
          hex: this.rgbToHex(r, g, b),
          name: this.getColorName(r, g, b),
          percentage: Math.round(cluster.percentage),
          dominant: index === 0,
          confidence: 50
        };
      });
    }
    
    return validColors.slice(0, 5); // Maksimum 5 renk döndür
  }
  
  /**
   * Renk güven skoru hesapla (0-100)
   */
  calculateColorConfidence(r, g, b, percentage) {
    let confidence = 0;
    
    // Yüzde oranına göre puan
    confidence += Math.min(percentage * 2, 40);
    
    // Doygunluğa göre puan
    const saturation = this.calculateSaturation(r, g, b);
    confidence += saturation * 30;
    
    // Parlaklığa göre puan (çok açık/koyu değilse)
    const brightness = (r + g + b) / 3;
    if (brightness > 50 && brightness < 200) {
      confidence += 20;
    } else {
      confidence += 10;
    }
    
    // Arka plan olmadığına göre puan
    if (!this.isBackgroundColor(r, g, b)) {
      confidence += 10;
    }
    
    return Math.min(Math.round(confidence), 100);
  }

  /**
   * RGB'yi HEX'e çevir
   */
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * GELİŞTİRİLMİŞ renk ismi tahmin et - KUMAŞ ODU
   */
  getColorName(r, g, b) {
    // Kumaş ve giyim sektörüne özel renk paleti
    const colors = [
      // Temel renkler
      { name: 'Siyah', rgb: [0, 0, 0], range: 30 },
      { name: 'Beyaz', rgb: [255, 255, 255], range: 25 },
      { name: 'Gri', rgb: [128, 128, 128], range: 40 },
      { name: 'Koyu Gri', rgb: [64, 64, 64], range: 35 },
      { name: 'Açık Gri', rgb: [192, 192, 192], range: 35 },
      
      // Mavi tonları (gömlek için önemli)
      { name: 'Lacivert', rgb: [25, 25, 112], range: 45 },
      { name: 'Koyu Mavi', rgb: [0, 0, 139], range: 40 },
      { name: 'Mavi', rgb: [0, 100, 200], range: 50 },
      { name: 'Açık Mavi', rgb: [173, 216, 230], range: 45 },
      { name: 'Gök Mavisi', rgb: [135, 206, 235], range: 45 },
      
      // Yeşil tonları (fotoğrafınızdaki gibi)
      { name: 'Koyu Yeşil', rgb: [0, 100, 0], range: 60 },
      { name: 'Yeşil', rgb: [34, 139, 34], range: 60 },
      { name: 'Haki', rgb: [107, 142, 35], range: 50 },
      { name: 'Zeytin Yeşili', rgb: [85, 107, 47], range: 45 },
      { name: 'Çam Yeşili', rgb: [46, 125, 50], range: 55 },
      
      // Kahverengi tonları
      { name: 'Kahverengi', rgb: [139, 69, 19], range: 50 },
      { name: 'Koyu Kahverengi', rgb: [101, 67, 33], range: 45 },
      { name: 'Açık Kahverengi', rgb: [205, 133, 63], range: 45 },
      { name: 'Bej', rgb: [245, 245, 220], range: 40 },
      { name: 'Krem', rgb: [255, 253, 208], range: 35 },
      
      // Diğer renkler
      { name: 'Kırmızı', rgb: [220, 20, 60], range: 60 },
      { name: 'Bordo', rgb: [128, 0, 32], range: 45 },
      { name: 'Pembe', rgb: [255, 182, 193], range: 50 },
      { name: 'Mor', rgb: [128, 0, 128], range: 55 },
      { name: 'Sarı', rgb: [255, 215, 0], range: 50 },
      { name: 'Turuncu', rgb: [255, 140, 0], range: 50 }
    ];
    
    let closestColor = colors[0];
    let minDistance = Infinity;
    
    colors.forEach(color => {
      const distance = this.colorDistance([r, g, b], color.rgb);
      // Renk aralığını da dikkate al
      const adjustedDistance = distance / (color.range / 40); // Normalize et
      
      if (adjustedDistance < minDistance) {
        minDistance = adjustedDistance;
        closestColor = color;
      }
    });
    
    // Eğer mesafe çok uzaksa, RGB değerlerine göre genel kategori ver
    if (minDistance > 100) {
      return this.getColorByDominantChannel(r, g, b);
    }
    
    return closestColor.name;
  }
  
  /**
   * Dominant RGB kanalına göre renk kategorisi
   */
  getColorByDominantChannel(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    // Çok düşük kontrast = gri
    if (diff < 30) {
      if (max < 60) return 'Koyu Gri';
      if (max > 200) return 'Açık Gri';
      return 'Gri';
    }
    
    // Dominant kanal kontrolü
    if (r === max && r > g + 30 && r > b + 30) {
      return r > 180 ? 'Açık Kırmızı' : 'Kırmızı';
    }
    if (g === max && g > r + 30 && g > b + 30) {
      return g > 180 ? 'Açık Yeşil' : 'Yeşil';
    }
    if (b === max && b > r + 30 && b > g + 30) {
      return b > 180 ? 'Açık Mavi' : 'Mavi';
    }
    
    // Karışık renkler
    if (r > 150 && g > 150 && b < 100) return 'Sarı';
    if (r > 150 && b > 150 && g < 100) return 'Pembe';
    if (g > 150 && b > 150 && r < 100) return 'Turkuaz';
    
    return 'Bilinmeyen Renk';
  }

  /**
   * Dominant rengi al (en büyük yüzdeye sahip) - ÜRÜN ODAKLI
   */
  async getDominantColor(imageSource) {
    // Önce akıllı metodu dene
    const colors = await this.extractDominantColors(imageSource, 3, 'smart');
    return colors.length > 0 ? colors[0] : null;
  }

  /**
   * Renk paletini metin olarak formatla (AI prompt için) - ÜRÜN ODAKLI
   */
  async getColorPrompt(imageSource) {
    // Önce akıllı metodu dene, sonra AI'ı
    const smartColors = await this.extractDominantColors(imageSource, 3, 'smart');
    
    if (smartColors.length === 0) {
      return "genel renkler";
    }
    
    const dominantColor = smartColors[0];
    const colorNames = smartColors.map(c => c.name).join(', ');
    
    return `${dominantColor.name} ağırlıklı (${colorNames}) renkler`;
  }
  
  // ===== YARDIMCI FONKSİYONLAR =====
  
  /**
   * Pixel array'ini ImageData formatına çevir
   */
  pixelsToImageData(pixels) {
    const data = new Uint8ClampedArray(pixels.length * 4);
    for (let i = 0; i < pixels.length; i++) {
      const pixelIndex = i * 4;
      data[pixelIndex] = pixels[i][0];     // R
      data[pixelIndex + 1] = pixels[i][1]; // G
      data[pixelIndex + 2] = pixels[i][2]; // B
      data[pixelIndex + 3] = 255;          // A
    }
    return data;
  }
  
  /**
   * Sobel Gx gradyent hesaplama
   */
  getSobelGx(data, x, y, width) {
    const getGray = (px, py) => {
      const index = (py * width + px) * 4;
      return (data[index] + data[index + 1] + data[index + 2]) / 3;
    };
    
    return (
      -1 * getGray(x - 1, y - 1) + 1 * getGray(x + 1, y - 1) +
      -2 * getGray(x - 1, y) + 2 * getGray(x + 1, y) +
      -1 * getGray(x - 1, y + 1) + 1 * getGray(x + 1, y + 1)
    );
  }
  
  /**
   * Sobel Gy gradyent hesaplama
   */
  getSobelGy(data, x, y, width) {
    const getGray = (px, py) => {
      const index = (py * width + px) * 4;
      return (data[index] + data[index + 1] + data[index + 2]) / 3;
    };
    
    return (
      -1 * getGray(x - 1, y - 1) + -2 * getGray(x, y - 1) + -1 * getGray(x + 1, y - 1) +
      1 * getGray(x - 1, y + 1) + 2 * getGray(x, y + 1) + 1 * getGray(x + 1, y + 1)
    );
  }
  
  /**
   * Kenar yakınlığına göre ağırlık hesapla
   */
  getEdgeWeight(x, y, edges) {
    if (!edges || edges.length === 0) return 1;
    
    // En yakın kenar mesafesini bul
    let minDistance = Infinity;
    edges.forEach(edge => {
      const distance = Math.sqrt((x - edge.x) ** 2 + (y - edge.y) ** 2);
      minDistance = Math.min(minDistance, distance);
    });
    
    // Yakın kenarlar için daha yüksek ağırlık
    if (minDistance < 5) return 3;
    if (minDistance < 10) return 2;
    return 1;
  }
  
  /**
   * Görseli base64'e çevir
   */
  async imageToBase64(imageSource) {
    if (imageSource instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageSource);
      });
    }
    return imageSource;
  }
  
  /**
   * GPT-4 Vision ile ürün alanlarını tespit et
   */
  async getProductRegionsFromAI(base64Image) {
    try {
      // Bu fonksiyon gerçek AI API çağrısı yapacak
      // Şimdilik basit merkez alanı döndürüyoruz
      console.log('🤖 AI segmentasyon simülasyonu...');
      
      // TODO: Gerçek GPT-4 Vision API çağrısı
      // Şimdilik merkez alanı döndür
      return [
        {
          x: 0.2,
          y: 0.2,
          width: 0.6,
          height: 0.6,
          confidence: 0.8
        }
      ];
    } catch (error) {
      console.error('AI API hatası:', error);
      return null;
    }
  }
}

export default new ColorExtractor();
