import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

class PDFService {
  constructor() {
    this.templates = {
      'CEKET': '/pdf-patterns/ceket-pattern.pdf',
      'GÖMLEK': '/pdf-patterns/gomlek-pattern.pdf', 
      'PANTOLON': '/pdf-patterns/pantolon-pattern.pdf'
    };
  }

  /**
   * Ana PDF oluşturma fonksiyonu
   * @param {Object} order - Sipariş verisi
   * @param {Array} measurements - Ölçü verileri
   * @returns {Uint8Array} - PDF bytes
   */
  async generatePatternPDF(order, measurements) {
    try {
      console.log('🎯 PDF oluşturma başladı:', order.productType);
      
      // 1. Template PDF'i yükle
      const templatePath = this.templates[order.productType];
      if (!templatePath) {
        throw new Error(`${order.productType} için template bulunamadı`);
      }

      const templateBytes = await this.loadTemplate(templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);
      
      // 2. Font yükle
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // 3. İlk sayfayı al
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      console.log(`📄 PDF boyutları: ${width}x${height}`);
      
      // 4. Sipariş bilgilerini ekle
      await this.addOrderInfo(firstPage, order, font, boldFont);
      
      // 5. Müşteri bilgilerini ekle
      await this.addCustomerInfo(firstPage, order.customer, font, boldFont);
      
      // 6. Ölçüleri ekle
      await this.addMeasurements(firstPage, measurements, font, boldFont, order.productType);
      
      // 7. Özelleştirmeleri ekle
      await this.addCustomizations(firstPage, order, font, boldFont);
      
      // 8. PDF'i serialize et
      const pdfBytes = await pdfDoc.save();
      
      console.log('✅ PDF başarıyla oluşturuldu');
      return pdfBytes;
      
    } catch (error) {
      console.error('❌ PDF oluşturma hatası:', error);
      throw error;
    }
  }

  /**
   * Template PDF'i yükle
   */
  async loadTemplate(templatePath) {
    try {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Template yüklenemedi: ${response.status}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Template yükleme hatası:', error);
      throw error;
    }
  }

