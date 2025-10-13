import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Login.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import useDocumentTitle from '../hooks/useDocumentTitle';

function Register() {
  const { t } = useTranslation('common');
  useDocumentTitle(t('auth.register.title'));
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'ÖLÇÜM' // Varsayılan rol
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError(t('auth.register.requiredFields') || 'Kullanıcı adı, şifre ve şifre tekrarı zorunludur');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError(t('auth.register.usernameMinLength') || 'Kullanıcı adı en az 3 karakter olmalıdır');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError(t('auth.register.passwordMinLength') || 'Şifre en az 6 karakter olmalıdır');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.passwordMismatch'));
      return false;
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t('auth.register.invalidEmail') || 'Geçerli bir e-posta adresi girin');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Kayıt isteği gönderiliyor:', {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
      
      // Kayıt işlemi - backend'de public bir endpoint olması gerekiyor
      const registerRes = await api.post('/auth/register', {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
      
      console.log('Kayıt yanıtı:', registerRes.data);
      
      if (registerRes.data.status === 'PENDING_APPROVAL') {
        const roleName = formData.role === 'ÖLÇÜM' ? 'Ölçüm' : formData.role === 'KESIMHANE' ? 'Kesimhane' : formData.role === 'DIKIMHANE' ? 'Dikimhane' : 'Admin';
        setSuccess(`Kayıt başarılı! ${roleName} rolü ile hesabınız admin onayı bekliyor. Onaylandıktan sonra giriş yapabilirsiniz.`);
        
        // Form'u temizle
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          role: 'ÖLÇÜM'
        });
        
        // 3 saniye sonra giriş sayfasına yönlendir
        setTimeout(() => {
          navigate('/giris');
        }, 3000);
      }
      
    } catch (err) {
      console.error('Kayıt hatası:', err);
      
      if (err.response?.data) {
        // Backend'den gelen hata mesajını kontrol et
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Kayıt işlemi başarısız. Lütfen tekrar deneyin.');
        }
      } else {
        setError('Kayıt işlemi başarısız. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-box" style={{ maxWidth: '450px' }}>
          <h2 className="login-title">{t('auth.register.title')}</h2>
          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success" style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '15px' }}>{success}</p>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder={`${t('auth.register.username')} *`}
              value={formData.username}
              onChange={handleChange}
              required
            />
            
            <div style={{ marginBottom: '15px' }}>
              <label 
                htmlFor="role" 
                style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  color: '#333', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {t('auth.register.role')} *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer'
                }}
              >
                <option value="ADMIN">{t('auth.register.roles.ADMIN')}</option>
                <option value="KESIMHANE">{t('auth.register.roles.KESIMHANE')}</option>
                <option value="DIKIMHANE">{t('auth.register.roles.DIKIMHANE')}</option>
                <option value="ÖLÇÜM">{t('auth.register.roles.ÖLÇÜM')}</option>

              </select>
            </div>
            
            <input
              type="password"
              name="password"
              placeholder={`${t('auth.register.password')} *`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <input
              type="password"
              name="confirmPassword"
              placeholder={`${t('auth.register.confirmPassword')} *`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <button 
              type="submit" 
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? (t('auth.register.registering') || 'Kayıt Yapılıyor...') : t('auth.register.registerButton')}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>{t('auth.register.hasAccount') || 'Zaten hesabınız var mı?'} </span>
            <Link 
              to="/giris" 
              style={{ 
                color: '#f5e6b0', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              {t('navigation.login')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register; 