// 29 Fitdays Sabit Ölçü Alanları
export const MEASUREMENT_FIELDS = [
  {
    id: 'boyun_capi',
    name: 'Boyun Çapı',
    nameEn: 'Neck Circumference',
    unit: 'cm',
    order: 1,
    category: 'boyun',
    required: true
  },
  {
    id: 'boyun_kol_omuz_uzunluk',
    name: 'Boyun Kol - Omuz Uç Uzunluk',
    nameEn: 'Neck Arm - Shoulder Length',
    unit: 'cm',
    order: 2,
    category: 'omuz',
    required: true
  },
  {
    id: 'omuz_genisligi',
    name: 'Omuz Genişliği',
    nameEn: 'Shoulder Width',
    unit: 'cm',
    order: 3,
    category: 'omuz',
    required: true
  },
  {
    id: 'sirt_genisligi',
    name: 'Sırt Genişliği',
    nameEn: 'Back Width',
    unit: 'cm',
    order: 4,
    category: 'sirt',
    required: true
  },
  {
    id: 'gogus_capi',
    name: 'Göğüs Çapı',
    nameEn: 'Chest Circumference',
    unit: 'cm',
    order: 5,
    category: 'gogus',
    required: true
  },
  {
    id: 'gobek_capi',
    name: 'Göbek Çapı',
    nameEn: 'Waist Circumference',
    unit: 'cm',
    order: 6,
    category: 'gobek',
    required: true
  },
  {
    id: 'bel_cevresi_capi',
    name: 'Bel / Çember Çapı',
    nameEn: 'Hip Circumference',
    unit: 'cm',
    order: 7,
    category: 'bel',
    required: true
  },
  {
    id: 'basen_kalca_capi',
    name: 'Basen/Kalça Çapı',
    nameEn: 'Hip/Pelvis Circumference',
    unit: 'cm',
    order: 8,
    category: 'kalca',
    required: true
  },
  {
    id: 'sag_boyun_gogus_yakalik',
    name: 'Sağ Boyun - Göğüs Yakalık',
    nameEn: 'Right Neck - Chest Collar',
    unit: 'cm',
    order: 9,
    category: 'yakalik',
    required: true
  },
  {
    id: 'sag_omuz_gogus_yakalik',
    name: 'Sağ Omuz - Göğüs Yakalık',
    nameEn: 'Right Shoulder - Chest Collar',
    unit: 'cm',
    order: 10,
    category: 'yakalik',
    required: true
  },
  {
    id: 'sag_kol_omuz_kesisim_capi',
    name: 'Sağ Kol - Omuz Kesişim Çapı',
    nameEn: 'Right Arm - Shoulder Intersection',
    unit: 'cm',
    order: 11,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_kol_boyu',
    name: 'Sağ Kol Boyu',
    nameEn: 'Right Arm Length',
    unit: 'cm',
    order: 12,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_pazi_capi',
    name: 'Sağ Pazı Çapı',
    nameEn: 'Right Upper Arm Circumference',
    unit: 'cm',
    order: 13,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_bilek_capi',
    name: 'Sağ Bilek Çapı',
    nameEn: 'Right Wrist Circumference',
    unit: 'cm',
    order: 14,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_boyun_gogus_yakalik_2',
    name: 'Sağ Boyun - Göğüs Yakalık',
    nameEn: 'Right Neck - Chest Collar 2',
    unit: 'cm',
    order: 15,
    category: 'yakalik',
    required: true
  },
  {
    id: 'sag_omuz_gogus_yakalik_2',
    name: 'Sağ Omuz - Göğüs Yakalık',
    nameEn: 'Right Shoulder - Chest Collar 2',
    unit: 'cm',
    order: 16,
    category: 'yakalik',
    required: true
  },
  {
    id: 'sag_kol_omuz_kesisim_capi_2',
    name: 'Sağ Kol - Omuz Kesişim Çapı',
    nameEn: 'Right Arm - Shoulder Intersection 2',
    unit: 'cm',
    order: 17,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_kol_boyu_2',
    name: 'Sağ Kol Boyu',
    nameEn: 'Right Arm Length 2',
    unit: 'cm',
    order: 18,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_pazi_capi_2',
    name: 'Sağ Pazı Çapı',
    nameEn: 'Right Upper Arm Circumference 2',
    unit: 'cm',
    order: 19,
    category: 'kol',
    required: true
  },
  {
    id: 'sag_bilek_capi_2',
    name: 'Sağ Bilek Çapı',
    nameEn: 'Right Wrist Circumference 2',
    unit: 'cm',
    order: 20,
    category: 'kol',
    required: true
  },
  {
    id: 'ceket_etek_boyu',
    name: 'Ceket Etek Boyu (Sırttan)',
    nameEn: 'Jacket Hem Length (Back)',
    unit: 'cm',
    order: 21,
    category: 'ceket',
    required: true
  },
  {
    id: 'sol_ust_bacak_baslar_capi',
    name: 'Sol Üst Bacak Başlar Çapı',
    nameEn: 'Left Upper Leg Head Circumference',
    unit: 'cm',
    order: 22,
    category: 'bacak',
    required: true
  },
  {
    id: 'sol_alt_bacak_ashle_capi',
    name: 'Sol Alt Bacak Ashle Çapı',
    nameEn: 'Left Lower Leg Ashle Circumference',
    unit: 'cm',
    order: 23,
    category: 'bacak',
    required: true
  },
  {
    id: 'sol_ayak_bilegi_capi',
    name: 'Sol Ayak Bileği Çapı',
    nameEn: 'Left Ankle Circumference',
    unit: 'cm',
    order: 24,
    category: 'bacak',
    required: true
  },
  {
    id: 'sol_bacak_bel_bilek_boyu',
    name: 'Sol Bacak Bel - Bilek Boyu',
    nameEn: 'Left Leg Waist - Ankle Length',
    unit: 'cm',
    order: 25,
    category: 'bacak',
    required: true
  },
  {
    id: 'sag_ust_bacak_baslar_capi',
    name: 'Sağ Üst Bacak Başlar Çapı',
    nameEn: 'Right Upper Leg Head Circumference',
    unit: 'cm',
    order: 26,
    category: 'bacak',
    required: true
  },
  {
    id: 'sag_alt_bacak_ashle_capi',
    name: 'Sağ Alt Bacak Ashle Çapı',
    nameEn: 'Right Lower Leg Ashle Circumference',
    unit: 'cm',
    order: 27,
    category: 'bacak',
    required: true
  },
  {
    id: 'sag_ayak_bilegi_capi',
    name: 'Sağ Ayak Bileği Çapı',
    nameEn: 'Right Ankle Circumference',
    unit: 'cm',
    order: 28,
    category: 'bacak',
    required: true
  },
  {
    id: 'sag_bacak_bel_bilek_boyu',
    name: 'Sağ Bacak Bel - Bilek Boyu',
    nameEn: 'Right Leg Waist - Ankle Length',
    unit: 'cm',
    order: 29,
    category: 'bacak',
    required: true
  }
];

