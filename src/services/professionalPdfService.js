import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

class ProfessionalPdfService {
  constructor() {
    this.pageWidth = 595;
    this.pageHeight = 842;
    this.margin = 40;
  }

  // Türkçe karakterleri ASCII'ye çevir
  sanitizeText(text) {
    if (!text) return '';
    return text.toString()
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C');
  }

  async generatePatternPDF(order, measurements) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Modern ve profesyonel PDF tasarımı
    await this.drawModernLayout(page, font, boldFont, order, measurements, pdfDoc);

    return await pdfDoc.save();
  }

  async drawModernLayout(page, font, boldFont, order, measurements, pdfDoc) {
    const leftColumnWidth = 280;
    const rightColumnWidth = 250;
    const columnGap = 25;
    
    // HEADER - Modern ve temiz
    await this.drawModernHeader(page, font, boldFont, order);
    
    // SOL KOLON - Müşteri bilgileri ve ölçüler
    await this.drawLeftColumn(page, font, boldFont, order, measurements, leftColumnWidth);
    
    // SAĞ KOLON - Pattern resmi
    await this.drawRightColumn(page, font, boldFont, order, pdfDoc, leftColumnWidth + columnGap, rightColumnWidth);
    
    // FOOTER - Notlar ve imza alanı
    await this.drawModernFooter(page, font, boldFont, order);
  }

  async drawModernHeader(page, font, boldFont, order) {
    const headerHeight = 80;
    const yStart = this.pageHeight - this.margin;
    
    // Üst çizgi - marka rengi
    page.drawRectangle({
      x: 0,
      y: yStart - 5,
      width: this.pageWidth,
      height: 5,
      color: rgb(0.2, 0.3, 0.5), // Koyu mavi
    });
    
    // Başlık alanı arka planı
    page.drawRectangle({
      x: 0,
      y: yStart - headerHeight,
      width: this.pageWidth,
      height: headerHeight - 5,
      color: rgb(0.98, 0.98, 0.99), // Çok açık gri
    });
    
    // SIPARIS PATTERN DOKUMANI - Ana başlık
    page.drawText('SIPARIS PATTERN DOKUMANI', {
      x: this.margin,
      y: yStart - 25,
      size: 18,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    
    // MUSTERI BILGILERI - Alt başlık
    page.drawText('MUSTERI BILGILERI', {
      x: this.pageWidth - this.margin - 150,
      y: yStart - 25,
      size: 12,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // Sipariş bilgileri - kompakt
    const orderInfo = [
      `Siparis No: ${order.id || 'N/A'}`,
      `Urun Tipi: ${this.getProductTypeDisplay(order.productType)}`,
      `Siparis Tarihi: ${this.formatDate(order.orderDate)}`,
      `Teslim Tarihi: ${this.formatDate(order.estimatedDeliveryDate)}`,
      `Durum: ${this.getStatusDisplay(order.status)}`,
      `Toplam Fiyat: ${order.totalPrice || 'Belirtilmemis'} TL`
    ];
    
    orderInfo.forEach((info, index) => {
      const xPos = index < 3 ? this.margin : this.margin + 280;
      const yPos = yStart - 45 - ((index % 3) * 12);
      
      page.drawText(info, {
        x: xPos,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });
  }

  async drawLeftColumn(page, font, boldFont, order, measurements, columnWidth) {
    let yPos = this.pageHeight - this.margin - 100; // Header'dan sonra başla
    
    // MÜŞTERİ BİLGİLERİ BÖLÜMÜ
    yPos = await this.drawCustomerSection(page, font, boldFont, order, yPos, columnWidth);
    yPos -= 25;
    
    // ÖLÇÜLER BÖLÜMÜ
    yPos = await this.drawMeasurementsSection(page, font, boldFont, measurements, yPos, columnWidth);
    yPos -= 25;
    
    // ÖZELLEŞTİRMELER BÖLÜMÜ
    await this.drawCustomizationsSection(page, font, boldFont, order, yPos, columnWidth);
  }
  
  async drawCustomerSection(page, font, boldFont, order, yPos, columnWidth) {
    // Bölüm başlığı
    page.drawRectangle({
      x: this.margin,
      y: yPos - 20,
      width: columnWidth,
      height: 20,
      color: rgb(0.95, 0.95, 0.97),
    });
    
    page.drawText('MUSTERI BILGILERI', {
      x: this.margin + 10,
      y: yPos - 15,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    yPos -= 35;
    
    // Müşteri detayları - tablo formatında
    const customerData = [
      ['Ad Soyad:', `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`],
      ['Telefon:', order.customer?.phone || 'Belirtilmemis'],
      ['E-posta:', order.customer?.email || 'Belirtilmemis'],
      ['Boy:', order.customer?.height ? `${order.customer.height} cm` : 'Belirtilmemis'],
      ['Kilo:', order.customer?.weight ? `${order.customer.weight} kg` : 'Belirtilmemis'],
      ['Adres:', order.customer?.address || 'Belirtilmemis']
    ];
    
    customerData.forEach((row, index) => {
      // Label
      page.drawText(row[0], {
        x: this.margin + 10,
        y: yPos - (index * 16),
        size: 9,
        font: boldFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      
      // Value
      page.drawText(this.sanitizeText(row[1]), {
        x: this.margin + 80,
        y: yPos - (index * 16),
        size: 9,
        font: font,
        color: rgb(0.1, 0.1, 0.1),
      });
    });
    
    return yPos - (customerData.length * 16);
  }

  async drawMeasurementsSection(page, font, boldFont, measurements, yPos, columnWidth) {
    // Bölüm başlığı
    page.drawRectangle({
      x: this.margin,
      y: yPos - 20,
      width: columnWidth,
      height: 20,
      color: rgb(0.95, 0.95, 0.97),
    });
    
    page.drawText('OLCULER', {
      x: this.margin + 10,
      y: yPos - 15,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    yPos -= 35;
    
    const measurementMap = this.createMeasurementMap(measurements);
    
    if (Object.keys(measurementMap).length === 0) {
      page.drawText('Veri bulunamadi', {
        x: this.margin + 10,
        y: yPos,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
      return yPos - 20;
    }
    
    // Ölçüleri 2 kolonlu tablo formatında göster
    const measurements_array = Object.entries(measurementMap).filter(([name, value]) => 
      value && value !== '' && value !== null && value !== undefined
    );
    
    const itemsPerColumn = Math.ceil(measurements_array.length / 2);
    
    measurements_array.forEach(([name, value], index) => {
      const isRightColumn = index >= itemsPerColumn;
      const rowIndex = isRightColumn ? index - itemsPerColumn : index;
      
      const xOffset = isRightColumn ? 140 : 0;
      const yOffset = rowIndex * 14;
      
      // Ölçü adı
      page.drawText(this.sanitizeText(name), {
        x: this.margin + 10 + xOffset,
        y: yPos - yOffset,
        size: 8,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3),
      });
      
      // Ölçü değeri
      page.drawText(`${value}`, {
        x: this.margin + 80 + xOffset,
        y: yPos - yOffset,
        size: 8,
        font: font,
        color: rgb(0.1, 0.1, 0.1),
      });
    });
    
    return yPos - (itemsPerColumn * 14);
  }
  
  async drawCustomizationsSection(page, font, boldFont, order, yPos, columnWidth) {
    // Bölüm başlığı
    page.drawRectangle({
      x: this.margin,
      y: yPos - 20,
      width: columnWidth,
      height: 20,
      color: rgb(0.95, 0.95, 0.97),
    });
    
    page.drawText('OZELLESTIRMELER', {
      x: this.margin + 10,
      y: yPos - 15,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    yPos -= 35;
    
    const features = this.getOrderFeatures(order);
    
    features.forEach((feature, index) => {
      page.drawText(`• ${this.sanitizeText(feature)}`, {
        x: this.margin + 10,
        y: yPos - (index * 12),
        size: 8,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });
    
    return yPos - (features.length * 12);
  }

  // Ölçü haritası oluştur (DUPLICATE'SUZZ)
  createMeasurementMap(measurements) {
    console.log('🔍 Measurements data:', measurements);
    const measurementMap = new Map(); // Map kullanarak duplicate'ları önle
    
    if (measurements && Array.isArray(measurements)) {
      measurements.forEach(m => {
        if (m.regionName && m.value && !measurementMap.has(m.regionName)) {
          console.log(`📏 Adding unique measurement: ${m.regionName} = ${m.value}`);
          measurementMap.set(m.regionName, m.value);
        }
      });
    } else if (measurements && typeof measurements === 'object') {
      // Eğer measurements bir response object ise
      const measurementArray = measurements.data || measurements.measurements || [];
      console.log('📊 Measurements from response object:', measurementArray);
      if (Array.isArray(measurementArray)) {
        measurementArray.forEach(m => {
          if (m.regionName && m.value && !measurementMap.has(m.regionName)) {
            console.log(`📏 Adding unique measurement: ${m.regionName} = ${m.value}`);
            measurementMap.set(m.regionName, m.value);
          }
        });
      }
    }
    
    // Map'i normal object'e çevir
    const finalMap = {};
    measurementMap.forEach((value, key) => {
      finalMap[key] = value;
      // Sanitized versiyonu da ekle ama sadece farklıysa
      const sanitizedKey = this.sanitizeText(key);
      if (sanitizedKey !== key && !finalMap[sanitizedKey]) {
        finalMap[sanitizedKey] = value;
      }
    });
    
    console.log('🗺️ Final measurement map (no duplicates):', finalMap);
    return finalMap;
  }

  // Sipariş özelliklerini çıkar - TÜM orderTypes verileri
  getOrderFeatures(order) {
    const features = [];
    
    // TEMEL ÜRÜN BİLGİLERİ
    if (order.productType) {
      features.push(`URUN TIPI: ${this.sanitizeText(order.productType.toUpperCase())}`);
    }
    
    // GÖMLEK ÖZELLİKLERİ
    if (order.collarType) {
      features.push(`YAKA TIPI: ${this.sanitizeText(order.collarType.toUpperCase())}`);
    }
    
    if (order.sleeveType) {
      features.push(`KOL TIPI: ${this.sanitizeText(order.sleeveType.toUpperCase())}`);
    }
    
    if (order.buttonType) {
      features.push(`DUGME TIPI: ${this.sanitizeText(order.buttonType.toUpperCase())}`);
    }
    
    if (order.pocketType) {
      features.push(`CEP TIPI: ${this.sanitizeText(order.pocketType.toUpperCase())}`);
    }
    
    if (order.ventType) {
      features.push(`YIRTMAC TIPI: ${this.sanitizeText(order.ventType.toUpperCase())}`);
    }
    
    // PANTOLON ÖZELLİKLERİ
    if (order.waistType) {
      features.push(`BEL TIPI: ${this.sanitizeText(order.waistType.toUpperCase())}`);
    }
    
    if (order.pleatType) {
      features.push(`PILE TIPI: ${this.sanitizeText(order.pleatType.toUpperCase())}`);
    }
    
    if (order.legType) {
      features.push(`BACAK TIPI: ${this.sanitizeText(order.legType.toUpperCase())}`);
    }
    
    // CEKET ÖZELLİKLERİ
    if (order.backType) {
      features.push(`ARKA TIPI: ${this.sanitizeText(order.backType.toUpperCase())}`);
    }
    
    // KUMAŞ VE RENK BİLGİLERİ
    if (order.fabricType) {
      features.push(`KUMAS TIPI: ${this.sanitizeText(order.fabricType.toUpperCase())}`);
    }
    
    if (order.fabricColor) {
      features.push(`KUMAS RENGI: ${this.sanitizeText(order.fabricColor.toUpperCase())}`);
    }
    
    if (order.liningType) {
      features.push(`ASTAR TIPI: ${this.sanitizeText(order.liningType.toUpperCase())}`);
    }
    
    if (order.liningColor) {
      features.push(`ASTAR RENGI: ${this.sanitizeText(order.liningColor.toUpperCase())}`);
    }
    
    // EKSTRA ÖZELLİKLER
    if (order.extraFeatures && order.extraFeatures.length > 0) {
      features.push(`EKSTRA OZELLIKLER: ${this.sanitizeText(order.extraFeatures.join(', ').toUpperCase())}`);
    }
    
    // RENK VE DESEN BİLGİLERİ
    if (order.pattern) {
      features.push(`DESEN: ${this.sanitizeText(order.pattern.toUpperCase())}`);
    }
    
    if (order.stitchingType) {
      features.push(`DIKIM TIPI: ${this.sanitizeText(order.stitchingType.toUpperCase())}`);
    }
    
    // OZEL TALEPLER
    if (order.specialRequests) {
      features.push(`OZEL TALEPLER: ${this.sanitizeText(order.specialRequests.toUpperCase())}`);
    }
    
    // ACILIYET VE ONCELIK
    if (order.priority) {
      features.push(`ONCELIK: ${this.sanitizeText(order.priority.toUpperCase())}`);
    }
    
    if (order.urgency) {
      features.push(`ACILIYET: ${this.sanitizeText(order.urgency.toUpperCase())}`);
    }
    
    return features.length > 0 ? features.slice(0, 8) : ['STANDART OZELLIKLER']; // Maksimum 8 özellik
  }

  async drawRightColumn(page, font, boldFont, order, pdfDoc, xStart, columnWidth) {
    const yStart = this.pageHeight - this.margin - 100;
    
    // Pattern resmi bölümü başlığı
    page.drawRectangle({
      x: xStart,
      y: yStart - 20,
      width: columnWidth,
      height: 20,
      color: rgb(0.95, 0.95, 0.97),
    });
    
    page.drawText('PATTERN SABLONU', {
      x: xStart + 10,
      y: yStart - 15,
      size: 11,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    // Pattern resmi
    await this.drawPatternImage(page, font, boldFont, xStart, yStart - 40, order, pdfDoc, columnWidth);
  }
  
  async drawPatternImage(page, font, boldFont, x, y, order, pdfDoc, maxWidth) {
    try {
      const productType = order?.productType?.toLowerCase() || 'gomlek';
      let imagePath = '/ceket-gomlek-pattern-revize.png'; // Varsayılan
      
      if (productType.includes('pantolon') || productType.includes('pants')) {
        imagePath = '/pantolon-pattern-revize.png';
      }
      
      console.log(`🎨 Pattern resmi yükleniyor: ${imagePath}`);
      
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`Resim yüklenemedi: ${response.status}`);
      }
      
      const imageBytes = await response.arrayBuffer();
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Resmi sağ kolona sığacak şekilde boyutlandır
      const maxHeight = 400;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      // Resmi ortalayarak yerleştir
      const centerX = x + (maxWidth - scaledWidth) / 2;
      
      page.drawImage(image, {
        x: centerX,
        y: y - scaledHeight,
        width: scaledWidth,
        height: scaledHeight,
      });
      
      console.log('✅ Pattern resmi başarıyla eklendi!');
    } catch (error) {
      console.error('❌ Pattern resmi eklenirken hata:', error);
      
      // Hata durumunda placeholder
      page.drawRectangle({
        x: x + 10,
        y: y - 200,
        width: maxWidth - 20,
        height: 180,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });
      
      page.drawText('PATTERN RESMI', {
        x: x + maxWidth/2 - 40,
        y: y - 100,
        size: 10,
        font: boldFont,
        color: rgb(0.7, 0.7, 0.7),
      });
      
      page.drawText('YUKLENEMEDI', {
        x: x + maxWidth/2 - 35,
        y: y - 115,
        size: 10,
        font: font,
        color: rgb(0.7, 0.7, 0.7),
      });
    }
  }

  // NOT: Görsel yükleme fonksiyonları kaldırıldı
  // Artık sadece kullanıcı tarafından yüklenen görseller kullanılacak

  async drawProfessionalShirtImage(page, font, x, y, pdfDoc) {
    try {
      console.log('👕 Gömlek görseli ekleniyor...');
      
      // public klasöründen revize edilmiş gömlek görselini yükle
      const response = await fetch('/ceket-gomlek-pattern-revize.png');
      if (!response.ok) {
        throw new Error(`Gömlek görseli yüklenemedi: ${response.status}`);
      }
      
      const imageBytes = await response.arrayBuffer();
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Görseli maksimum boyutlarda çiz ve doğru konumlandır
      const maxWidth = 450;
      const maxHeight = 500;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      // Görseli PDF'e doğru konumda çiz
      page.drawImage(image, {
        x: x - 50, // Biraz sola kaydır
        y: y - scaledHeight + 50, // Biraz yukarı kaydır
        width: scaledWidth,
        height: scaledHeight,
      });
      
      console.log('✅ Gömlek görseli başarıyla eklendi!');
    } catch (error) {
      console.error('❌ Gömlek görseli eklenirken hata:', error);
      
      // Hata durumunda boş çerçeve çiz
      page.drawRectangle({
        x: x,
        y: y - 180,
        width: 180,
        height: 180,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });
      
      page.drawText('GÖRSEL YÜKLENEMEDİ', {
        x: x + 30,
        y: y - 100,
        size: 10,
        font: font,
        color: rgb(0.7, 0.7, 0.7),
      });
    }
  }

  async drawProfessionalPantsImage(page, font, x, y, pdfDoc) {
    try {
      console.log('👖 Pantolon görseli ekleniyor...');
      
      // public klasöründen revize edilmiş pantolon görselini yükle
      const response = await fetch('/pantolon-pattern-revize.png');
      if (!response.ok) {
        throw new Error(`Pantolon görseli yüklenemedi: ${response.status}`);
      }
      
      const imageBytes = await response.arrayBuffer();
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Görseli maksimum boyutlarda çiz ve doğru konumlandır
      const maxWidth = 450;
      const maxHeight = 500;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      // Görseli PDF'e doğru konumda çiz
      page.drawImage(image, {
        x: x - 50, // Biraz sola kaydır
        y: y - scaledHeight + 50, // Biraz yukarı kaydır
        width: scaledWidth,
        height: scaledHeight,
      });
      
      console.log('✅ Pantolon görseli başarıyla eklendi!');
    } catch (error) {
      console.error('❌ Pantolon görseli eklenirken hata:', error);
      
      // Hata durumunda boş çerçeve çiz
      page.drawRectangle({
        x: x,
        y: y - 180,
        width: 180,
        height: 180,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });
      
      page.drawText('GÖRSEL YÜKLENEMEDİ', {
        x: x + 30,
        y: y - 100,
        size: 10,
        font: font,
        color: rgb(0.7, 0.7, 0.7),
      });
    }
  }

  async drawTemplateShirt(page, font, x, y) {
    // Verdiğiniz gömlek template'ine uygun çizim
    const centerX = x + 90;
    
    // Çerçeve
    page.drawRectangle({
      x: x + 10,
      y: y - 180,
      width: 160,
      height: 160,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
      color: rgb(0.98, 0.98, 0.98),
    });
    
    // GOMLEK başlığı
    page.drawText('GOMLEK', {
      x: centerX - 25,
      y: y - 25,
      size: 12,
      font: font,
    });
    
    // YAKA
    page.drawText('YAKA', {
      x: centerX - 15,
      y: y - 45,
      size: 8,
      font: font,
    });
    
    // Gömlek ana şekli (verdiğiniz template'deki gibi)
    // Yaka çizgisi
    page.drawLine({
      start: { x: centerX - 30, y: y - 60 },
      end: { x: centerX + 30, y: y - 60 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sol omuz
    page.drawLine({
      start: { x: centerX - 30, y: y - 60 },
      end: { x: centerX - 50, y: y - 75 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sağ omuz  
    page.drawLine({
      start: { x: centerX + 30, y: y - 60 },
      end: { x: centerX + 50, y: y - 75 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sol kol
    page.drawLine({
      start: { x: centerX - 50, y: y - 75 },
      end: { x: centerX - 40, y: y - 150 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sağ kol
    page.drawLine({
      start: { x: centerX + 50, y: y - 75 },
      end: { x: centerX + 40, y: y - 150 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Gövde sol
    page.drawLine({
      start: { x: centerX - 40, y: y - 150 },
      end: { x: centerX - 25, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Gövde sağ
    page.drawLine({
      start: { x: centerX + 40, y: y - 150 },
      end: { x: centerX + 25, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Alt kenar
    page.drawLine({
      start: { x: centerX - 25, y: y - 160 },
      end: { x: centerX + 25, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Orta çizgi
    page.drawLine({
      start: { x: centerX, y: y - 60 },
      end: { x: centerX, y: y - 160 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Düğmeler
    for (let i = 0; i < 4; i++) {
      page.drawCircle({
        x: centerX,
        y: y - 80 - (i * 18),
        size: 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }
    
    // Ölçü etiketleri (template'deki pozisyonlarda)
    const labels = [
      { text: 'OMUZ', x: centerX - 60, y: y - 70, size: 7 },
      { text: 'PAZU', x: centerX - 65, y: y - 100, size: 7 },
      { text: 'KOL\nBOYU', x: centerX - 70, y: y - 120, size: 6 },
      { text: 'GOGUS', x: centerX + 35, y: y - 90, size: 7 },
      { text: 'DIRSEK', x: centerX + 55, y: y - 110, size: 7 },
      { text: 'BILEK', x: centerX + 55, y: y - 140, size: 7 },
      { text: 'BEL', x: centerX + 35, y: y - 120, size: 7 },
      { text: 'BASEN', x: centerX + 35, y: y - 140, size: 7 },
      { text: 'ETEK BOYU', x: centerX + 35, y: y - 155, size: 6 }
    ];
    
    labels.forEach(label => {
      page.drawText(label.text, {
        x: label.x,
        y: label.y,
        size: label.size,
        font: font,
      });
    });
  }
  
  async drawTemplatePants(page, font, x, y) {
    // Verdiğiniz pantolon template'ine uygun çizim
    const centerX = x + 90;
    
    // Çerçeve
    page.drawRectangle({
      x: x + 10,
      y: y - 180,
      width: 160,
      height: 160,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
      color: rgb(0.98, 0.98, 0.98),
    });
    
    // PANTOLON başlığı
    page.drawText('PANTOLON', {
      x: centerX - 30,
      y: y - 25,
      size: 12,
      font: font,
    });
    
    // Basit pantolon şekli
    // Bel çizgisi
    page.drawLine({
      start: { x: centerX - 25, y: y - 50 },
      end: { x: centerX + 25, y: y - 50 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sol bacak dış
    page.drawLine({
      start: { x: centerX - 25, y: y - 50 },
      end: { x: centerX - 30, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sağ bacak dış
    page.drawLine({
      start: { x: centerX + 25, y: y - 50 },
      end: { x: centerX + 30, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sol bacak iç
    page.drawLine({
      start: { x: centerX - 5, y: y - 50 },
      end: { x: centerX - 10, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sağ bacak iç
    page.drawLine({
      start: { x: centerX + 5, y: y - 50 },
      end: { x: centerX + 10, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Paça sol
    page.drawLine({
      start: { x: centerX - 30, y: y - 160 },
      end: { x: centerX - 10, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Paça sağ
    page.drawLine({
      start: { x: centerX + 10, y: y - 160 },
      end: { x: centerX + 30, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
  }

  async drawSimpleShirtFallback(page, font, x, y) {
    // GOMLEK başlığı (template'deki gibi)
    page.drawText('GOMLEK', {
      x: x + 70,
      y: y - 15,
      size: 12,
      font: font,
    });

    // YAKA etiket ve çizgi
    page.drawText('YAKA', {
      x: x + 85,
      y: y - 30,
      size: 8,
      font: font,
    });

    // Ana gömlek şekli - template'deki gibi basit ve temiz
    // Üst yaka çizgisi
    page.drawLine({
      start: { x: x + 70, y: y - 45 },
      end: { x: x + 110, y: y - 45 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Sol omuz
    page.drawLine({
      start: { x: x + 70, y: y - 45 },
      end: { x: x + 40, y: y - 60 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Sağ omuz
    page.drawLine({
      start: { x: x + 110, y: y - 45 },
      end: { x: x + 140, y: y - 60 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Sol kol
    page.drawLine({
      start: { x: x + 40, y: y - 60 },
      end: { x: x + 50, y: y - 160 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Sağ kol
    page.drawLine({
      start: { x: x + 140, y: y - 60 },
      end: { x: x + 130, y: y - 160 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Sol yan
    page.drawLine({
      start: { x: x + 50, y: y - 160 },
      end: { x: x + 65, y: y - 170 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Sağ yan
    page.drawLine({
      start: { x: x + 130, y: y - 160 },
      end: { x: x + 115, y: y - 170 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Alt kenar
    page.drawLine({
      start: { x: x + 65, y: y - 170 },
      end: { x: x + 115, y: y - 170 },
      thickness: 1.5,
      color: rgb(0, 0, 0),
    });

    // Orta çizgi (düğme hattı)
    page.drawLine({
      start: { x: x + 90, y: y - 45 },
      end: { x: x + 90, y: y - 170 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Düğmeler (template'deki gibi basit daireler)
    for (let i = 0; i < 4; i++) {
      page.drawCircle({
        x: x + 90,
        y: y - 70 - (i * 25),
        size: 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }

    // Ölçü etiketleri (template'deki pozisyonlarda)
    const labels = [
      { text: 'OMUZ', x: x + 20, y: y - 55, size: 8 },
      { text: 'PAZU', x: x + 20, y: y - 90, size: 8 },
      { text: 'KOL BOYU', x: x + 15, y: y - 120, size: 8 },
      { text: 'GOGUS', x: x + 95, y: y - 80, size: 8 },
      { text: 'DIRSEK', x: x + 145, y: y - 90, size: 8 },
      { text: 'BILEK', x: x + 145, y: y - 130, size: 8 },
      { text: 'BEL', x: x + 95, y: y - 110, size: 8 },
      { text: 'BASEN', x: x + 95, y: y - 140, size: 8 },
      { text: 'ETEK BOYU', x: x + 95, y: y - 165, size: 8 }
    ];

    labels.forEach(label => {
      page.drawText(label.text, {
        x: label.x,
        y: label.y,
        size: label.size,
        font: font,
      });
    });
  }

  async drawShirtImage(page, font, x, y) {
    // Gömlek başlığı
    page.drawText('GOMLEK', {
      x: x + 70,
      y: y - 15,
      size: 10,
      font: font,
    });

    // Yaka (V şekli)
    page.drawLine({
      start: { x: x + 85, y: y - 30 },
      end: { x: x + 90, y: y - 45 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 95, y: y - 30 },
      end: { x: x + 90, y: y - 45 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Gövde ana hatları
    page.drawLine({
      start: { x: x + 60, y: y - 45 },
      end: { x: x + 60, y: y - 140 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 120, y: y - 45 },
      end: { x: x + 120, y: y - 140 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 60, y: y - 140 },
      end: { x: x + 120, y: y - 140 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Omuz çizgileri
    page.drawLine({
      start: { x: x + 60, y: y - 45 },
      end: { x: x + 40, y: y - 65 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 120, y: y - 45 },
      end: { x: x + 140, y: y - 65 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Kollar
    page.drawLine({
      start: { x: x + 40, y: y - 65 },
      end: { x: x + 40, y: y - 110 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 140, y: y - 65 },
      end: { x: x + 140, y: y - 110 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Kol uçları
    page.drawLine({
      start: { x: x + 35, y: y - 110 },
      end: { x: x + 45, y: y - 110 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 135, y: y - 110 },
      end: { x: x + 145, y: y - 110 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Düğme çizgisi
    for (let i = 0; i < 5; i++) {
      page.drawCircle({
        x: x + 90,
        y: y - 60 - (i * 15),
        size: 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }
  }



  async drawPantsImage(page, font, x, y) {
    // Pantolon başlığı
    page.drawText('PANTOLON', {
      x: x + 65,
      y: y - 15,
      size: 10,
      font: font,
    });

    // Bel çizgisi
    page.drawLine({
      start: { x: x + 70, y: y - 30 },
      end: { x: x + 110, y: y - 30 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Sol bacak
    page.drawLine({
      start: { x: x + 70, y: y - 30 },
      end: { x: x + 75, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 90, y: y - 30 },
      end: { x: x + 95, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Sağ bacak
    page.drawLine({
      start: { x: x + 90, y: y - 30 },
      end: { x: x + 85, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 110, y: y - 30 },
      end: { x: x + 105, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Bacak uçları
    page.drawLine({
      start: { x: x + 75, y: y - 160 },
      end: { x: x + 95, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 85, y: y - 160 },
      end: { x: x + 105, y: y - 160 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Ağ çizgisi
    page.drawLine({
      start: { x: x + 90, y: y - 30 },
      end: { x: x + 90, y: y - 80 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  async drawProfessionalJacketImage(page, font, x, y, pdfDoc) {
    try {
      console.log('🧥 Ceket görseli ekleniyor...');
      
      // public klasöründen revize edilmiş ceket görselini yükle
      const response = await fetch('/ceket-gomlek-pattern-revize.png');
      if (!response.ok) {
        throw new Error(`Ceket görseli yüklenemedi: ${response.status}`);
      }
      
      const imageBytes = await response.arrayBuffer();
      const image = await pdfDoc.embedPng(imageBytes);
      
      // Görseli maksimum boyutlarda çiz ve doğru konumlandır
      const maxWidth = 450;
      const maxHeight = 500;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      
      // Görseli PDF'e doğru konumda çiz
      page.drawImage(image, {
        x: x - 50, // Biraz sola kaydır
        y: y - scaledHeight + 50, // Biraz yukarı kaydır
        width: scaledWidth,
        height: scaledHeight,
      });
      
      console.log('✅ Ceket görseli başarıyla eklendi!');
    } catch (error) {
      console.error('❌ Ceket görseli eklenirken hata:', error);
      
      // Hata durumunda boş çerçeve çiz
      page.drawRectangle({
        x: x,
        y: y - 180,
        width: 180,
        height: 180,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });
      
      page.drawText('GÖRSEL YÜKLENEMEDİ', {
        x: x + 30,
        y: y - 100,
        size: 10,
        font: font,
        color: rgb(0.7, 0.7, 0.7),
      });
    }
  }

  async drawJacketImage(page, font, x, y) {
    // Ceket başlığı
    page.drawText('CEKET', {
      x: x + 75,
      y: y - 15,
      size: 10,
      font: font,
    });

    // Yaka (takım elbise yakalı)
    page.drawLine({
      start: { x: x + 85, y: y - 30 },
      end: { x: x + 75, y: y - 50 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 95, y: y - 30 },
      end: { x: x + 105, y: y - 50 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Gövde ana hatları (daha geniş)
    page.drawLine({
      start: { x: x + 50, y: y - 50 },
      end: { x: x + 50, y: y - 150 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 130, y: y - 50 },
      end: { x: x + 130, y: y - 150 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 50, y: y - 150 },
      end: { x: x + 130, y: y - 150 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Omuz çizgileri
    page.drawLine({
      start: { x: x + 50, y: y - 50 },
      end: { x: x + 30, y: y - 70 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 130, y: y - 50 },
      end: { x: x + 150, y: y - 70 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Kollar (uzun)
    page.drawLine({
      start: { x: x + 30, y: y - 70 },
      end: { x: x + 30, y: y - 130 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 150, y: y - 70 },
      end: { x: x + 150, y: y - 130 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    
    // Kol uçları
    page.drawLine({
      start: { x: x + 25, y: y - 130 },
      end: { x: x + 35, y: y - 130 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x + 145, y: y - 130 },
      end: { x: x + 155, y: y - 130 },
      thickness: 2,
      color: rgb(0, 0, 0),
    });

    // Düğme çizgisi (çift sıra)
    for (let i = 0; i < 4; i++) {
      page.drawCircle({
        x: x + 80,
        y: y - 70 - (i * 18),
        size: 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      page.drawCircle({
        x: x + 100,
        y: y - 70 - (i * 18),
        size: 2,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }

    // Cep çizgileri
    page.drawLine({
      start: { x: x + 60, y: y - 90 },
      end: { x: x + 75, y: y - 90 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawLine({
      start: { x: x + 105, y: y - 90 },
      end: { x: x + 120, y: y - 90 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  async drawMeasurementTables(page, font, boldFont, measurements, x, y) {
    // Ölçü değerlerini hazırla
    const measurementMap = this.createMeasurementMap(measurements);
    console.log('📋 Table measurements map:', measurementMap);

    // Yardımcı fonksiyon: Ölçü değerini bul
    const findMeasurement = (possibleKeys) => {
      for (const key of possibleKeys) {
        if (measurementMap[key]) {
          console.log(`✅ Table found: ${key} = ${measurementMap[key]}`);
          return measurementMap[key];
        }
      }
      // Kısmi eşleşme dene
      for (const [mapKey, mapValue] of Object.entries(measurementMap)) {
        if (possibleKeys.some(key => mapKey.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(mapKey.toLowerCase()))) {
          console.log(`✅ Table found by partial match: ${mapKey} = ${mapValue}`);
          return mapValue;
        }
      }
      console.log(`❌ Table not found for keys:`, possibleKeys);
      return '---';
    };

    // Ölçü tabloları
    const tables = [
      {
        title: 'GOGUS    BEL    BASEN',
        rows: [
          [
            findMeasurement(['Göğüs', 'GOGUS', 'Gogus', 'Göğüs Genişliği', 'GOGUS GENISLIGI']),
            findMeasurement(['Bel', 'BEL', 'Bel Genişliği', 'BEL GENISLIGI']),
            findMeasurement(['Basen', 'BASEN', 'Basen Genişliği', 'BASEN GENISLIGI'])
          ]
        ]
      },
      {
        title: 'PAZU    SAG MANSET    SOL MANSET',
        rows: [
          [
            findMeasurement(['Pazı', 'PAZU', 'Pazu', 'Pazı Genişliği', 'PAZU GENISLIGI']),
            findMeasurement(['Sağ Manşet', 'SAG MANSET', 'Sag Manset', 'Sağ', 'SAG']),
            findMeasurement(['Sol Manşet', 'SOL MANSET', 'Sol Manset', 'Sol', 'SOL'])
          ]
        ]
      },
      {
        title: 'OMUZ TIPI',
        rows: [
          ['DUSUK', 'NORMAL', 'DIK']
        ]
      },
      {
        title: 'DURUS',
        rows: [
          ['ARKAYA', 'NORMAL', 'ONE']
        ]
      },
      {
        title: 'KESIM',
        rows: [
          ['DAR', 'NORMAL', 'RAHAT']
        ]
      },
      {
        title: 'SAAT PAYI    SOL    SAG',
        rows: [
          [
            findMeasurement(['Saat Payı', 'SAAT PAYI', 'Saat Payi', 'SaatPayi', 'SAATPAYI']),
            findMeasurement(['Sol', 'SOL', 'sol']),
            findMeasurement(['Sağ', 'SAG', 'Sag', 'sag'])
          ]
        ]
      }
    ];

    let tableY = y;
    tables.forEach(table => {
      // Tablo başlığı
      page.drawRectangle({
        x: x,
        y: tableY - 15,
        width: 180,
        height: 15,
        color: rgb(0.8, 0.8, 0.8),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      page.drawText(table.title, {
        x: x + 5,
        y: tableY - 10,
        size: 8,
        font: boldFont,
      });

      // Tablo satırları
      table.rows.forEach(row => {
        tableY -= 15;
        const cellWidth = 180 / row.length;
        
        row.forEach((cell, index) => {
          page.drawRectangle({
            x: x + (index * cellWidth),
            y: tableY - 15,
            width: cellWidth,
            height: 15,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          });

          page.drawText(this.sanitizeText(cell), {
            x: x + (index * cellWidth) + 5,
            y: tableY - 10,
            size: 8,
            font: font,
          });
        });
      });

      tableY -= 25;
    });
  }

  async drawModernFooter(page, font, boldFont, order) {
    const footerY = 80;
    
    // Footer ayırıcı çizgi
    page.drawLine({
      start: { x: this.margin, y: footerY + 40 },
      end: { x: this.pageWidth - this.margin, y: footerY + 40 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    // NOTLAR bölümü
    page.drawText('NOTLAR:', {
      x: this.margin,
      y: footerY + 25,
      size: 10,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    const notes = order.notes || 'asd';
    page.drawText(this.sanitizeText(notes), {
      x: this.margin + 50,
      y: footerY + 25,
      size: 9,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    
    // İmza alanları
    const signatureY = footerY - 10;
    
    // Müşteri imzası
    page.drawLine({
      start: { x: this.margin, y: signatureY },
      end: { x: this.margin + 120, y: signatureY },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    page.drawText('Musteri Imzasi', {
      x: this.margin + 20,
      y: signatureY - 15,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Terzi imzası
    page.drawLine({
      start: { x: this.pageWidth - this.margin - 120, y: signatureY },
      end: { x: this.pageWidth - this.margin, y: signatureY },
      thickness: 0.5,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    page.drawText('Terzi Imzasi', {
      x: this.pageWidth - this.margin - 100,
      y: signatureY - 15,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  // Yardımcı fonksiyonlar
  getProductTypeDisplay(productType) {
    const types = {
      'GOMLEK': 'Gomlek',
      'PANTOLON': 'Pantolon', 
      'CEKET': 'Ceket',
      'TAKIM': 'Takim Elbise'
    };
    return types[productType?.toUpperCase()] || productType || 'Belirtilmemis';
  }
  
  getStatusDisplay(status) {
    const statuses = {
      'PREPARING': 'Hazirlaniyor',
      'CUTTING': 'Kesim Asamasinda',
      'SEWING': 'Dikim Asamasinda',
      'FITTING': 'Prova Asamasinda',
      'READY': 'Hazir',
      'DELIVERED': 'Teslim Edildi',
      'CANCELLED': 'Iptal Edildi'
    };
    return statuses[status?.toUpperCase()] || status || 'Belirtilmemis';
  }
  
  formatDate(dateString) {
    if (!dateString) return 'Belirtilmemis';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch {
      return dateString;
    }
  }

  async drawModelNotes(page, font, boldFont, order, yPosition) {
    // İKI BÖLÜMLÜ NOTLAR: Sistem Notları + El Yazısı Alanı
    
    // === 1. SİSTEM NOTLARI BÖLÜMÜ ===
    page.drawText(this.sanitizeText('SİSTEM NOTLARI:'), {
      x: this.margin,
      y: yPosition - 15,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Sistem notları alanı
    page.drawRectangle({
      x: this.margin,
      y: yPosition - 55,
      width: 250,
      height: 35,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 0.5,
      color: rgb(0.98, 0.98, 0.98), // Hafif gri arkaplan
    });

    // Sistem notlarını yazdır
    if (order.notes) {
      const cleanedNotes = this.cleanNotesFromImageLinks(order.notes);
      const systemNotes = this.sanitizeText(cleanedNotes);
      const lines = this.wrapText(systemNotes, 35); // 35 karakter genislik
      
      lines.slice(0, 3).forEach((line, index) => { // Maksimum 3 satır
        page.drawText(line, {
          x: this.margin + 5,
          y: yPosition - 30 - (index * 10),
          size: 8,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });
    } else {
      // Eğer sistem notu yoksa placeholder
      page.drawText('(Sistem notu bulunmuyor)', {
        x: this.margin + 5,
        y: yPosition - 35,
        size: 8,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    // === 2. EL YAZISI NOTLAR ALANI ===
    page.drawText(this.sanitizeText('TERZİ NOTLARI (El Yazısı):'), {
      x: this.margin,
      y: yPosition - 75,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // El yazısı için geniş alan
    page.drawRectangle({
      x: this.margin,
      y: yPosition - 140,
      width: 250,
      height: 60,
      borderColor: rgb(0.6, 0.6, 0.6),
      borderWidth: 0.5,
    });

    // El yazısı için çizgiler (defter tarzı)
    for (let i = 0; i < 5; i++) {
      page.drawLine({
        start: { x: this.margin + 5, y: yPosition - 95 - (i * 10) },
        end: { x: this.margin + 245, y: yPosition - 95 - (i * 10) },
        thickness: 0.3,
        color: rgb(0.85, 0.85, 0.85),
      });
    }

    // El yazısı alanı için kılavuz metni
    page.drawText(this.sanitizeText('(Terzi tarafindan doldurulacak)'), {
      x: this.margin + 5,
      y: yPosition - 95,
      size: 7,
      font: font,
      color: rgb(0.7, 0.7, 0.7),
    });
  }

  // Metin satır wrap yardımcı fonksiyonu
  wrapText(text, maxCharsPerLine) {
    if (!text) return [''];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Resim linklerini temizleme fonksiyonu
  cleanNotesFromImageLinks(notes) {
    if (!notes) return '';
    
    // S3 AWS linklerini tespit et ve temizle
    const s3LinkPattern = /https?:\/\/[^\s]*\.s3\.[^\s]*\.amazonaws\.com\/[^\s)]+/gi;
    const httpLinkPattern = /https?:\/\/[^\s)]+\.(jpg|jpeg|png|gif|bmp|webp)/gi;
    
    let cleanedNotes = notes;
    
    // S3 linklerini [Resim Eklendi] ile değiştir
    cleanedNotes = cleanedNotes.replace(s3LinkPattern, '[Resim Eklendi]');
    
    // Diğer resim linklerini de temizle
    cleanedNotes = cleanedNotes.replace(httpLinkPattern, '[Resim Eklendi]');
    
    // Birden fazla [Resim Eklendi] varsa tek bir tanesine indir
    cleanedNotes = cleanedNotes.replace(/\[Resim Eklendi\]\s*\[Resim Eklendi\]/gi, '[Resim Eklendi]');
    
    // Fazla boşlukları temizle
    cleanedNotes = cleanedNotes.replace(/\s+/g, ' ').trim();
    
    return cleanedNotes;
  }

  generateFilename(order) {
    const customerName = this.sanitizeText(`${order.customer.firstName}_${order.customer.lastName}`);
    const productType = this.sanitizeText(order.productType || 'siparis');
    const orderNumber = order.id;
    const date = new Date().toISOString().split('T')[0];
    
    return `${customerName}_${productType}_${orderNumber}_pattern_${date}.pdf`;
  }

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
}

const professionalPdfService = new ProfessionalPdfService();
export default professionalPdfService;
