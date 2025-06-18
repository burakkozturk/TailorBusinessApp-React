import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import useDocumentTitle from '../hooks/useDocumentTitle';

function Login() {
  useDocumentTitle('Giriş Yap');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await api.post('/auth/login', {
        username,
        password,
      });
      
      // AuthContext üzerinden giriş yapma
      login({
        token: res.data.token,
        role: res.data.role,
        username: res.data.username,
        userType: res.data.userType
      });
      
      navigate('/admin');
    } catch (err) {
      console.error('Giriş hatası:', err);
      
      if (err.response?.status === 401) {
        // Backend'den gelen hata mesajını kontrol et
        let errorMessage = 'Giriş bilgileri hatalı!';
        
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            if (err.response.data.includes('onaylanmamış')) {
              errorMessage = 'Hesabınız henüz admin tarafından onaylanmamış. Lütfen onay bekleyin.';
            } else {
              errorMessage = err.response.data;
            }
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        }
        
        setError(errorMessage);
      } else {
        setError('Giriş bilgileri hatalı!');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-box">
          <h2 className="login-title">Giriş Yap</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-secondary">Giriş</button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>Hesabınız yok mu? </span>
            <Link 
              to="/kayit" 
              style={{ 
                color: '#f5e6b0', 
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
