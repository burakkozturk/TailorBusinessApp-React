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

    let yPosition = this.pageHeight - this.margin;

    // Header - Logo ve Kumaş Numunesi
    await this.drawHeader(page, boldFont, yPosition);
    yPosition -= 100;

    // Müşteri Bilgileri
    yPosition = await this.drawCustomerInfo(page, font, boldFont, order, yPosition);
    yPosition -= 30;

    // Ölçü Tabloları ve Gömlek Şeması
    yPosition = await this.drawMeasurementsAndSchema(page, font, boldFont, measurements, order, yPosition);
    yPosition -= 30;

    // Model Notları
    await this.drawModelNotes(page, font, boldFont, order, yPosition);

    return await pdfDoc.save();
  }

  async drawHeader(page, boldFont, yPosition) {
    // ERDAL GUDA Logo (Sol)
    page.drawRectangle({
      x: this.margin,
      y: yPosition - 50,
      width: 200,
      height: 40,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText('ERDAL GUDA', {
      x: this.margin + 20,
      y: yPosition - 30,
      size: 16,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    page.drawText('KISISEL OZEL DIKIM', {
      x: this.margin + 20,
      y: yPosition - 45,
      size: 8,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // KUMAŞ NUMUNESI (Sağ)
    page.drawRectangle({
      x: this.pageWidth - this.margin - 150,
      y: yPosition - 50,
      width: 150,
      height: 40,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });

    page.drawText('KUMAS NUMUNESI', {
      x: this.pageWidth - this.margin - 130,
      y: yPosition - 30,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  async drawCustomerInfo(page, font, boldFont, order, yPosition) {
    // Müşteri Adı-Soyadı
    page.drawText('MUSTERI ADI-SOYADI:', {
      x: this.margin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });

    const customerName = this.sanitizeText(`${order.customer.firstName} ${order.customer.lastName}`);
    page.drawText(customerName, {
      x: this.margin + 200,
      y: yPosition,
      size: 12,
      font: font,
    });

    yPosition -= 30;

    // İstenen Ekstra Özellikler
    page.drawText('ISTENEN EKSTRA OZELLIKLER:', {
      x: this.margin,
      y: yPosition,
      size: 12,
      font: boldFont,
    });

    yPosition -= 20;

    // Sipariş özelliklerini listele
    const features = this.getOrderFeatures(order);
    features.forEach((feature, index) => {
      page.drawText(this.sanitizeText(feature), {
        x: this.margin,
        y: yPosition - (index * 15),
        size: 10,
        font: font,
      });
    });

    return yPosition - (features.length * 15);
  }

  async drawMeasurementsAndSchema(page, font, boldFont, measurements, order, yPosition) {
    // Sol taraf - Ölçü listesi (DB'den dinamik)
    const leftColumnX = this.margin;
    let leftY = yPosition;

    // Ölçüleri DB'den al ve DİNAMİK OLARAK listele
    const measurementMap = this.createMeasurementMap(measurements);
    console.log('🔎 Available measurement keys:', Object.keys(measurementMap));
    console.log('🔎 Full measurement map:', measurementMap);
    
    // STATIK LİSTE YOK! Tüm ölçüleri dinamik olarak göster (ULTRA DEDUPLICATION)
    if (Object.keys(measurementMap).length === 0) {
      console.log('❌ NO MEASUREMENTS FOUND! Check API call and data structure');
      page.drawText('OLCU VERISI BULUNAMADI!', {
        x: leftColumnX,
        y: leftY,
        size: 12,
        font: font,
        color: rgb(1, 0, 0), // Kırmızı
      });
      leftY -= 30;
      
      page.drawText('API cagrisini kontrol edin!', {
        x: leftColumnX,
        y: leftY,
        size: 10,
        font: font,
        color: rgb(1, 0, 0),
      });
      leftY -= 20;
    } else {
      // ULTRA DEDUPLICATION: Aynı değerleri ve benzer isimleri filtrele
      const uniqueMeasurements = new Map();
      const seenValues = new Set();
      
      Object.entries(measurementMap).forEach(([measurementName, measurementValue]) => {
        if (measurementValue && measurementValue !== '' && measurementValue !== null && measurementValue !== undefined) {
          const cleanName = this.sanitizeText(measurementName.toUpperCase().trim());
          const cleanValue = measurementValue.toString().trim();
          const uniqueKey = `${cleanName}:${cleanValue}`;
          
          // Aynı isim-değer çifti varsa atla
          if (!uniqueMeasurements.has(uniqueKey) && !seenValues.has(uniqueKey)) {
            uniqueMeasurements.set(uniqueKey, { name: cleanName, value: cleanValue });
            seenValues.add(uniqueKey);
            console.log(`✅ Adding unique measurement: ${cleanName} = ${cleanValue}`);
          } else {
            console.log(`❌ Skipping duplicate: ${cleanName} = ${cleanValue}`);
          }
        }
      });
      
      // Unique measurements'ı PDF'e yaz
      uniqueMeasurements.forEach(({ name, value }) => {
        const displayText = `${name}: ${value}`;
        console.log(`📋 Displaying unique measurement: ${displayText}`);
        
        page.drawText(displayText, {
          x: leftColumnX,
          y: leftY,
          size: 10,
          font: font,
        });
        leftY -= 20;
      });
      
      console.log(`🎆 Total unique measurements displayed: ${uniqueMeasurements.size}`);
    }

    // Sağ taraf - Gerçek giysi görseli ve ölçü tabloları
    const rightColumnX = this.pageWidth - this.margin - 200;
    await this.drawGarmentImage(page, font, boldFont, rightColumnX, yPosition, order);
    
    // Ölçü tabloları
    await this.drawMeasurementTables(page, font, boldFont, measurements, rightColumnX, yPosition - 200);

    return leftY;
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

  // Sipariş özelliklerini çıkar
  getOrderFeatures(order) {
    const features = [];
    
    if (order.productType) {
      features.push(`URUN TIPI: ${order.productType.toUpperCase()}`);
    }
    
    if (order.collarType) {
      features.push(`YAKA TIPI: ${order.collarType.toUpperCase()}`);
    }
    
    if (order.sleeveType) {
      features.push(`KOL TIPI: ${order.sleeveType.toUpperCase()}`);
    }
    
    if (order.buttonType) {
      features.push(`DUGME TIPI: ${order.buttonType.toUpperCase()}`);
    }
    
    if (order.pocketType) {
      features.push(`CEP TIPI: ${order.pocketType.toUpperCase()}`);
    }
    
    if (order.fabricType) {
      features.push(`KUMAS TIPI: ${order.fabricType.toUpperCase()}`);
    }
    
    return features.length > 0 ? features : ['STANDART OZELLIKLER'];
  }

  async drawGarmentImage(page, font, boldFont, x, y, order) {
    // Giysi görseli çerçevesi
    page.drawRectangle({
      x: x,
      y: y - 180,
      width: 180,
      height: 180,
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 1,
      color: rgb(0.95, 0.95, 0.95),
    });

    // Sipariş tipine göre giysi çiz
    const productType = order?.productType?.toLowerCase() || 'gomlek';
    
    if (productType.includes('pantolon') || productType.includes('pants')) {
      await this.drawPantsImage(page, font, x, y);
    } else if (productType.includes('ceket') || productType.includes('jacket')) {
      await this.drawJacketImage(page, font, x, y);
    } else {
      // Varsayılan: Gömlek
      await this.drawShirtImage(page, font, x, y);
    }
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

  async drawModelNotes(page, font, boldFont, order, yPosition) {
    // Model notları kutusu
    page.drawRectangle({
      x: this.margin,
      y: yPosition - 100,
      width: 250,
      height: 80,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });

    page.drawText('MODEL:', {
      x: this.margin + 10,
      y: yPosition - 20,
      size: 12,
      font: boldFont,
    });

    // Çizgiler
    for (let i = 0; i < 5; i++) {
      page.drawLine({
        start: { x: this.margin + 10, y: yPosition - 35 - (i * 12) },
        end: { x: this.margin + 240, y: yPosition - 35 - (i * 12) },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Sipariş notları varsa ekle
    if (order.notes) {
      const notes = this.sanitizeText(order.notes);
      page.drawText(notes.substring(0, 100), {
        x: this.margin + 10,
        y: yPosition - 35,
        size: 10,
        font: font,
      });
    }
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

export default new ProfessionalPdfService();
