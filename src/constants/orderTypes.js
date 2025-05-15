export const Order = {
  ProductType: {
    CEKET: { displayName: 'Ceket' },
    GÖMLEK: { displayName: 'Gömlek' },
    PANTOLON: { displayName: 'Pantolon' },
    YELEK: { displayName: 'Yelek' },
    TAKIM: { displayName: 'Takım Elbise' }
  },
  FitType: {
    SLIM: { displayName: 'Slim Fit' },
    REGULAR: { displayName: 'Regular Fit' },
    BAGGY: { displayName: 'Baggy Fit' },
    CUSTOM: { displayName: 'Özel Kesim' }
  },
  OrderStatus: {
    PREPARING: { displayName: 'Hazırlanıyor' },
    CUTTING: { displayName: 'Kesim Aşamasında' },
    SEWING: { displayName: 'Dikim Aşamasında' },
    FITTING: { displayName: 'Prova Aşamasında' },
    READY: { displayName: 'Hazır' },
    DELIVERED: { displayName: 'Teslim Edildi' },
    CANCELLED: { displayName: 'İptal Edildi' }
  }
}; 