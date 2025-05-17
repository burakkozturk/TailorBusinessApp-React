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
    PREPARING: { displayName: 'Hazırlanıyor', color: '#FFA726' },
    CUTTING: { displayName: 'Kesim Aşamasında', color: '#29B6F6' },
    SEWING: { displayName: 'Dikim Aşamasında', color: '#66BB6A' },
    FITTING: { displayName: 'Prova Aşamasında', color: '#AB47BC' },
    READY: { displayName: 'Hazır', color: '#26A69A' },
    DELIVERED: { displayName: 'Teslim Edildi', color: '#2E7D32' },
    CANCELLED: { displayName: 'İptal Edildi', color: '#EF5350' }
  }
}; 