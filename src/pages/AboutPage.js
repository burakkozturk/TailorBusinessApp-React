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
                <div className="about-image img1" aria-label="Terzilik çalışması görseli"></div>
                <div className="about-text">
                    <h2>Ustalığın ve Zarafetin Buluştuğu Nokta</h2>
                    <p>
                        Her kıyafet bir hikâye anlatır. Biz, bu hikâyeyi sizin için dokuyoruz. Erdal Güda olarak, 20 yılı aşkın deneyimimizle her dikişte mükemmelliği hedefliyoruz.
                    </p>
                    <p>
                        Amacımız yalnızca giyilebilir ürünler üretmek değil, aynı zamanda kimliğinizi ve tarzınızı yansıtan, özgün ve kaliteli parçalar sunmaktır.
                    </p>
                </div>
            </section>

            {/* Bölüm 2 */}
            <section className="about-section alt">
                <div className="about-image img2" aria-label="El işçiliği görseli"></div>
                <div className="about-text">
                    <h2>Müşterilerimizle Kurduğumuz Bağ</h2>
                    <p>
                        Erdal Güda deneyimi sadece bir alışveriş değil, bir yolculuktur. Her müşterimizin hikâyesini dinliyor, ihtiyaçlarını anlıyor ve özel çözümler sunuyoruz.
                    </p>
                    <p>
                        Atölyemizde zaman kavramı kaliteye göre şekillenir. Her parça, tasarımından son dikişine kadar titizlikle işlenir ve ancak en yüksek standartları karşıladığında sizinle buluşur.
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
