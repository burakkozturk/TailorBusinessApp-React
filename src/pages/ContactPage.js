// src/pages/ContactPage.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { Alert, Snackbar, CircularProgress } from '@mui/material';
import '../styles/ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:6767/api/messages', formData);
      setSuccessOpen(true);
      setFormData({ name: '', email: '', content: '' });
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSuccessOpen(false);
    setErrorOpen(false);
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Sub-Banner */}
      <div className="contact-banner">
        <div className="banner-heading">
          <p className="banner-subtitle">BİZE ULAŞIN</p>
        </div>
      </div>

      {/* Harita */}
      <div className="map-container">
        <iframe
          title="harita"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.126244866322!2d32.840266899999996!3d39.8490038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34452aa3aa57d%3A0x97837167bcb4f562!2sMakara%20Terzi%20(Tailor)%20Erdal%20G%C3%BCda!5e0!3m2!1sen!2str!4v1746228227557!5m2!1sen!2str"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* İletişim formu ve bilgiler */}
      <div className="contact-section">
        <div className="contact-form">
          <h2>Bize Ulaşın</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Adınız" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="E-posta" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            <textarea 
              name="content" 
              placeholder="Mesajınız" 
              required
              value={formData.content}
              onChange={handleChange}
            ></textarea>
            <button type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Gönder'}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>İletişim Bilgileri</h2>
          <p><strong>Telefon:</strong> +90 555 555 55 55</p>
          <p><strong>Adres:</strong> Nişantaşı, İstanbul</p>
          <p><strong>Çalışma Saatleri:</strong><br />Pazartesi - Cumartesi: 09:00 - 19:00<br />Pazar: Kapalı</p>
        </div>
      </div>

      <Snackbar open={successOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Mesajınız başarıyla gönderildi!
        </Alert>
      </Snackbar>

      <Snackbar open={errorOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  );
}

export default ContactPage;
