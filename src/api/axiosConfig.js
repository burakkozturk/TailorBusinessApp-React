import axios from 'axios';

// Axios instance oluşturma
const api = axios.create({
  baseURL: 'http://localhost:6767',
  timeout: 15000,  // 15 saniye zaman aşımı
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Token bilgilerini dekode et ve kontrol et
const parseToken = (token) => {
  try {
    // JWT'nin payload kısmını al (2. bölüm, base64 encoded)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Token içeriğini logla
    console.log('Token içeriği:', payload);
    
    // Token içerisinde rol ve kullanıcı adı doğrula
    if (!payload.sub || !payload.role) {
      console.error('Token içinde gereken bilgiler yok:', payload);
      return false;
    }
    
    // Token süresini kontrol et
    const expirationTime = payload.exp * 1000; // ms cinsine çevir
    if (Date.now() >= expirationTime) {
      console.error('Token süresi dolmuş:', new Date(expirationTime));
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token çözümlemede hata:', error);
    return false;
  }
};

// API isteklerinin durumunu kontrol etme
const logApiCall = (config) => {
  console.log(`API İsteği: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  if (config.data) {
    console.log('Gönderilen veri:', config.data);
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
        console.log(`Token eklendi: ${token.substring(0, 20)}...`);
        
        // Kullanıcı bilgisini ve rolü logla
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        console.log(`İstek gönderen kullanıcı: ${username}, Rol: ${role}`);
      } else {
        console.warn('Token geçersiz veya süresi dolmuş, oturum sonlandırılıyor...');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/giris';
          return Promise.reject('Oturum sonlandırıldı: Token geçersiz');
        }
      }
    } else {
      console.warn('İstek için token bulunamadı! API çağrısı yetkilendirme hatası alabilir.');
    }
    
    return logApiCall(config);
  }, 
  error => {
    console.error('API istek hazırlama hatası:', error);
    return Promise.reject(error);
  }
);

// Cevap interceptor'ü
api.interceptors.response.use(
  response => {
    console.log(`API Yanıtı (${response.status}): ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  error => {
    // Hata detaylarını logla
    if (error.response) {
      // Sunucu yanıtı ile dönen hata (400-500 arası)
      console.error(`API Hata (${error.response.status}): ${error.config.method.toUpperCase()} ${error.config.url}`);
      
      if (error.response.data) {
        console.error('Hata detayı:', error.response.data);
      }
      
      // 401 Unauthorized hatası alındığında (token geçersiz veya expired)
      if (error.response.status === 401) {
        console.warn('Kimlik doğrulama hatası, kullanıcı çıkış yapıyor...');
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
      if (error.response.status === 403) {
        console.error('Yetki hatası: Bu işlemi yapmak için yetkiniz yok.');
        
        // Hangi API'ye erişim reddedildi ve hangi metod kullanıldı?
        console.error(`Erişim reddedilen endpoint: ${error.config.method.toUpperCase()} ${error.config.url}`);
        
        // Mevcut kullanıcı rolünü logla
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        if (role) {
          console.error(`Mevcut kullanıcı: ${username}, Rol: ${role}`);
        }
        
        // İstek headerlarını kontrol et
        console.log('Gönderilen istek headerları:', error.config.headers);
      }
    } else if (error.request) {
      // İstek yapıldı ancak yanıt alınamadı (bağlantı sorunu)
      console.error('Sunucudan yanıt alınamadı. Sunucu çalışıyor mu?', error.request);
    } else {
      // İstek oluşturulurken bir şeyler yanlış gitti
      console.error('API istek oluşturma hatası:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 