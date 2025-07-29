import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

class AestheticPdfService {
  constructor() {
    // Renk paleti
    this.colors = {
      primary: rgb(0.2, 0.4, 0.8),      // Mavi
      secondary: rgb(0.8, 0.2, 0.4),    // Kırmızı
      accent: rgb(0.9, 0.6, 0.1),       // Turuncu
      dark: rgb(0.2, 0.2, 0.2),         // Koyu gri
      light: rgb(0.95, 0.95, 0.95),     // Açık gri
      white: rgb(1, 1, 1),              // Beyaz
      success: rgb(0.2, 0.7, 0.3),      // Yeşil
      text: rgb(0.3, 0.3, 0.3)          // Metin gri
    };
  }

  /**
   * Estetik PDF oluşturma
   */
  async generatePatternPDF(order, measurements) {
    try {
      console.log('🎨 Estetik PDF oluşturma başladı:', order.productType);
      
      // 1. Yeni PDF oluştur
      const pdfDoc = await PDFDocument.create();
      
      // 2. Font'ları yükle
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // 3. Sayfa ekle
      const page = pdfDoc.addPage([595, 842]); // A4 boyutu
      const { width, height } = page.getSize();
      
      console.log(`📄 PDF boyutları: ${width}x${height}`);
      
      // 4. Header oluştur
      await this.createHeader(page, order, font, boldFont, width, height);
      
      // 5. Ana içerik alanları
      await this.createMainContent(page, order, measurements, font, boldFont, width, height);
      
      // 6. Footer oluştur
      await this.createFooter(page, order, font, width, height);
      
      // 7. Dekoratif elementler
      await this.addDecorations(page, width, height);
      
      // 8. PDF'i serialize et
      const pdfBytes = await pdfDoc.save();
      
      console.log('✅ Estetik PDF başarıyla oluşturuldu');
      return pdfBytes;
      
    } catch (error) {
      console.error('❌ Estetik PDF oluşturma hatası:', error);
      throw error;
    }
  }

