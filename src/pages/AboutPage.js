// src/pages/AboutPage.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AboutPage.css';
import Testimonials from '../components/Testimonials';
import useDocumentTitle from '../hooks/useDocumentTitle';

function AboutPage() {
    const { t } = useTranslation('common');
    useDocumentTitle(t('navigation.about'));

    return (
        <div className="about-page">
            <Navbar />

            {/* Sub-Banner with Title */}
            <div className="about-banner">
                <div className="banner-heading">
                    <p className="banner-subtitle">{t('aboutPage.brandTitle') || 'MARKAMIZ'}</p>
                </div>
            </div>


            {/* Bölüm 1 */}
            <section className="about-section">
                <div className="about-image img1" aria-label={t('aboutPage.tailoringImageAlt') || 'Terzilik çalışması görseli'}></div>
                <div className="about-text">
                    <h2>{t('aboutPage.section1.title') || 'Ustalığın ve Zarafetin Buluştuğu Nokta'}</h2>
                    <p>
                        {t('aboutPage.section1.paragraph1') || 'Her kıyafet bir hikâye anlatır. Biz, bu hikâyeyi sizin için dokuyoruz. Erdal Güda olarak, 20 yılı aşkın deneyimimizle her dikişte mükemmelliği hedefliyoruz.'}
                    </p>
                    <p>
                        {t('aboutPage.section1.paragraph2') || 'Amacımız yalnızca giyilebilir ürünler üretmek değil, aynı zamanda kimliğinizi ve tarzınızı yansıtan, özgün ve kaliteli parçalar sunmaktır.'}
                    </p>
                </div>
            </section>

            {/* Bölüm 2 */}
            <section className="about-section alt">
                <div className="about-image img2" aria-label={t('aboutPage.craftsmanshipImageAlt') || 'El işçiliği görseli'}></div>
                <div className="about-text">
                    <h2>{t('aboutPage.section2.title') || 'Müşterilerimizle Kurduğumuz Bağ'}</h2>
                    <p>
                        {t('aboutPage.section2.paragraph1') || 'Erdal Güda deneyimi sadece bir alışveriş değil, bir yolculuktur. Her müşterimizin hikâyesini dinliyor, ihtiyaçlarını anlıyor ve özel çözümler sunuyoruz.'}
                    </p>
                    <p>
                        {t('aboutPage.section2.paragraph2') || 'Atölyemizde zaman kavramı kaliteye göre şekillenir. Her parça, tasarımından son dikişine kadar titizlikle işlenir ve ancak en yüksek standartları karşıladığında sizinle buluşur.'}
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
