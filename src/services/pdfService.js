// pdf/PDFService.js
import { PDFDocument, rgb } from 'pdf-lib';

class PDFService {
  constructor() {
    this.templates = {
      'CEKET': '/pdf-patterns/ceket-pattern.pdf',
      'GÖMLEK': '/pdf-patterns/gomlek-pattern.pdf',
      'PANTOLON': '/pdf-patterns/pantolon-pattern.pdf'
    };
    // simple in-memory font cache
    this._fontRegular = null;
    this._fontBold = null;
  }

  // ---- MAIN ----
  async generatePatternPDF(order, measurements) {
    try {
      const templatePath = this.templates[order.productType];
      if (!templatePath) throw new Error(`${order.productType} için template bulunamadi`);

      // 1) Load template
      const templateBytes = await this._loadBinary(templatePath);
      const pdfDoc = await PDFDocument.load(templateBytes);

      // 2) Embed REAL fonts (TTF/OTF) — fixes Chrome rendering quirks
      let font, boldFont;
      try {
        const [regularBytes, boldBytes] = await Promise.all([
          this._loadFont('/fonts/Roboto-Regular.ttf'),
          this._loadFont('/fonts/Roboto-Bold.ttf')
        ]);
        font = await pdfDoc.embedFont(regularBytes, { subset: true });
        boldFont = await pdfDoc.embedFont(boldBytes, { subset: true });
      } catch (e) {
        // last-resort fallback if font files are missing
        console.warn('⚠️ Fontlari yükleyemedim, viewer fallback fontlarina düSülecek:', e);
        font = await pdfDoc.embedFont('Times-Roman');   // avoids crash but may shift layout
        boldFont = await pdfDoc.embedFont('Times-Bold');
      }

      // 3) Use first page of template
      const page = pdfDoc.getPages()[0];

      // 4) Draw sections
      await this._addOrderInfo(page, order, font, boldFont);
      await this._addCustomerInfo(page, order.customer, font, boldFont);
      await this._addMeasurements(page, measurements, font, boldFont, order.productType);
      await this._addCustomizations(page, order, font, boldFont);

      // 5) Save PDF
      const pdfBytes = await pdfDoc.save({
        updateFieldAppearances: false,
        // useObjectStreams: false, // Uncomment only if you hit rare enterprise Chrome parser issues
      });

      return pdfBytes;
    } catch (err) {
      console.error('❌ PDF oluSturma hatasi:', err);
      throw err;
    }
  }

