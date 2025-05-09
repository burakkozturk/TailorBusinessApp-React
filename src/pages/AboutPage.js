// src/pages/AboutPage.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AboutPage.css';
import Testimonials from '../components/Testimonials'; // üst kısma ekle

function AboutPage() {
    return (
        <div className="about-page">
            <Navbar />

            {/* Minimal Hero */}
            <div className="about-hero-minimal" />

            <div className="about-heading">
                <p className="subtitle">MARKAMIZ</p>
                <h1 className="title">Erdal Güda</h1>
            </div>

            {/* Bölüm 1 */}
            <section className="about-section">
                <div className="about-image img1"></div>
                <div className="about-text">
                    <h2>Ustalığın ve Zarafetin Buluştuğu Nokta</h2>
                    <p>
                        Her kıyafet bir hikâye anlatır. Biz, bu hikâyeyi sizin için dokuyoruz. Erdal Güda olarak,
                        nesilden nesile aktarılan terzilik geleneğini günümüzün modern stil anlayışıyla birleştiriyoruz.
                        Her bir parça; özenle seçilmiş kumaşlar, el işçiliğiyle oluşturulmuş dikiş detayları ve tamamen
                        kişiye özel kalıplarla hayata geçirilir.
                    </p>
                    <p>
                        Amacımız yalnızca giyilebilir ürünler üretmek değil; kişinin kendini içinde bulduğu, özgüvenle
                        taşıyabileceği özel tasarımlar sunmaktır. Bizim için terzilik, bir zanaat olmanın ötesinde bir
                        ifade biçimidir.
                    </p>
                </div>
            </section>

            {/* Bölüm 2 */}
            <section className="about-section alt">
                <div className="about-image img2"></div>
                <div className="about-text">
                    <h2>Müşterilerimizle Kurduğumuz Bağ</h2>
                    <p>
                        Erdal Güda deneyimi sadece bir alışveriş değil, bir yolculuktur. Müşterilerimizle kurduğumuz
                        güçlü iletişim, onların beklenti ve tarzlarını derinlemesine anlayabilmemizi sağlar. İlk provadan
                        son düğmeye kadar her adımda karşılıklı güven ve memnuniyet önceliğimizdir.
                    </p>
                    <p>
                        Atölyemizde zaman kavramı kaliteye göre şekillenir. Aceleye yer yoktur, çünkü her detayın en iyisini
                        hak ettiğinizi biliyoruz. Kalıcılığı olan parçalar yaratmak için sabırla çalışıyor, sizi yansıtan
                        tasarımlar üretiyoruz.
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
