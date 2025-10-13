import api from '../api/axiosConfig';

// Merkezi API Servis Katmanı
// Tüm API çağrıları buradan yapılacak

const apiService = {
  // AUTH İŞLEMLERİ
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    changePassword: (data) => api.post('/auth/change-password', data),
    adminUsers: () => api.get('/auth/admin/users'),
    pendingUsers: () => api.get('/auth/admin/pending-users'),
    approveUser: (userId, data) => api.post(`/auth/admin/approve-user/${userId}`, data),
    rejectUser: (userId) => api.delete(`/auth/admin/reject-user/${userId}`),
    createUsta: (data) => api.post('/auth/admin/create-usta', data),
    createMuhasebeci: (data) => api.post('/auth/admin/create-muhasebeci', data),
    deleteUser: (username) => api.delete(`/auth/admin/users/${username}`)
  },

  // MÜŞTERİ İŞLEMLERİ
  customers: {
    getAll: () => api.get('/api/customers'),
    getById: (id) => api.get(`/api/customers/${id}`),
    create: (customerData) => api.post('/api/customers', customerData),
    update: (id, customerData) => api.put(`/api/customers/${id}`, customerData),
    delete: (id) => api.delete(`/api/customers/safe/${id}`),
    search: (firstName) => api.get(`/api/customers/search?firstName=${firstName}`),
    advancedSearch: (params) => api.get('/api/customers/advanced-search', { params }),
    count: () => api.get('/api/customers/count')
  },

  // SİPARİŞ İŞLEMLERİ
  orders: {
    getAll: () => api.get('/api/orders'),
    getById: (id) => api.get(`/api/orders/${id}`),
    create: (orderData) => api.post('/api/orders', orderData),
    createNew: (orderData) => api.post('/api/orders/new', orderData),
    update: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
    updateAdvanced: (id, orderData) => api.put(`/api/orders/${id}/advanced`, orderData),
    updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
    delete: (id) => api.delete(`/api/orders/${id}`),
    
    // Müşteriye göre siparişler
    getByCustomer: (customerId) => api.get(`/api/orders/by-customer/${customerId}`),
    getActiveByCustomer: (customerId) => api.get(`/api/orders/active/by-customer/${customerId}`),
    
    // İstatistikler
    getStats: () => api.get('/api/orders/stats'),
    getMonthlyStats: () => api.get('/api/orders/stats/monthly'),
    getStatusDistribution: () => api.get('/api/orders/stats/status-distribution'),
    getProductDistribution: () => api.get('/api/orders/stats/product-distribution'),
    getMonthlyTrends: () => api.get('/api/orders/stats/monthly-trends'),
    getCustomerStats: () => api.get('/api/orders/stats/customers'),
    
    // Filtreleme ve arama
    search: (searchTerm) => api.get(`/api/orders/search?q=${searchTerm}`),
    filterByStatus: (status) => api.get(`/api/orders/filter/status/${status}`),
    filterByCustomer: (customerId) => api.get(`/api/orders/by-customer/${customerId}`),
    filterByDate: (startDate, endDate) => api.get(`/api/orders/filter/date?start=${startDate}&end=${endDate}`),
    
    // Kumaş ve ürün opsiyonları
    getFabricOptions: () => api.get('/api/orders/options/fabrics'),
    getCollarTypeOptions: () => api.get('/api/orders/options/collar-types'),
    getButtonTypeOptions: () => api.get('/api/orders/options/button-types'),
    getPocketTypeOptions: () => api.get('/api/orders/options/pocket-types'),
    getLiningTypeOptions: () => api.get('/api/orders/options/lining-types'),
    getBackTypeOptions: () => api.get('/api/orders/options/back-types'),
    
    // İstatistikler ve analizler
    getRevenueAnalytics: (startDate, endDate) => api.get(`/api/orders/analytics/revenue?startDate=${startDate}&endDate=${endDate}`),
    getTopCustomers: (minOrders = 1) => api.get(`/api/orders/statistics/top-customers?minOrders=${minOrders}`)
  },

  // BLOG İŞLEMLERİ
  blogs: {
    getAll: () => api.get('/api/blogs'),
    getAllPublished: () => api.get('/api/blogs/published'),
    getById: (id) => api.get(`/api/blogs/${id}`),
    getBySlug: (slug) => api.get(`/api/blogs/slug/${slug}`),
    getByCategory: (categoryId) => api.get(`/api/blogs/category/${categoryId}`),
    getLatest: () => api.get('/api/blogs/latest'),
    getTop: (count) => api.get(`/api/blogs/top/${count}`),
    create: (blogData) => api.post('/api/blogs', blogData),
    update: (id, blogData) => api.put(`/api/blogs/${id}`, blogData),
    delete: (id) => api.delete(`/api/blogs/${id}`)
  },

  // KATEGORİ İŞLEMLERİ
  categories: {
    getAll: () => api.get('/api/categories'),
    getById: (id) => api.get(`/api/categories/${id}`),
    getBySlug: (slug) => api.get(`/api/categories/slug/${slug}`),
    create: (categoryData) => api.post('/api/categories', categoryData),
    update: (id, categoryData) => api.put(`/api/categories/${id}`, categoryData),
    delete: (id) => api.delete(`/api/categories/${id}`)
  },

  // MESAJ İŞLEMLERİ
  messages: {
    getAll: () => api.get('/api/messages'),
    getById: (id) => api.get(`/api/messages/${id}`),
    create: (messageData) => api.post('/api/messages', messageData),
    markAsRead: (id) => api.put(`/api/messages/${id}/read`),
    delete: (id) => api.delete(`/api/messages/${id}`),
    getUnreadCount: () => api.get('/api/messages/unread/count'),
    reply: (id, replyData) => api.post(`/api/messages/${id}/reply`, replyData)
  },

  // RAPOR İŞLEMLERİ
  reports: {
    getDashboardStats: () => api.get('/api/reports/dashboard-stats'),
    getCustomerReport: () => api.get('/api/reports/customers'),
    getOrderReport: () => api.get('/api/reports/orders'),
    getRevenueReport: (period) => api.get(`/api/reports/revenue/${period}`)
  },

  // AI İŞLEMLERİ
  ai: {
    // AI chat - prompt gönder ve yanıt al
    chat: (prompt) => api.post('/api/ai/chat', { prompt }),
    
    // API key doğrulama (backend'de yapılandırılmış key'i kontrol eder)
    validateKey: () => api.post('/api/ai/validate-key'),
    
    // AI durumu kontrol et
    getStatus: () => api.get('/api/ai/status'),
    
    // AI Image Generation
    getOrdersByCustomer: (customerId) => api.get(`/api/ai-image/orders/by-customer/${customerId}`),
    generateVisualization: (formData) => api.post('/api/ai-image/visualize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // DOSYA YÜKLEME İŞLEMLERİ
  upload: {
    uploadFile: (formData) => {
      return api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },

  // ÖLÇÜ İŞLEMLERİ - 16 Standart Ölçü Alanı Sistemi
  measurements: {
    // Müşterinin tüm ölçülerini getir
    getByCustomer: (customerId) => api.get(`/measurements/customer/${customerId}`),
    getByOrder: (orderId) => api.get(`/measurements/order/${orderId}`),
    
    // Yeni ölçü ekle
    add: (customerId, measurementData) => api.post(`/measurements/customer/${customerId}`, measurementData),
    
    // Ölçü güncelle
    update: (measurementId, measurementData) => api.put(`/measurements/${measurementId}`, measurementData),
    
    // Ölçü sil
    delete: (measurementId) => api.delete(`/measurements/${measurementId}`),
    
    // Fitdays OCR - AWS Textract ile ölçü fotoğrafı yükle ve parse et
    uploadFitdaysImage: (customerId, formData) => {
      return api.post(`/measurements/upload-fitdays/${customerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    
    // Ölçü verilerini TXT olarak export et
    exportTxt: (customerId) => {
      return api.get(`/measurements/export-txt/${customerId}`, {
        responseType: 'text'
      });
    },
    
    // 16 ölçü alanı bilgilerini getir
    getFields: () => api.get('/measurements/fields'),
    getFieldsByCategory: (category) => api.get(`/measurements/fields/category/${category}`),
    validateValue: (value) => api.post('/measurements/validate', { value })
  },

  // AI MODEL İŞLEMLERİ
  aiModel: {
    // AI model oluştur
    generate: (formData) => api.post('/api/ai-model/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    
    // Oluşturulan modelleri listele
    getAll: () => api.get('/api/ai-model'),
    getById: (id) => api.get(`/api/ai-model/${id}`),
    
    // Model sil
    delete: (id) => api.delete(`/api/ai-model/${id}`),
    
    // Müşteriye göre modelleri getir
    getByCustomer: (customerId) => api.get(`/api/ai-model/customer/${customerId}`),
    
    // Siparişe göre modelleri getir
    getByOrder: (orderId) => api.get(`/api/ai-model/order/${orderId}`),
    
    // AI model fotoğrafını email olarak gönder
    sendEmail: (data) => api.post('/api/ai-model/send-email', data),
    
    // Kombin önerisini email olarak gönder
    sendCombinationEmail: (data) => api.post('/api/ai-model/send-combination-email', data)
  }
};

export default apiService;