import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

class TemplateOverlayService {
  constructor() {
    this.templates = {
      'CEKET': '/pdf-patterns/ceket-pattern.pdf',
      'GÖMLEK': '/pdf-patterns/gomlek-pattern.pdf', 
      'PANTOLON': '/pdf-patterns/pantolon-pattern.pdf'
    };
  }

  /**
   * Template PDF üzerine sipariş verilerini overlay yapma
   */
  async generatePatternPDF(order, measurements) {
    try {
      console.log('🎨 Template Overlay PDF oluşturma başladı:', order.productType);
      
      // 1. Mevcut template PDF'i yükle
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
      
      console.log(`📄 Template PDF boyutları: ${width}x${height}`);
      
      // 4. Overlay bilgi kutusu oluştur (sağ üst köşe)
      await this.addInfoOverlay(firstPage, order, measurements, font, boldFont);
      
      // 5. Watermark ekle (alt kısım)
      await this.addWatermark(firstPage, order, font);
      
      // 6. PDF'i serialize et
      const pdfBytes = await pdfDoc.save();
      
      console.log('✅ Template Overlay PDF başarıyla oluşturuldu');
      return pdfBytes;
      
    } catch (error) {
      console.error('❌ Template Overlay PDF oluşturma hatası:', error);
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
   * Bilgi overlay'i ekle (sağ üst köşe)
   */
  async addInfoOverlay(page, order, measurements, font, boldFont) {
    const { width, height } = page.getSize();
    
    // Beyaz arka plan kutusu
    page.drawRectangle({
      x: width - 250,
      y: height - 200,
      width: 230,
      height: 180,
      color: rgb(1, 1, 1),
      opacity: 0.9,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 1
    });
    
    // Başlık
    page.drawText(this.sanitizeText('SIPARIS BILGILERI'), {
      x: width - 240,
      y: height - 30,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    // Sipariş bilgileri
    const orderInfo = [
      `No: ${order.id}`,
      `Musteri: ${this.sanitizeText(order.customer.firstName)} ${this.sanitizeText(order.customer.lastName)}`,
      `Urun: ${this.sanitizeText(order.productType)}`,
      `Tarih: ${new Date(order.orderDate).toLocaleDateString('tr-TR')}`,
      `Durum: ${this.sanitizeText(this.getStatusText(order.status))}`
    ];
    
    let yPos = height - 50;
    orderInfo.forEach(info => {
      page.drawText(this.sanitizeText(info), {
        x: width - 240,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0, 0, 0)
      });
      yPos -= 15;
    });
    
    // Ölçüler (eğer varsa)
    if (measurements && measurements.length > 0) {
      page.drawText(this.sanitizeText('OLCULER:'), {
        x: width - 240,
        y: yPos - 10,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0)
      });
      
      yPos -= 25;
      const measurementArray = Array.isArray(measurements) ? measurements : (measurements.data || []);
      measurementArray.slice(0, 4).forEach(measurement => {
        page.drawText(this.sanitizeText(`${measurement.regionName}: ${measurement.value}${measurement.unit}`), {
          x: width - 240,
          y: yPos,
          size: 8,
          font: font,
          color: rgb(0, 0, 0)
        });
        yPos -= 12;
      });
    }
  }

  /**
   * Watermark ekle (alt kısım)
   */
  async addWatermark(page, order, font) {
    const { width, height } = page.getSize();
    
    // Alt bilgi çubuğu
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 40,
      color: rgb(0.95, 0.95, 0.95),
      opacity: 0.8
    });
    
    // Watermark text
    const watermarkText = `Erdal Guda Terzilik - Siparis #${order.id} - ${new Date().toLocaleDateString('tr-TR')}`;
    page.drawText(this.sanitizeText(watermarkText), {
      x: 20,
      y: 15,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    
    // QR kod placeholder (sağ alt)
    page.drawRectangle({
      x: width - 50,
      y: 5,
      width: 30,
      height: 30,
      color: rgb(0.8, 0.8, 0.8),
      borderColor: rgb(0.5, 0.5, 0.5),
      borderWidth: 1
    });
    
    page.drawText('QR', {
      x: width - 42,
      y: 17,
      size: 8,
      font: font,
      color: rgb(0, 0, 0)
    });
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
    
    return `${customerName}_${productType}_${orderNumber}_Template_${date}.pdf`;
  }
}

export default new TemplateOverlayService();
