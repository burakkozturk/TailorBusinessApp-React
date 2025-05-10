import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import Navbar from './Navbar';
import Footer from './Footer';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:6767/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Giriş bilgileri hatalı!');
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
            <button type="submit">Giriş</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