// Kategori Bilgileri
export const MEASUREMENT_CATEGORIES = {
  boyun: {
    name: 'Boyun',
    nameEn: 'Neck',
    color: '#FF6B6B',
    icon: '🔵'
  },
  omuz: {
    name: 'Omuz',
    nameEn: 'Shoulder', 
    color: '#4ECDC4',
    icon: '📐'
  },
  sirt: {
    name: 'Sırt',
    nameEn: 'Back',
    color: '#45B7D1',
    icon: '📏'
  },
  gogus: {
    name: 'Göğüs',
    nameEn: 'Chest',
    color: '#96CEB4',
    icon: '📊'
  },
  gobek: {
    name: 'Göbek',
    nameEn: 'Waist',
    color: '#FFEAA7',
    icon: '⭕'
  },
  bel: {
    name: 'Bel',
    nameEn: 'Hip',
    color: '#DDA0DD',
    icon: '🔷'
  },
  kalca: {
    name: 'Kalça',
    nameEn: 'Pelvis',
    color: '#98D8C8',
    icon: '🔶'
  },
  yakalik: {
    name: 'Yakalık',
    nameEn: 'Collar',
    color: '#F7DC6F',
    icon: '📎'
  },
  kol: {
    name: 'Kol',
    nameEn: 'Arm',
    color: '#BB8FCE',
    icon: '💪'
  },
  bacak: {
    name: 'Bacak',
    nameEn: 'Leg',
    color: '#85C1E9',
    icon: '🦵'
  },
  ceket: {
    name: 'Ceket',
    nameEn: 'Jacket',
    color: '#F8BBD9',
    icon: '🧥'
  }
};

// Yardımcı Fonksiyonlar
export const getMeasurementsByCategory = (category) => {
  return MEASUREMENT_FIELDS.filter(field => field.category === category);
};

export const validateMeasurementValue = (value) => {
  return value >= 10 && value <= 200;
};

export const formatMeasurementValue = (value) => {
  return parseFloat(value).toFixed(1);
};

export const getInitialMeasurementValues = () => {
  const initialValues = {};
  MEASUREMENT_FIELDS.forEach(field => {
    initialValues[field.id] = '';
  });
  return initialValues;
};