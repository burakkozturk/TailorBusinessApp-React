import React, { useState } from 'react';
import '../styles/Contact.css';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Gönderilen form:', form);
    // Burada formu API'ye gönderin
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="contact-section">
      <header className="contact-header">
        <p className="contact-subtitle">İletişim</p>
        <h2 className="contact-title">Bize Ulaşın</h2>
        <p className="contact-description">
          Her türlü soru, öneri veya randevu talepleriniz için aşağıdaki formu doldurabilir, 
          haritamızdan konumumuzu görüntüleyebilirsiniz.
        </p>
      </header>

      <div className="contact-container">
        {/* Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Adınız</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Konu</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mesajınız</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="contact-button">
            Gönder
          </button>
        </form>

        {/* Harita */}
        <div className="contact-map">
          <iframe
            title="Erdal Güda Konum"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3063.126244866322!2d32.840266899999996!3d39.8490038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34452aa3aa57d%3A0x97837167bcb4f562!2sMakara%20Terzi%20(Tailor)%20Erdal%20G%C3%BCda!5e0!3m2!1sen!2str!4v1746228227557!5m2!1sen!2str"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
