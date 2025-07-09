export const Order = {
  ProductType: {
    CEKET: { displayName: 'Ceket' },
    GÖMLEK: { displayName: 'Gömlek' },
    PANTOLON: { displayName: 'Pantolon' },
    TAKIM: { displayName: 'Takım Elbise' }
  },

  // === GÖMLEK ÖZELLEŞTİRMELERİ ===
  CollarType: {
    MONO: { displayName: 'Mono Yaka' },
    KIRLANGIC: { displayName: 'Kırlangıç Yaka' },
    HAKIM: { displayName: 'Hakim Yaka' },
    SAL: { displayName: 'ŞAL Yaka' }
  },

  SleeveType: {
    VATKALI: { displayName: 'Vatkalı Kol' },
    VOTKASIZ: { displayName: 'Votkasız Kol' },
    BUZGULU: { displayName: 'Büzgülü Kol' }
  },

  // === PANTOLON ÖZELLEŞTİRMELERİ ===
  WaistType: {
    DUSUK_BEL: { displayName: 'Düşük Bel' },
    ARA_BEL: { displayName: 'Ara Bel' },
    YUKSEK_BEL: { displayName: 'Yüksek Bel' }
  },

  PleatType: {
    PILESIZ: { displayName: 'Pilesiz Pantolon' },
    TEK_PILE: { displayName: 'Tek Pile Pantolon' },
    CIFT_PILE: { displayName: 'Çift Pile Pantolon' }
  },

  LegType: {
    DAR_PACA: { displayName: 'Dar Paça Pantolon' },
    KLASIK: { displayName: 'Klasik Pantolon' },
    BOL_PACA: { displayName: 'Bol Paça Pantolon' }
  },

  // === CEKET ÖZELLEŞTİRMELERİ ===
  ButtonType: {
    TEK_DUGME: { displayName: 'Tek Düğme' },
    IKI_DUGME: { displayName: 'İki Düğme' },
    UC_DUGME: { displayName: 'Üç Düğme' },
    DORT_DUGME: { displayName: 'Dört Düğme' }
  },

  PocketType: {
    TEK_CEP: { displayName: 'Tek Cep' },
    CIFT_CEP: { displayName: 'Çift Cep' },
    FILO_CEP: { displayName: 'Filo Cep' },
    EGIK_CEP: { displayName: 'Eğik Cep' },
    TORBA_CEP: { displayName: 'Torba Cep' },
    KORUKLU_CEP: { displayName: 'Körüklü Cep' }
  },

  VentType: {
    YIRTMACSIZ: { displayName: 'Yırtmaçsız Ceket' },
    TEK_YIRTMAC: { displayName: 'Tek Yırtmaçlı Ceket' },
    CIFT_YIRTMAC: { displayName: 'Çift Yırtmaçlı Ceket' }
  },

  BackType: {
    KORUKLU: { displayName: 'Körüklü Ceket' },
    KORUKSUZ: { displayName: 'Körüksüz Ceket' },
    ROBLI: { displayName: 'Roblı Ceket' }
  },

  OrderStatus: {
    PREPARING: { displayName: 'Hazırlanıyor', color: '#FFA726' },
    CUTTING: { displayName: 'Kesim Aşamasında', color: '#29B6F6' },
    SEWING: { displayName: 'Dikim Aşamasında', color: '#66BB6A' },
    FITTING: { displayName: 'Prova Aşamasında', color: '#AB47BC' },
    READY: { displayName: 'Hazır', color: '#26A69A' },
    DELIVERED: { displayName: 'Teslim Edildi', color: '#2E7D32' },
    CANCELLED: { displayName: 'İptal Edildi', color: '#EF5350' }
  },

  // Ürün tipine göre hangi özelleştirmelerin gösterileceğini belirten yardımcı map
  getCustomizationOptions: (productType) => {
    const options = {};
    
    switch (productType) {
      case 'GÖMLEK':
        options.collarType = Order.CollarType;
        options.sleeveType = Order.SleeveType;
        break;
      case 'PANTOLON':
        options.waistType = Order.WaistType;
        options.pleatType = Order.PleatType;
        options.legType = Order.LegType;
        break;
      case 'CEKET':
        options.buttonType = Order.ButtonType;
        options.pocketType = Order.PocketType;
        options.ventType = Order.VentType;
        options.backType = Order.BackType;
        break;
      case 'TAKIM':
        // Takım elbise için hem ceket hem pantolon özellikleri
        options.buttonType = Order.ButtonType;
        options.pocketType = Order.PocketType;
        options.ventType = Order.VentType;
        options.backType = Order.BackType;
        options.waistType = Order.WaistType;
        options.pleatType = Order.PleatType;
        options.legType = Order.LegType;
        break;
      default:
        break;
    }
    
    return options;
  },

  // Backend için enum değerleri açıklaması
  apiComments: {
    // NOT: Backend tarafında tüm enum değerleri şu şekildedir:
    // 
    // ProductType: CEKET, GÖMLEK, PANTOLON, TAKIM
    // OrderStatus: PREPARING, CUTTING, SEWING, FITTING, READY, DELIVERED, CANCELLED
    //
    // Gömlek özelleştirmeleri:
    // CollarType: MONO, KIRLANGIC, HAKIM, SAL
    // SleeveType: VATKALI, VOTKASIZ, BUZGULU
    //
    // Pantolon özelleştirmeleri:
    // WaistType: DUSUK_BEL, ARA_BEL, YUKSEK_BEL
    // PleatType: PILESIZ, TEK_PILE, CIFT_PILE
    // LegType: DAR_PACA, KLASIK, BOL_PACA
    //
    // Ceket özelleştirmeleri:
    // ButtonType: TEK_DUGME, IKI_DUGME, UC_DUGME, DORT_DUGME
    // PocketType: TEK_CEP, CIFT_CEP, FILO_CEP, EGIK_CEP, TORBA_CEP, KORUKLU_CEP
    // VentType: YIRTMACSIZ, TEK_YIRTMAC, CIFT_YIRTMAC
    // BackType: KORUKLU, KORUKSUZ, ROBLI
    //
    // Bu değerler tam olarak yukarıdaki nesne anahtarlarıyla aynı olmalıdır.
  }
}; 