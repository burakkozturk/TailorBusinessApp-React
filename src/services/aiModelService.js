// The New Black AI API Service
// AI Model generation için özel servis

const AI_API_BASE_URL = 'https://api.thenewblack.ai';
const AI_API_ENDPOINT = '/api/v1/generate-model';

class AIModelService {
  constructor() {
    // API anahtarını environment variable'dan al, yoksa geçici olarak hardcode et
    this.apiKey = process.env.REACT_APP_TNB_API_KEY || 'test_api_key_erdalguda23';
    
    // Debug: API key durumunu logla
    console.log('🔑 API Key Status:', {
      hasEnvKey: !!process.env.REACT_APP_TNB_API_KEY,
      hasApiKey: !!this.apiKey,
      keyLength: this.apiKey ? this.apiKey.length : 0
    });
    this.baseURL = AI_API_BASE_URL;
    
    // API credentials
    this.credentials = {
      email: 'erdalguda23@gmail.com',
      password: 'Project.Guda.23'
    };
  }

  /**
   * The New Black AI API ile model oluştur
   * @param {Object} params - API parametreleri
   * @returns {Promise} API response
   */
  async generateModel(params) {
    const {
      fabricImage,
      clothingPrompt,
      gender = 'woman',
      country = 'Turkey',
      age = 25,
      additionalInfo = '',
      customerDetails = null,
      orderDetails = null
    } = params;

    try {
      console.log('🤖 AI Model generation başlatılıyor...', {
        fabricImage: fabricImage ? 'Mevcut' : 'Eksik',
        clothingPrompt,
        gender,
        country,
        age,
        additionalInfo
      });

      console.log('🚀 Backend proxy üzerinden AI API çağrısı yapılıyor...');

      // FormData oluştur - Backend proxy için
      const formData = new FormData();
      
      // Kumaş fotoğrafını ekle
      if (fabricImage instanceof File) {
        formData.append('fabricImage', fabricImage);
      }

      // Backend proxy parametreleri
      console.log('📋 Customer Details:', customerDetails);
      console.log('📋 Order Details:', orderDetails);
      console.log('📋 Customer ID:', customerDetails?.id);
      console.log('📋 Order ID:', orderDetails?.id);
      
      // ID kontrolü - ZORUNLU
      if (!customerDetails?.id) {
        throw new Error('Müşteri bilgisi eksik. Lütfen müşteri seçin ve tekrar deneyin.');
      }
      if (!orderDetails?.id) {
        throw new Error('Sipariş bilgisi eksik. Lütfen sipariş seçin ve tekrar deneyin.');
      }
      
      formData.append('customerId', customerDetails.id);
      formData.append('orderId', orderDetails.id);
      formData.append('prompt', clothingPrompt);
      formData.append('gender', gender);
      formData.append('age', age.toString());
      formData.append('bodyType', additionalInfo); // Kısa body type
      
      console.log('📤 FormData customerId:', formData.get('customerId'));
      console.log('📤 FormData orderId:', formData.get('orderId'));

      // JWT token'ı al
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      // Backend proxy endpoint'ine çağrı yap
      const response = await fetch('https://erdalguda.online/api/ai-model/generate-proxy', {
        method: 'POST',
        headers: {
          // Content-Type header'ını ekleme - FormData otomatik ayarlar
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📡 API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AI API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorMessage = `AI API Error: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.message || errorData.error || response.statusText}`;
        } catch {
          errorMessage += ` - ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ AI API Success:', result);
      return result;

    } catch (error) {
      console.error('AI Model generation error:', error);
      throw error;
    }
  }

  /**
   * Müşteri ve sipariş bilgilerinden clothing prompt oluştur
   * @param {Object} customerDetails - Müşteri bilgileri
   * @param {Object} orderDetails - Sipariş bilgileri
   * @returns {string} Clothing prompt
   */
  generateClothingPrompt(customerDetails, orderDetails) {
    let prompt = '';

    if (orderDetails) {
      // Sipariş türüne göre prompt oluştur
      const productType = orderDetails.productType || orderDetails.garmentType;
      switch (productType?.toLowerCase()) {
        case 'takım elbise':
        case 'suit':
          prompt = 'A professional business suit with tailored fit';
          break;
        case 'gömlek':
        case 'shirt':
          prompt = 'A classic men\'s dress shirt with professional styling, formal business attire, clean and sophisticated look';
          break;
        case 'pantolon':
        case 'pants':
          prompt = 'Tailored dress pants with perfect fit';
          break;
        case 'ceket':
        case 'jacket':
          prompt = 'A sophisticated blazer with modern cut';
          break;
        default:
          prompt = `A ${productType} with professional tailoring`;
      }

      // Sipariş özelliklerini ekle
      if (orderDetails.specifications) {
        const specs = orderDetails.specifications;
        if (specs.collarType) prompt += `, ${specs.collarType} collar`;
        if (specs.buttonType) prompt += `, ${specs.buttonType} buttons`;
        if (specs.pocketType) prompt += `, ${specs.pocketType} pockets`;
      }
    } else {
      prompt = 'A professionally tailored garment';
    }

    // Müşteri özelliklerini ekle
    if (customerDetails) {
      prompt += ` designed for a professional look`;
    }

    return prompt;
  }

  /**
   * Müşteri bilgilerinden demografik bilgileri çıkar
   * @param {Object} customerDetails - Müşteri bilgileri
   * @param {number} customAge - Kullanıcı tarafından girilen yaş
   * @returns {Object} Demografik bilgiler
   */
  extractDemographics(customerDetails, customAge = null) {
    const demographics = {
      gender: 'man', // Her zaman erkek olarak ayarla
      age: customAge || 30, // Girilen yaş veya default 30
      country: 'France' // Her zaman Fransa olarak ayarla
    };

    // Yaş kontrolü - girilen yaş varsa kullan, yoksa 30
    if (customAge && customAge >= 20 && customAge <= 70) {
      demographics.age = customAge;
    }

    return demographics;
  }

  /**
   * Müşteri ölçülerinden vücut tipi açıklaması oluştur
   * @param {Object} customerDetails - Müşteri bilgileri
   * @returns {string} Vücut tipi açıklaması
   */
  generateBodyTypeDescription(customerDetails) {
    if (!customerDetails) {
      return 'average';
    }

    // Basit vücut tipi tanımlaması - API için kısa tutuyoruz
    if (customerDetails.height && customerDetails.weight) {
      const height = customerDetails.height / 100; // cm to m
      const weight = customerDetails.weight;
      const bmi = weight / (height * height);
      
      if (bmi < 18.5) return 'slim';
      if (bmi < 25) return 'average';
      if (bmi < 30) return 'athletic';
      return 'large';
    }

    // Measurements varsa basit analiz
    if (customerDetails.measurements) {
      const measurements = customerDetails.measurements;
      if (measurements.chest && measurements.waist) {
        const ratio = measurements.chest / measurements.waist;
        if (ratio > 1.3) return 'athletic';
        if (ratio < 1.1) return 'slim';
      }
    }

    return 'average';
  }

  /**
   * API anahtarının varlığını kontrol et
   * @returns {boolean} API key var mı?
   */
  hasApiKey() {
    // Credentials her zaman mevcut (mock mode için)
    const hasCredentials = !!this.credentials.email && !!this.credentials.password;
    
    // API key varsa gerçek API, yoksa mock mode
    return hasCredentials;
  }

  /**
   * Gerçek API key'in varlığını kontrol et
   * @returns {boolean} Gerçek API key var mı?
   */
  hasRealApiKey() {
    // Artık her zaman gerçek API kullanıyoruz
    return !!this.apiKey && !!this.credentials.email && !!this.credentials.password;
  }

  /**
   * API durumunu kontrol et
   * @returns {Promise<boolean>} API çalışıyor mu?
   */
  async checkApiStatus() {
    try {
      // Basit bir test çağrısı yapabiliriz
      // Şimdilik true döndürelim
      return true;
    } catch (error) {
      console.error('AI API status check failed:', error);
      return false;
    }
  }
}

// Singleton instance
const aiModelService = new AIModelService();

export default aiModelService;
