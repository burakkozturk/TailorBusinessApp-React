import React, { useState } from 'react';
import './ImageUploadPDF.css';

const ImageUploadPDF = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Görsel dosyası seçildiğinde
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    // Sadece image/* tipinde dosyalar kabul et
    if (!file.type.startsWith('image/')) {
      setError('Lütfen sadece görsel dosyası seçin (PNG, JPG, JPEG)');
      return;
    }

    // Dosya boyutu kontrolü (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setError('');
    
    // FileReader ile base64'e çevir
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      console.log('📸 Görsel base64 formatında yüklendi:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64Length: base64String.length,
        base64Preview: base64String.substring(0, 50) + '...'
      });
      
      setSelectedImage(base64String);
      setImagePreview(base64String);
    };
    
    reader.onerror = () => {
      setError('Dosya okuma hatası');
    };
    
    reader.readAsDataURL(file);
  };

  // PDF oluştur ve indir
  const handleGeneratePDF = async () => {
    if (!selectedImage) {
      setError('Lütfen bir görsel seçin');
      return;
    }

    if (!customerName.trim()) {
      setError('Lütfen müşteri adını girin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 PDF oluşturma isteği gönderiliyor...');
      
      const response = await fetch('/api/pdf/generate-with-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          imageBase64: selectedImage,
          productType: 'Gömlek' // Varsayılan
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // PDF blob'unu al
      const pdfBlob = await response.blob();
      
      // PDF'i indir
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${customerName}_Pattern.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ PDF başarıyla oluşturuldu ve indirildi!');
      
    } catch (error) {
      console.error('❌ PDF oluşturma hatası:', error);
      setError('PDF oluşturulurken hata: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-upload-pdf">
      <h2>🎨 Görsel ile PDF Oluştur</h2>
      
      {/* Müşteri Adı */}
      <div className="form-group">
        <label htmlFor="customerName">Müşteri Adı:</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Müşteri adını girin..."
          className="form-input"
        />
      </div>

      {/* Görsel Yükleme */}
      <div className="form-group">
        <label htmlFor="imageUpload">Görsel Seç:</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageSelect}
          className="file-input"
        />
        <small className="help-text">
          PNG, JPG, JPEG formatları desteklenir (Max: 5MB)
        </small>
      </div>

      {/* Görsel Önizleme */}
      {imagePreview && (
        <div className="image-preview">
          <h4>Seçilen Görsel:</h4>
          <img 
            src={imagePreview} 
            alt="Seçilen görsel" 
            className="preview-image"
          />
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* PDF Oluştur Butonu */}
      <button
        onClick={handleGeneratePDF}
        disabled={!selectedImage || !customerName.trim() || isLoading}
        className={`generate-btn ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? '🔄 PDF Oluşturuluyor...' : '📄 PDF Oluştur ve İndir'}
      </button>

      {/* Bilgi */}
      <div className="info-box">
        <h4>ℹ️ Nasıl Kullanılır:</h4>
        <ol>
          <li>Müşteri adını girin</li>
          <li>Bir görsel dosyası seçin (PNG/JPG)</li>
          <li>"PDF Oluştur" butonuna tıklayın</li>
          <li>PDF otomatik olarak indirilecek</li>
        </ol>
      </div>
    </div>
  );
};

export default ImageUploadPDF;