  /**
   * Header bölümü oluştur
   */
  async createHeader(page, order, font, boldFont, width, height) {
    // Header arka plan
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: this.colors.primary
    });
    
    // Gradient efekti için ikinci katman
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 60,
      color: this.colors.primary,
      opacity: 0.8
    });
    
    // Logo placeholder
    page.drawRectangle({
      x: 40,
      y: height - 100,
      width: 80,
      height: 60,
      color: this.colors.white,
      opacity: 0.9
    });
    
    page.drawText('ERDAL', {
      x: 50,
      y: height - 70,
      size: 14,
      font: boldFont,
      color: this.colors.primary
    });
    
    page.drawText('GUDA', {
      x: 50,
      y: height - 85,
      size: 12,
      font: font,
      color: this.colors.primary
    });
    
    // Ana başlık
    page.drawText(this.sanitizeText('PATTERN DOKUMANI'), {
      x: 150,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: this.colors.white
    });
    
    page.drawText(this.sanitizeText(`${order.productType} PATTERN`), {
      x: 150,
      y: height - 75,
      size: 16,
      font: font,
      color: this.colors.white,
      opacity: 0.9
    });
    
    // Sipariş numarası (sağ üst)
    page.drawRectangle({
      x: width - 150,
      y: height - 90,
      width: 120,
      height: 40,
      color: this.colors.accent
    });
    
    page.drawText(`SIPARIS #${order.id}`, {
      x: width - 140,
      y: height - 75,
      size: 12,
      font: boldFont,
      color: this.colors.white
    });
    
    page.drawText(new Date().toLocaleDateString('tr-TR'), {
      x: width - 140,
      y: height - 90,
      size: 10,
      font: font,
      color: this.colors.white
    });
  }

  /**
   * Ana içerik alanları oluştur
   */
  async createMainContent(page, order, measurements, font, boldFont, width, height) {
    const startY = height - 150;
    
    // Sol kolon - Müşteri bilgileri
    await this.createCustomerSection(page, order.customer, font, boldFont, 40, startY);
    
    // Orta kolon - Ölçüler
    await this.createMeasurementsSection(page, measurements, font, boldFont, 220, startY);
    
    // Sağ kolon - Özelleştirmeler
    await this.createCustomizationsSection(page, order, font, boldFont, 400, startY);
  }

  /**
   * Müşteri bilgileri bölümü
   */
  async createCustomerSection(page, customer, font, boldFont, x, y) {
    // Başlık kutusu
    page.drawRectangle({
      x: x,
      y: y,
      width: 160,
      height: 30,
      color: this.colors.secondary
    });
    
    page.drawText(this.sanitizeText('MUSTERI BILGILERI'), {
      x: x + 10,
      y: y + 10,
      size: 12,
      font: boldFont,
      color: this.colors.white
    });
    
    // İçerik kutusu
    page.drawRectangle({
      x: x,
      y: y - 180,
      width: 160,
      height: 180,
      color: this.colors.white,
      borderColor: this.colors.light,
      borderWidth: 1
    });
    
    // Müşteri bilgileri
    const customerInfo = [
      { label: 'Ad Soyad:', value: `${customer.firstName} ${customer.lastName}` },
      { label: 'Telefon:', value: customer.phone || 'Belirtilmemis' },
      { label: 'E-posta:', value: customer.email || 'Belirtilmemis' },
      { label: 'Boy:', value: customer.height ? `${customer.height} cm` : 'Belirtilmemis' },
      { label: 'Kilo:', value: customer.weight ? `${customer.weight} kg` : 'Belirtilmemis' }
    ];
    
    let yPos = y - 20;
    customerInfo.forEach(info => {
      // Label
      page.drawText(this.sanitizeText(info.label), {
        x: x + 10,
        y: yPos,
        size: 9,
        font: boldFont,
        color: this.colors.dark
      });
      
      // Value
      page.drawText(this.sanitizeText(info.value), {
        x: x + 10,
        y: yPos - 12,
        size: 9,
        font: font,
        color: this.colors.text
      });
      
      yPos -= 30;
    });
  }

  /**
   * Ölçüler bölümü
   */
  async createMeasurementsSection(page, measurements, font, boldFont, x, y) {
    // Başlık kutusu
    page.drawRectangle({
      x: x,
      y: y,
      width: 160,
      height: 30,
      color: this.colors.success
    });
    
    page.drawText(this.sanitizeText('OLCULER'), {
      x: x + 10,
      y: y + 10,
      size: 12,
      font: boldFont,
      color: this.colors.white
    });
    
    // İçerik kutusu
    page.drawRectangle({
      x: x,
      y: y - 180,
      width: 160,
      height: 180,
      color: this.colors.white,
      borderColor: this.colors.light,
      borderWidth: 1
    });
    
    // Ölçüler
    const measurementArray = Array.isArray(measurements) ? measurements : (measurements?.data || []);
    
    if (measurementArray.length === 0) {
      page.drawText(this.sanitizeText('Olcu bilgisi bulunamadi'), {
        x: x + 10,
        y: y - 30,
        size: 10,
        font: font,
        color: this.colors.text,
        opacity: 0.7
      });
    } else {
      let yPos = y - 20;
      measurementArray.slice(0, 8).forEach(measurement => {
        // Ölçü adı
        page.drawText(this.sanitizeText(measurement.regionName), {
          x: x + 10,
          y: yPos,
          size: 9,
          font: boldFont,
          color: this.colors.dark
        });
        
        // Ölçü değeri
        page.drawText(`${measurement.value} ${measurement.unit}`, {
          x: x + 120,
          y: yPos,
          size: 9,
          font: font,
          color: this.colors.primary
        });
        
        // Ayırıcı çizgi
        page.drawLine({
          start: { x: x + 10, y: yPos - 5 },
          end: { x: x + 150, y: yPos - 5 },
          thickness: 0.5,
          color: this.colors.light
        });
        
        yPos -= 20;
      });
    }
  }

  /**
   * Özelleştirmeler bölümü
   */
  async createCustomizationsSection(page, order, font, boldFont, x, y) {
    // Başlık kutusu
    page.drawRectangle({
      x: x,
      y: y,
      width: 160,
      height: 30,
      color: this.colors.accent
    });
    
    page.drawText(this.sanitizeText('OZELLESTIRMELER'), {
      x: x + 10,
      y: y + 10,
      size: 12,
      font: boldFont,
      color: this.colors.white
    });
    
    // İçerik kutusu
    page.drawRectangle({
      x: x,
      y: y - 180,
      width: 160,
      height: 180,
      color: this.colors.white,
      borderColor: this.colors.light,
      borderWidth: 1
    });
    
    // Özelleştirmeler
    const customizations = this.getCustomizationsForProduct(order);
    
    if (customizations.length === 0) {
      page.drawText(this.sanitizeText('Ozellestirme bulunamadi'), {
        x: x + 10,
        y: y - 30,
        size: 10,
        font: font,
        color: this.colors.text,
        opacity: 0.7
      });
    } else {
      let yPos = y - 20;
      customizations.forEach(customization => {
        page.drawText(this.sanitizeText(customization), {
          x: x + 10,
          y: yPos,
          size: 9,
          font: font,
          color: this.colors.text
        });
        
        yPos -= 15;
      });
    }
    
    // Durum badge'i
    const statusColor = this.getStatusColor(order.status);
    page.drawRectangle({
      x: x + 10,
      y: y - 160,
      width: 140,
      height: 25,
      color: statusColor
    });
    
    page.drawText(this.sanitizeText(`DURUM: ${this.getStatusText(order.status)}`), {
      x: x + 20,
      y: y - 150,
      size: 10,
      font: boldFont,
      color: this.colors.white
    });
  }

  /**
   * Footer oluştur
   */
  async createFooter(page, order, font, width, height) {
    // Footer arka plan
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 60,
      color: this.colors.dark
    });
    
    // Footer text
    page.drawText(this.sanitizeText('Erdal Guda Terzilik - Profesyonel Terzi Hizmetleri'), {
      x: 40,
      y: 35,
      size: 12,
      font: font,
      color: this.colors.white
    });
    
    page.drawText(this.sanitizeText(`Siparis Tarihi: ${new Date(order.orderDate).toLocaleDateString('tr-TR')} | Dokuman Tarihi: ${new Date().toLocaleDateString('tr-TR')}`), {
      x: 40,
      y: 15,
      size: 9,
      font: font,
      color: this.colors.light
    });
    
    // QR kod placeholder
    page.drawRectangle({
      x: width - 80,
      y: 10,
      width: 40,
      height: 40,
      color: this.colors.white
    });
    
    page.drawText('QR', {
      x: width - 68,
      y: 27,
      size: 12,
      font: font,
      color: this.colors.dark
    });
  }

  /**
   * Dekoratif elementler ekle
   */
  async addDecorations(page, width, height) {
    // Sol kenar dekoratif çizgiler
    for (let i = 0; i < 5; i++) {
      page.drawLine({
        start: { x: 20, y: height - 200 - (i * 40) },
        end: { x: 30, y: height - 200 - (i * 40) },
        thickness: 3,
        color: this.colors.primary,
        opacity: 0.3
      });
    }
    
    // Sağ kenar dekoratif daireler
    for (let i = 0; i < 3; i++) {
      page.drawCircle({
        x: width - 25,
        y: height - 300 - (i * 60),
        size: 8,
        color: this.colors.accent,
        opacity: 0.2
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
        if (order.collarType) customizations.push(`Yaka: ${order.collarType}`);
        if (order.sleeveType) customizations.push(`Kol: ${order.sleeveType}`);
        break;
        
      case 'PANTOLON':
        if (order.waistType) customizations.push(`Bel: ${order.waistType}`);
        if (order.pleatType) customizations.push(`Pile: ${order.pleatType}`);
        if (order.legType) customizations.push(`Paca: ${order.legType}`);
        break;
        
      case 'CEKET':
        if (order.buttonType) customizations.push(`Dugme: ${order.buttonType}`);
        if (order.pocketType) customizations.push(`Cep: ${order.pocketType}`);
        if (order.ventType) customizations.push(`Yirtmac: ${order.ventType}`);
        break;
    }
    
    return customizations;
  }

  /**
   * Durum rengini getir
   */
  getStatusColor(status) {
    const colors = {
      'PREPARING': this.colors.accent,
      'CUTTING': rgb(0.9, 0.5, 0.1),
      'SEWING': rgb(0.1, 0.5, 0.9),
      'FITTING': rgb(0.5, 0.1, 0.9),
      'READY': this.colors.success,
      'DELIVERED': rgb(0.2, 0.8, 0.2),
      'CANCELLED': this.colors.secondary
    };
    
    return colors[status] || this.colors.dark;
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
    
    return `${customerName}_${productType}_${orderNumber}_Aesthetic_${date}.pdf`;
  }
}

export default new AestheticPdfService();