  // ---- LOADERS ----
  async _loadBinary(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Kaynak yüklenemedi: ${path} (${res.status})`);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  async _loadFont(path) {
    if (path.includes('Regular') && this._fontRegular) return this._fontRegular;
    if (path.includes('Bold') && this._fontBold) return this._fontBold;

    const bytes = await this._loadBinary(path);
    if (path.includes('Regular')) this._fontRegular = bytes;
    if (path.includes('Bold')) this._fontBold = bytes;
    return bytes;
  }

  // ---- BLOCKS ----
  async _addOrderInfo(page, order, font, boldFont) {
    const { height } = page.getSize();

    page.drawText('SIPARIS PATTERN DÖKÜMANI', {
      x: 50, y: height - 50, size: 16, font: boldFont, color: rgb(0, 0, 0)
    });

    const orderInfoLines = [
      `SipariS No: ${order.id}`,
      `Ürün Tipi: ${order.productType}`,
      `SipariS Tarihi: ${this._fmtDate(order.orderDate)}`,
      `Teslim Tarihi: ${order.estimatedDeliveryDate ? this._fmtDate(order.estimatedDeliveryDate) : 'BelirtilmemiS'}`,
      `Durum: ${this._getStatusText(order.status)}`,
      `Toplam Fiyat: ${order.totalPrice != null ? `${order.totalPrice} TL` : 'BelirtilmemiS'}`
    ];

    let y = height - 80;
    for (const line of orderInfoLines) {
      page.drawText(line, { x: 50, y, size: 10, font, color: rgb(0, 0, 0) });
      y -= 15;
    }
  }

  async _addCustomerInfo(page, customer, font, boldFont) {
    const { height } = page.getSize();

    page.drawText('MÜSTERI BILGILERI', {
      x: 300, y: height - 50, size: 14, font: boldFont, color: rgb(0, 0, 0)
    });

    const lines = [
      `Ad Soyad: ${(customer.firstName || '')} ${(customer.lastName || '')}`.trim(),
      `Telefon: ${customer.phone || 'BelirtilmemiS'}`,
      `E-posta: ${customer.email || 'BelirtilmemiS'}`,
      `Boy: ${customer.height ? `${customer.height} cm` : 'BelirtilmemiS'}`,
      `Kilo: ${customer.weight ? `${customer.weight} kg` : 'BelirtilmemiS'}`,
      `Adres: ${customer.address || 'BelirtilmemiS'}`
    ];

    let y = height - 80;
    for (const line of lines) {
      this._drawTextWrapped(page, line, 300, y, 250, { font, size: 10, lineGap: 2 });
      y -= 15;
    }
  }

  async _addMeasurements(page, measurements, font, boldFont /*, productType */) {
    const { height } = page.getSize();

    page.drawText('ÖLÇÜLER', {
      x: 50, y: height - 250, size: 14, font: boldFont, color: rgb(0, 0, 0)
    });

    let arr = [];
    if (Array.isArray(measurements)) {
      arr = measurements;
    } else if (measurements && Array.isArray(measurements.data)) {
      arr = measurements.data;
    }

    if (!arr.length) {
      page.drawText('Ölçü bilgisi bulunamadi', {
        x: 50, y: height - 280, size: 10, font, color: rgb(0.5, 0.5, 0.5)
      });
      return;
    }

    let y = height - 280;
    const leftX = 50;
    const rightX = 300;
    let useRight = false;

    for (const m of arr) {
      const text = `${m.regionName}: ${m.value}${m.unit ? ` ${m.unit}` : ''}`;
      const x = useRight ? rightX : leftX;

      page.drawText(text, { x, y, size: 9, font, color: rgb(0, 0, 0) });

      if (useRight) y -= 15; // after right column, move down
      useRight = !useRight;  // toggle column

      if (!useRight) y -= 3; // tiny spacing every row-pair
    }
  }

  async _addCustomizations(page, order, font, boldFont) {
    const { height } = page.getSize();

    page.drawText('ÖZELLESTIRMELER', {
      x: 50, y: height - 450, size: 14, font: boldFont, color: rgb(0, 0, 0)
    });

    const customizations = this._getCustomizationsForProduct(order);
    let y = height - 480;

    if (!customizations.length) {
      page.drawText('ÖzelleStirme bilgisi bulunamadi', {
        x: 50, y, size: 10, font, color: rgb(0.5, 0.5, 0.5)
      });
    } else {
      for (const c of customizations) {
        this._drawTextWrapped(page, c, 50, y, 500, { font, size: 10, lineGap: 2 });
        y -= 15;
      }
    }

    if (order.notes) {
      y -= 20;
      page.drawText('NOTLAR:', {
        x: 50, y, size: 12, font: boldFont, color: rgb(0, 0, 0)
      });
      y -= 18;

      this._drawTextWrapped(page, order.notes, 50, y, 500, { font, size: 9, lineGap: 2 });
    }
  }

  // ---- TEXT HELPERS ----
  _drawTextWrapped(page, text, x, y, maxWidth, opts) {
    if (!text) return;
    const font = opts.font;
    const size = opts.size;
    const lineGap = opts.lineGap != null ? opts.lineGap : 2;

    const spaceW = font.widthOfTextAtSize(' ', size);
    const lines = [];

    for (const rawLine of String(text).split('\n')) {
      const words = rawLine.split(' ');
      let line = '';
      let lineWidth = 0;

      for (const word of words) {
        const wordW = font.widthOfTextAtSize(word, size);
        if (!line) {
          line = word;
          lineWidth = wordW;
          continue;
        }
        if (lineWidth + spaceW + wordW <= maxWidth) {
          line += ' ' + word;
          lineWidth += spaceW + wordW;
        } else {
          lines.push(line);
          line = word;
          lineWidth = wordW;
        }
      }
      if (line) lines.push(line);
    }

    let cursorY = y;
    for (const ln of lines) {
      page.drawText(ln, { x, y: cursorY, size, font, color: rgb(0, 0, 0) });
      cursorY -= size + lineGap;
    }
  }

  // ---- MAPPERS ----
  _getDisplayName(type, value) {
    if (!value) return '';
    const displayNames = {
      collarType: { MONO: 'Mono Yaka', KIRLANGIC: 'Kirlangiç Yaka', HAKIM: 'Hakim Yaka', SAL: 'Sal Yaka' },
      sleeveType: { VATKALI: 'Vatkali Kol', VOTKASIZ: 'Vatkasiz Kol', BUZGULU: 'Büzgülü Kol' },
      waistType: { DUSUK_BEL: 'DüSük Bel', ARA_BEL: 'Ara Bel', YUKSEK_BEL: 'Yüksek Bel' },
      pleatType: { PILESIZ: 'Pilesiz', TEK_PILE: 'Tek Pile', CIFT_PILE: 'Çift Pile' },
      legType: { DAR_PACA: 'Dar Paça', KLASIK: 'Klasik', BOL_PACA: 'Bol Paça' },
      buttonType: { TEK_DUGME: 'Tek Dügme', IKI_DUGME: 'Iki Dügme', UC_DUGME: 'Üç Dügme', DORT_DUGME: 'Dört Dügme' },
      pocketType: {
        TEK_CEP: 'Tek Cep', CIFT_CEP: 'Çift Cep', FILO_CEP: 'Filo Cep', EGIK_CEP: 'Egik Cep',
        TORBA_CEP: 'Torba Cep', KORUKLU_CEP: 'Körüklü Cep'
      },
      ventType: { YIRTMACSIZ: 'Yirtmaçsiz', TEK_YIRTMAC: 'Tek Yirtmaç', CIFT_YIRTMAC: 'Çift Yirtmaç' },
      backType: { KORUKLU: 'Körüklü', KORUKSUZ: 'Körüksüz', ROBLI: 'Robli' }
    };
    return (displayNames[type] && displayNames[type][value]) || value;
  }

  _getCustomizationsForProduct(order) {
    const c = [];
    switch (order.productType) {
      case 'GÖMLEK':
        if (order.collarType) c.push(`Yaka Tipi: ${this._getDisplayName('collarType', order.collarType)}`);
        if (order.sleeveType) c.push(`Kol Tipi: ${this._getDisplayName('sleeveType', order.sleeveType)}`);
        break;

      case 'PANTOLON':
        if (order.waistType) c.push(`Bel Tipi: ${this._getDisplayName('waistType', order.waistType)}`);
        if (order.pleatType) c.push(`Pile Tipi: ${this._getDisplayName('pleatType', order.pleatType)}`);
        if (order.legType) c.push(`Paça Tipi: ${this._getDisplayName('legType', order.legType)}`);
        break;

      case 'CEKET':
        if (order.buttonType) c.push(`Dügme Tipi: ${this._getDisplayName('buttonType', order.buttonType)}`);
        if (order.pocketType) c.push(`Cep Tipi: ${this._getDisplayName('pocketType', order.pocketType)}`);
        if (order.ventType) c.push(`Yirtmaç Tipi: ${this._getDisplayName('ventType', order.ventType)}`);
        if (order.backType) c.push(`Sirt Tipi: ${this._getDisplayName('backType', order.backType)}`);
        break;
    }
    return c;
  }

  _getStatusText(status) {
    const map = {
      PREPARING: 'Hazirlaniyor',
      CUTTING: 'Kesim ASamasinda',
      SEWING: 'Dikim ASamasinda',
      FITTING: 'Prova ASamasinda',
      READY: 'Hazir',
      DELIVERED: 'Teslim Edildi',
      CANCELLED: 'Iptal Edildi'
    };
    return status ? (map[status] || status) : 'BelirtilmemiS';
  }

  _fmtDate(d) {
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString('tr-TR');
    } catch {
      return '—';
    }
  }

  // ---- DOWNLOAD & FILENAME ----
  downloadPDF(pdfBytes, filename) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  generateFilename(order) {
    const customerName = `${order.customer.firstName}_${order.customer.lastName}`;
    const productType = order.productType;
    const orderNumber = order.id;
    const date = new Date().toISOString().split('T')[0];
    return `${customerName}_${productType}_${orderNumber}_Pattern_${date}.pdf`;
  }
}

export default new PDFService();
