import axios from 'axios';

// API configuration - Environment'a göre otomatik URL seç
const getBaseURL = () => {
  // Production environment kontrolü
  if (window.location.hostname === 'erdalguda.netlify.app' || 
      window.location.hostname === 'erdalguda.com' ||
      window.location.hostname === 'www.erdalguda.com') {
    return 'https://erdalguda.online';
  }
  // Development/local
  return 'http://localhost:6767';
};

// Axios instance oluşturma
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 120000, // AI işlemleri için 2 dakika timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Production'da log seviyesini azalt
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Token bilgilerini dekode et ve kontrol et
const parseToken = (token) => {
  try {
    // JWT'nin payload kısmını al (2. bölüm, base64 encoded)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Development'ta token içeriğini logla
    if (isDevelopment) {
      console.log('Token içeriği:', payload);
    }
    
    // Token içerisinde rol ve kullanıcı adı doğrula
    if (!payload.sub || !payload.role) {
      if (isDevelopment) {
        console.error('Token içinde gereken bilgiler yok:', payload);
      }
      return false;
    }
    
    // Token süresini kontrol et
    const expirationTime = payload.exp * 1000; // ms cinsine çevir
    if (Date.now() >= expirationTime) {
      if (isDevelopment) {
        console.error('Token süresi dolmuş:', new Date(expirationTime));
      }
      return false;
    }
    
    return true;
  } catch (error) {
    if (isDevelopment) {
      console.error('Token çözümlemede hata:', error);
    }
    return false;
  }
};

// API isteklerinin durumunu kontrol etme (sadece development'ta)
const logApiCall = (config) => {
  if (isDevelopment) {
    console.log(`🌐 API İsteği: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.data) {
      console.log('📤 Gönderilen veri:', config.data);
    }
  }
  return config;
};

// İstek interceptor'ü
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    // Eğer token varsa isteğe Authorization header'ı ekle
    if (token) {
      // Token geçerliliğini kontrol et
      if (parseToken(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        
        if (isDevelopment) {
          console.log(`🔐 Token eklendi: ${token.substring(0, 20)}...`);
          
          // Kullanıcı bilgisini ve rolü logla
          const role = localStorage.getItem('role');
          const username = localStorage.getItem('username');
          console.log(`👤 İstek gönderen kullanıcı: ${username}, Rol: ${role}`);
        }
      } else {
        if (isDevelopment) {
          console.warn('⚠️ Token geçersiz veya süresi dolmuş, oturum sonlandırılıyor...');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/giris';
          return Promise.reject('Oturum sonlandırıldı: Token geçersiz');
        }
      }
    } else if (isDevelopment) {
      console.warn('⚠️ İstek için token bulunamadı! API çağrısı yetkilendirme hatası alabilir.');
    }
    
    return logApiCall(config);
  }, 
  error => {
    if (isDevelopment) {
      console.error('❌ API istek hazırlama hatası:', error);
    }
    return Promise.reject(error);
  }
);

// Cevap interceptor'ü
api.interceptors.response.use(
  response => {
    if (isDevelopment) {
      console.log(`✅ API Yanıtı (${response.status}): ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  error => {
    // Hata detaylarını logla (production'da daha az detay)
    if (error.response) {
      // Sunucu yanıtı ile dönen hata (400-500 arası)
      if (isDevelopment) {
        console.error(`❌ API Hata (${error.response.status}): ${error.config.method.toUpperCase()} ${error.config.url}`);
        
        if (error.response.data) {
          console.error('🔍 Hata detayı:', error.response.data);
        }
      }
      
      // 401 Unauthorized hatası alındığında (token geçersiz veya expired)
      if (error.response.status === 401) {
        if (isDevelopment) {
          console.warn('🔐 Kimlik doğrulama hatası, kullanıcı çıkış yapıyor...');
        }
        // Token'ı temizle ve giriş sayfasına yönlendir
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        
        // Sadece tarayıcıda çalışıyorsa yönlendirme yap
        if (typeof window !== 'undefined') {
          window.location.href = '/giris';
        }
      }
      
      // 403 Forbidden hatası (yetki sorunu)
      if (error.response.status === 403 && isDevelopment) {
        console.error('🚫 Yetki hatası: Bu işlemi yapmak için yetkiniz yok.');
        console.error(`🚫 Erişim reddedilen endpoint: ${error.config.method.toUpperCase()} ${error.config.url}`);
        
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        if (role) {
          console.error(`👤 Mevcut kullanıcı: ${username}, Rol: ${role}`);
        }
        console.log('📋 Gönderilen istek headerları:', error.config.headers);
      }
    } else if (error.request) {
      // İstek yapıldı ancak yanıt alınamadı (bağlantı sorunu)
      if (isDevelopment) {
        console.error('🔌 Sunucudan yanıt alınamadı. Sunucu çalışıyor mu?', error.request);
      }
    } else {
      // İstek oluşturulurken bir şeyler yanlış gitti
      if (isDevelopment) {
        console.error('⚠️ API istek oluşturma hatası:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Console'da API base URL'ini göster
console.log(`🌐 API Base URL: ${getBaseURL()}`);

export default api; 