  /**
   * Türkçe karakterleri ASCII'ye çevir
   */
  sanitizeText(text) {
    if (!text) return '';
    return text
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'i')
      .replace(/Ğ/g, 'G')
      .replace(/ğ/g, 'g')
      .replace(/Ü/g, 'U')
      .replace(/ü/g, 'u')
      .replace(/Ş/g, 'S')
      .replace(/ş/g, 's')
      .replace(/Ö/g, 'O')
      .replace(/ö/g, 'o')
      .replace(/Ç/g, 'C')
      .replace(/ç/g, 'c');
  }

  /**
   * Sipariş bilgilerini PDF'e ekle
   */
  async addOrderInfo(page, order, font, boldFont) {
    const { width, height } = page.getSize();
    
    // Başlık
    page.drawText(this.sanitizeText('SIPARIS PATTERN DOKUMANI'), {
      x: 50,
      y: height - 50,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    // Sipariş bilgileri
    const orderInfo = [
      `Siparis No: ${order.id}`,
      `Urun Tipi: ${this.sanitizeText(order.productType)}`,
      `Siparis Tarihi: ${new Date(order.orderDate).toLocaleDateString('tr-TR')}`,
      `Teslim Tarihi: ${order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString('tr-TR') : 'Belirtilmemis'}`,
      `Durum: ${this.sanitizeText(this.getStatusText(order.status))}`,
      `Toplam Fiyat: ${order.totalPrice ? order.totalPrice + ' TL' : 'Belirtilmemis'}`
    ];
    
    let yPosition = height - 80;
    orderInfo.forEach(info => {
      page.drawText(this.sanitizeText(info), {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 15;
    });
  }

  /**
   * Müşteri bilgilerini PDF'e ekle
   */
  async addCustomerInfo(page, customer, font, boldFont) {
    const { width, height } = page.getSize();
    
    // Müşteri başlığı
    page.drawText(this.sanitizeText('MUSTERI BILGILERI'), {
      x: 300,
      y: height - 50,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    // Müşteri bilgileri
    const customerInfo = [
      `Ad Soyad: ${this.sanitizeText(customer.firstName)} ${this.sanitizeText(customer.lastName)}`,
      `Telefon: ${customer.phone || 'Belirtilmemis'}`,
      `E-posta: ${customer.email || 'Belirtilmemis'}`,
      `Boy: ${customer.height ? customer.height + ' cm' : 'Belirtilmemis'}`,
      `Kilo: ${customer.weight ? customer.weight + ' kg' : 'Belirtilmemis'}`,
      `Adres: ${this.sanitizeText(customer.address) || 'Belirtilmemis'}`
    ];
    
    let yPosition = height - 80;
    customerInfo.forEach(info => {
      page.drawText(this.sanitizeText(info), {
        x: 300,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 15;
    });
  }

  /**
   * Ölçüleri PDF'e ekle
   */
  async addMeasurements(page, measurements, font, boldFont, productType) {
    const { width, height } = page.getSize();
    
    // Ölçüler başlığı
    page.drawText(this.sanitizeText('OLCULER'), {
      x: 50,
      y: height - 250,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    // Measurements verisini normalize et
    let measurementArray = [];
    if (measurements && measurements.data && Array.isArray(measurements.data)) {
      measurementArray = measurements.data;
    } else if (Array.isArray(measurements)) {
      measurementArray = measurements;
    }
    
    if (!measurementArray || measurementArray.length === 0) {
      page.drawText(this.sanitizeText('Olcu bilgisi bulunamadi'), {
        x: 50,
        y: height - 280,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
      return;
    }
    
    // Ölçüleri listele
    let yPosition = height - 280;
    let xPosition = 50;
    let columnCount = 0;
    
    measurementArray.forEach(measurement => {
      const measurementText = `${this.sanitizeText(measurement.regionName)}: ${measurement.value} ${measurement.unit}`;
      
      page.drawText(this.sanitizeText(measurementText), {
        x: xPosition,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0, 0, 0)
      });
      
      columnCount++;
      if (columnCount % 2 === 0) {
        // İkinci sütun
        xPosition = 300;
        yPosition -= 15;
      } else {
        // İlk sütun
        xPosition = 50;
      }
      
      if (columnCount % 4 === 0) {
        yPosition -= 5; // Satır arası boşluk
        xPosition = 50;
      }
    });
  }

  /**
   * Özelleştirmeleri PDF'e ekle
   */
  async addCustomizations(page, order, font, boldFont) {
    const { width, height } = page.getSize();
    
    // Özelleştirmeler başlığı
    page.drawText(this.sanitizeText('OZELLESTIRMELER'), {
      x: 50,
      y: height - 450,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    const customizations = this.getCustomizationsForProduct(order);
    
    if (customizations.length === 0) {
      page.drawText(this.sanitizeText('Ozellestirme bilgisi bulunamadi'), {
        x: 50,
        y: height - 480,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
      return;
    }
    
    let yPosition = height - 480;
    customizations.forEach(customization => {
      page.drawText(this.sanitizeText(customization), {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 15;
    });
    
    // Notlar
    if (order.notes) {
      page.drawText(this.sanitizeText('NOTLAR:'), {
        x: 50,
        y: yPosition - 20,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      
      page.drawText(this.sanitizeText(order.notes), {
        x: 50,
        y: yPosition - 40,
        size: 9,
        font: font,
        color: rgb(0, 0, 0)
      });
    }
  }

  /**
   * Ürün tipine göre özelleştirmeleri getir
   */
  getCustomizationsForProduct(order) {
    const customizations = [];
    
    switch (order.productType) {
      case 'GÖMLEK':
        if (order.collarType) customizations.push(this.sanitizeText(`Yaka Tipi: ${this.getDisplayName('collarType', order.collarType)}`));
        if (order.sleeveType) customizations.push(this.sanitizeText(`Kol Tipi: ${this.getDisplayName('sleeveType', order.sleeveType)}`));
        break;
        
      case 'PANTOLON':
        if (order.waistType) customizations.push(this.sanitizeText(`Bel Tipi: ${this.getDisplayName('waistType', order.waistType)}`));
        if (order.pleatType) customizations.push(this.sanitizeText(`Pile Tipi: ${this.getDisplayName('pleatType', order.pleatType)}`));
        if (order.legType) customizations.push(this.sanitizeText(`Paca Tipi: ${this.getDisplayName('legType', order.legType)}`));
        break;
        
      case 'CEKET':
        if (order.buttonType) customizations.push(this.sanitizeText(`Dugme Tipi: ${this.getDisplayName('buttonType', order.buttonType)}`));
        if (order.pocketType) customizations.push(this.sanitizeText(`Cep Tipi: ${this.getDisplayName('pocketType', order.pocketType)}`));
        if (order.ventType) customizations.push(this.sanitizeText(`Yirtmac Tipi: ${this.getDisplayName('ventType', order.ventType)}`));
        if (order.backType) customizations.push(this.sanitizeText(`Sirt Tipi: ${this.getDisplayName('backType', order.backType)}`));
        break;
    }
    
    return customizations;
  }

  /**
   * Enum değerlerini görüntü adlarına çevir
   */
  getDisplayName(type, value) {
    const displayNames = {
      collarType: {
        'MONO': 'Mono Yaka',
        'KIRLANGIC': 'Kirlangic Yaka',
        'HAKIM': 'Hakim Yaka',
        'SAL': 'Sal Yaka'
      },
      sleeveType: {
        'VATKALI': 'Vatkali Kol',
        'VOTKASIZ': 'Votkasiz Kol',
        'BUZGULU': 'Buzgulu Kol'
      },
      waistType: {
        'DUSUK_BEL': 'Dusuk Bel',
        'ARA_BEL': 'Ara Bel',
        'YUKSEK_BEL': 'Yuksek Bel'
      },
      pleatType: {
        'PILESIZ': 'Pilesiz',
        'TEK_PILE': 'Tek Pile',
        'CIFT_PILE': 'Cift Pile'
      },
      legType: {
        'DAR_PACA': 'Dar Paca',
        'KLASIK': 'Klasik',
        'BOL_PACA': 'Bol Paca'
      },
      buttonType: {
        'TEK_DUGME': 'Tek Dugme',
        'IKI_DUGME': 'Iki Dugme',
        'UC_DUGME': 'Uc Dugme',
        'DORT_DUGME': 'Dort Dugme'
      },
      pocketType: {
        'TEK_CEP': 'Tek Cep',
        'CIFT_CEP': 'Cift Cep',
        'FILO_CEP': 'Filo Cep',
        'EGIK_CEP': 'Egik Cep',
        'TORBA_CEP': 'Torba Cep',
        'KORUKLU_CEP': 'Koruklu Cep'
      },
      ventType: {
        'YIRTMACSIZ': 'Yirtmacsiz',
        'TEK_YIRTMAC': 'Tek Yirtmac',
        'CIFT_YIRTMAC': 'Cift Yirtmac'
      },
      backType: {
        'KORUKLU': 'Koruklu',
        'KORUKSUZ': 'Koruksuz',
        'ROBLI': 'Robli'
      }
    };
    
    return displayNames[type]?.[value] || value;
  }

  /**
   * Sipariş durumunu Türkçe'ye çevir
   */
  getStatusText(status) {
    const statusTexts = {
      'PREPARING': 'Hazirlaniyor',
      'CUTTING': 'Kesim Asamasinda',
      'SEWING': 'Dikim Asamasinda',
      'FITTING': 'Prova Asamasinda',
      'READY': 'Hazir',
      'DELIVERED': 'Teslim Edildi',
      'CANCELLED': 'Iptal Edildi'
    };
    
    return statusTexts[status] || status;
  }

  /**
   * PDF'i indir
   */
  downloadPDF(pdfBytes, filename) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Dosya adı oluştur
   */
  generateFilename(order) {
    const customerName = `${order.customer.firstName}_${order.customer.lastName}`;
    const productType = order.productType;
    const orderNumber = order.id;
    const date = new Date().toISOString().split('T')[0];
    
    return `${customerName}_${productType}_${orderNumber}_Pattern_${date}.pdf`;
  }
}

export default new PDFService();
