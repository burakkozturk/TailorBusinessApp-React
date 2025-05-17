// src/pages/AboutPage.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AboutPage.css';
import Testimonials from '../components/Testimonials';

function AboutPage() {
    return (
        <div className="about-page">
            <Navbar />

            {/* Sub-Banner with Title */}
            <div className="about-banner">
                <div className="banner-heading">
                    <p className="banner-subtitle">MARKAMIZ</p>
                </div>
            </div>


            {/* Bölüm 1 */}
            <section className="about-section">
                <div className="about-image img1"></div>
                <div className="about-text">
                    <h2>Ustalığın ve Zarafetin Buluştuğu Nokta</h2>
                    <p>
                        Her kıyafet bir hikâye anlatır. Biz, bu hikâyeyi sizin için dokuyoruz...
                    </p>
                    <p>
                        Amacımız yalnızca giyilebilir ürünler üretmek değil...
                    </p>
                </div>
            </section>

            {/* Bölüm 2 */}
            <section className="about-section alt">
                <div className="about-image img2"></div>
                <div className="about-text">
                    <h2>Müşterilerimizle Kurduğumuz Bağ</h2>
                    <p>
                        Erdal Güda deneyimi sadece bir alışveriş değil, bir yolculuktur...
                    </p>
                    <p>
                        Atölyemizde zaman kavramı kaliteye göre şekillenir...
                    </p>
                </div>
            </section>

            <div className="about-testimonials-wrapper">
                <Testimonials />
            </div>

            <Footer />
        </div>
    );
}

export default AboutPage;
