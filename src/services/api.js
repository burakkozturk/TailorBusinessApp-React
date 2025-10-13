import axios from 'axios';

// API base URL
const getAPIBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://erdalguda.online';
  }
  return process.env.REACT_APP_API_URL || 'https://erdalguda.online';
};
const API_BASE_URL = getAPIBaseURL();

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 dakika timeout (AI için uzun süre gerekli)
  withCredentials: true, // Cookie'ler için
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı login sayfasına yönlendir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
