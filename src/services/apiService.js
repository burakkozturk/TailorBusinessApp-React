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
    update: (id, orderData) => api.put(`/api/orders/${id}`, orderData),
    delete: (id) => api.delete(`/api/orders/${id}`),
    getByCustomer: (customerId) => api.get(`/api/orders/by-customer/${customerId}`),
    getActiveByCustomer: (customerId) => api.get(`/api/orders/active/by-customer/${customerId}`),
    getByStatus: (status) => api.get(`/api/orders/by-status/${status}`),
    getByDateRange: (startDate, endDate) => api.get(`/api/orders/by-date-range?startDate=${startDate}&endDate=${endDate}`),
    updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
    getProductTypeStats: (startDate, endDate) => api.get(`/api/orders/statistics/by-product-type?startDate=${startDate}&endDate=${endDate}`)
  },

  // ÖLÇÜ İŞLEMLERİ
  measurements: {
    getByCustomer: (customerId) => api.get(`/api/measurements/${customerId}`),
    update: (customerId, measurementData) => api.put(`/api/measurements/${customerId}`, measurementData),
    create: (measurementData) => api.post('/api/measurements', measurementData)
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
    getUnreadCount: () => api.get('/api/messages/unread/count')
  },

  // RAPOR İŞLEMLERİ
  reports: {
    getDashboard: () => api.get('/api/reports/dashboard'),
    getMonthly: (year, month) => api.get(`/api/reports/monthly/${year}/${month}`),
    getYearly: (year) => api.get(`/api/reports/yearly/${year}`),
    getCustomers: () => api.get('/api/reports/customers'),
    getOrderStatus: () => api.get('/api/reports/orders/status'),
    getCurrentMonth: () => api.get('/api/reports/current-month'),
    getCurrentYear: () => api.get('/api/reports/current-year'),
    getCustom: (startDate, endDate) => api.get(`/api/reports/custom?startDate=${startDate}&endDate=${endDate}`)
  },

  // DOSYA YÜKLEME İŞLEMLERİ
  upload: {
    uploadFile: (formData) => api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
};

export default apiService; 