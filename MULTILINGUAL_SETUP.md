# 🌍 Çok Dilli Destek Sistemi - Erdal Güda Terzilik

Bu proje artık **4 dilde** desteklenmektedir: **Türkçe**, **İngilizce**, **Arapça** ve **Fransızca**.

## 🚀 Kurulum

### 1. Gerekli Paketleri Yükleyin

```bash
cd frontend
npm install i18next@^23.15.1 react-i18next@^15.1.2 i18next-browser-languagedetector@^8.0.0 i18next-http-backend@^2.6.1
```

### 2. Uygulamayı Başlatın

```bash
npm start
```

## 🎨 Dil Değiştirici Özellikleri

### Estetik Tasarım
- ❌ **Dropdown menü yok** - Tamamen özel tasarım
- 🎨 **Modern glassmorphism** efektli arayüz
- 🏳️ **Bayrak ikonları** her dil için
- ✨ **Smooth animasyonlar** ve geçiş efektleri
- 📱 **Responsive tasarım** - mobil uyumlu

### Kullanılabilir Varyantlar

```jsx
// Default varyant
<LanguageSwitcher />

// Compact varyant (navbar için ideal)
<LanguageSwitcher variant="compact" />

// Minimal varyant (sadece bayrak)
<LanguageSwitcher variant="minimal" />
```

## 🌐 Desteklenen Diller

| Dil | Kod | Bayrak | Yön | Font Desteği |
|-----|-----|--------|-----|--------------|
| Türkçe | `tr` | 🇹🇷 | LTR | Varsayılan |
| İngilizce | `en` | 🇺🇸 | LTR | Varsayılan |
| Arapça | `ar` | 🇸🇦 | RTL | Arabic Fonts |
| Fransızca | `fr` | 🇫🇷 | LTR | Inter Font |

## 📁 Dosya Yapısı

```
src/
├── locales/           # Çeviri dosyaları
│   ├── tr/
│   │   └── common.json
│   ├── en/
│   │   └── common.json
│   ├── ar/
│   │   └── common.json
│   └── fr/
│       └── common.json
├── i18n/
│   └── index.js       # i18n konfigürasyonu
├── hooks/
│   └── useLanguage.js # Dil yönetimi hook'u
├── components/
│   └── LanguageSwitcher.js
└── styles/
    └── LanguageSwitcher.css
```

## 🔧 Kullanım

### Basit Çeviri

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return (
    <h1>{t('navigation.home')}</h1>
  );
}
```

### Dil Yönetimi Hook'u

```jsx
import { useLanguage } from '../hooks/useLanguage';

function MyComponent() {
  const { 
    currentLanguage, 
    changeLanguage, 
    isRTL, 
    translate 
  } = useLanguage();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <p>Mevcut dil: {currentLanguage}</p>
      <button onClick={() => changeLanguage('en')}>
        {translate('common.english')}
      </button>
    </div>
  );
}
```

### Dil Değiştirici Komponenti

```jsx
import LanguageSwitcher from './components/LanguageSwitcher';

function Navbar() {
  return (
    <nav>
      {/* Diğer navbar elemanları */}
      <LanguageSwitcher variant="compact" />
    </nav>
  );
}
```

## 🎯 Özellikler

### ✅ Otomatik Özellikler
- **Tarayıcı dili algılama** - İlk ziyarette otomatik dil seçimi
- **LocalStorage kaydetme** - Kullanıcı tercihi hatırlanır
- **RTL desteği** - Arapça için otomatik sağdan sola düzen
- **HTML lang attribute** - SEO ve erişilebilirlik için
- **Font optimizasyonu** - Dile özel font yüklemesi

### 🎨 UI/UX Özellikleri
- **Backdrop blur efekti** - Modern glassmorphism
- **Hover animasyonları** - İnteraktif kullanıcı deneyimi
- **Keyboard navigasyonu** - Erişilebilirlik desteği
- **Focus states** - Screen reader uyumluluğu
- **Mobile responsive** - Tüm cihazlarda mükemmel görünüm

### 📱 Responsive Davranış
- **Desktop**: Tam özellikli dil değiştirici
- **Tablet**: Compact varyant
- **Mobile**: Alt sabit panel (küçük ekranlarda)

## 🌙 Dark Mode Desteği

Sistem otomatik olarak dark mode tercihinizi algılar:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode stilleri otomatik uygulanır */
}
```

## ♿ Erişilebilirlik

- **ARIA labels** - Screen reader desteği
- **Keyboard navigation** - Tab ile gezinme
- **High contrast mode** - Görme zorluğu olanlar için
- **Focus indicators** - Odaklanma göstergeleri

## 🔧 Özelleştirme

### Yeni Dil Ekleme

1. **Çeviri dosyası oluşturun**:
```bash
src/locales/de/common.json  # Almanca için
```

2. **i18n konfigürasyonunu güncelleyin**:
```javascript
// src/i18n/index.js
export const SUPPORTED_LANGUAGES = [
  // Mevcut diller...
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr'
  }
];
```

### CSS Özelleştirme

```css
/* Kendi stilinizi ekleyin */
.language-switcher.my-custom-variant {
  /* Özel stiller */
}
```

## 🐛 Sorun Giderme

### Çeviriler Görünmüyor
```bash
# Cache temizleyin
npm start -- --reset-cache
```

### RTL Düzeni Bozuk
```javascript
// useLanguage hook'unu kontrol edin
const { isRTL, direction } = useLanguage();
```

### Fontlar Yüklenmiyor
```css
/* index.css'te font import'ları kontrol edin */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600&display=swap');
```

## 📋 TODO
- [ ] Daha fazla sayfa için çeviriler
- [ ] Admin panel çevirileri
- [ ] Tarih/saat formatları
- [ ] Para birimi formatları
- [ ] Sayı formatları (1,000 vs 1.000)

## 🤝 Katkıda Bulunma

Yeni çeviriler veya özellik istekleri için lütfen issue açın.

---

**🎉 Tebrikler! Projeniz artık çok dilli desteğe sahip!**
