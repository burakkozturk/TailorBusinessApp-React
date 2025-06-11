import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Paper, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import GetAppIcon from '@mui/icons-material/GetApp';
import DevicesIcon from '@mui/icons-material/Devices';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import SettingsIcon from '@mui/icons-material/Settings';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductSlider from '../components/ProductSlider';
import '../styles/AboutPage.css';
import '../styles/CebinizdekiTerziniz.css';

// Özel stillendirilmiş bileşenler
const StyledSection = styled(Box)(({ theme }) => ({
  padding: '100px 0',
  position: 'relative',
}));

const GradientSection = styled(StyledSection)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f5dc 0%, #fff 100%)',
  color: '#2c2c2c',
}));

const ProductImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    background: 'radial-gradient(circle, rgba(160,144,96,0.3) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    zIndex: -1,
  }
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,230,0.9) 100%)',
  marginBottom: 25,
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  '& svg': {
    fontSize: 42,
    color: '#a09060',
  }
}));

const SpecCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  height: '100%',
  overflow: 'visible',
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  }
}));

const SpecCardContent = styled(CardContent)(({ theme }) => ({
  padding: 30,
}));

const GoldenTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  fontFamily: "'Playfair Display', serif",
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 80,
    height: 3,
    background: '#a09060',
  }
}));

const StepCard = styled(Card)(({ theme }) => ({
  borderRadius: 15,
  overflow: 'visible',
  position: 'relative',
  height: '100%',
  transition: 'transform 0.3s ease',
  background: 'white',
  boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  }
}));

const StepNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -25,
  left: 25,
  width: 50, 
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#a09060',
  color: 'white',
  borderRadius: '50%',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  boxShadow: '0 8px 20px rgba(160,144,96,0.3)',
  zIndex: 2,
}));

const CTAButton = styled(Button)(({ theme }) => ({
  padding: '15px 35px',
  borderRadius: 40,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1.1rem',
  letterSpacing: '0.5px',
  boxShadow: '0 8px 25px rgba(160,144,96,0.3)',
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(160,144,96,0.4)',
  }
}));

const AppScreenshot = styled(Box)(({ theme }) => ({
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
  transform: 'perspective(1000px) rotateY(-5deg)',
  transition: 'all 0.5s ease',
  '&:hover': {
    transform: 'perspective(1000px) rotateY(0deg)',
  }
}));

function CebinizdekiTerziniz() {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: false,
      mirror: true
    });
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Hero Banner */}
      <Box 
        sx={{ 
          background: 'linear-gradient(to bottom, #0a192f 0%, #0a192f 30%, #f5e6b0 70%, #fff 100%)',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 10 },
          pb: { xs: 10, md: 12 },
          mt: 0,
          borderTop: '1px solid rgba(245, 230, 176, 0.5)',
          borderBottom: '1px solid rgba(245, 230, 176, 0.5)',
          color: '#fff'
        }}
      >
        <Container sx={{ maxWidth: {xs: '100%', md: '90%'}, px: {xs: 2, md: 6} }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            maxWidth: {md: '550px'},
            position: 'relative',
            zIndex: 2,
            mb: {xs: 4, md: 7},
            mt: { xs: 3, md: 2 }
          }}>
            <Box sx={{ 
              width: '60px', 
              height: '3px', 
              bgcolor: '#f5e6b0', 
              mb: 3, 
              mt: 2 
            }} />
            
            <Typography variant="h1" component="h1" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3,
                color: '#fff',
                lineHeight: 1.2
              }}
            >
              Akıllı Vücut Mezurası
            </Typography>
            
            <Typography variant="subtitle1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.1rem' }, 
                lineHeight: 1.7, 
                color: 'rgba(255,255,255,0.9)',
                mb: 3.5,
                maxWidth: '95%'
              }}
            >
              Telefonunuzun sağlık uygulamalarına bağlanarak ölçümleri daha hızlı kaydetmenizi sağlar. 
              Ondan fazla kişinin yirmiden fazla farklı bölgelerine ait ölçülerini düzenli olarak 
              takip etmenizi sağlar.
            </Typography>
            
            <List sx={{ mb: 4, pl: 0 }}>
              {['Yapay zeka destekli sistem ile ölçüleri kullanarak elbise kesim şablonları oluşturabilir', 
               'AppStore veya Google Play üzerinden indirebileceğiniz Fitdays+ uygulaması ile yirmiden fazla vücut bölgesini ölçebilirsiniz',
               'Terzi olmanıza gerek yok, uygulama size adım adım rehberlik eder'].map((text, index) => (
                <ListItem key={index} sx={{ py: 1, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <CheckCircleIcon sx={{ color: '#f5e6b0', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={text} 
                    primaryTypographyProps={{ 
                      fontWeight: 500, 
                      fontSize: '0.95rem',
                      color: 'rgba(255,255,255,0.85)'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="body1" sx={{ 
              fontStyle: 'italic', 
              mb: 4, 
              color: 'rgba(255,255,255,0.8)',
              borderLeft: '2px solid #f5e6b0',
              pl: 2,
              py: 0.5 
            }}>
              "Artık terzi olmak çok kolay..."
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: {xs: 4, md: 6} }}>
              <a 
                href="https://www.erdalguda.com"
                className="btn-primary btn-pulse"
                style={{ textDecoration: 'none' }}
              >
                Hemen Satın Al
              </a>
              <a 
                href="#nasil-calisir"
                className="btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                Nasıl Çalışır?
              </a>
            </Box>
          </Box>
        </Container>
        
        {/* Ürün görseli - Absolute positioning */}
        <Box 
          sx={{ 
            position: {xs: 'relative', md: 'absolute'},
            right: {md: '5%'},
            bottom: {md: 0}, 
            top: {md: '50%'},
            transform: {md: 'translateY(-50%)'},
            width: {xs: '100%', md: '45%'},
            display: 'flex',
            justifyContent: 'center',
            height: {xs: 'auto', md: '90%'},
            zIndex: 3
          }}
        >
          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              height: {xs: '350px', md: '100%'},
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'visible'
            }}
          >
            <Box 
              component="img" 
              src="/img/product.png" 
              alt="Akıllı Vücut Mezurası" 
              sx={{ 
                maxWidth: {xs: '80%', md: '90%'},
                maxHeight: {xs: '300px', md: '80%'},
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.2))',
                transform: {xs: 'rotate(-5deg)', md: 'rotate(-8deg) translateY(-20px)'},
                mr: {xs: 0, md: 3},
                position: 'relative',
                zIndex: 5
              }} 
            />
            
            <Box sx={{
              position: 'absolute',
              left: {xs: '50%', md: '50%'},
              top: {xs: '50%', md: '50%'},
              transform: 'translate(-50%, -50%)',
              width: {xs: '280px', md: '380px'},
              height: {xs: '280px', md: '380px'},
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,230,176,0.3) 0%, rgba(245,230,176,0.1) 40%, rgba(255,255,255,0) 70%)',
              zIndex: 4,
              boxShadow: '0 0 60px 10px rgba(245,230,176,0.2)'
            }} />
            
            <Box
              sx={{
                position: 'absolute',
                right: {xs: '15%', md: '25%'},
                bottom: {xs: '15%', md: '25%'},
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                padding: '8px 14px',
                zIndex: 6,
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#0a192f', fontSize: '0.85rem' }}>ERDAL GÜDA</Typography>
            </Box>
            
            <Box
              sx={{
                position: 'absolute',
                left: {xs: '15%', md: '20%'},
                top: {xs: '10%', md: '25%'},
                background: 'white',
                borderRadius: '6px',
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                padding: '8px 14px',
                zIndex: 6,
                animation: 'float 3s ease-in-out infinite 1.5s',
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#0a192f', fontSize: '0.85rem' }}>EG-150</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Uygulama bölümü */}
      <StyledSection sx={{ background: '#f8f8f8', py: 8 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
            <GoldenTitle variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, paddingBottom: 2 }}>
              Fitdays+ Uygulaması
            </GoldenTitle>
            
            <Typography variant="body1" sx={{ mb: 5, fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 800, mx: 'auto' }}>
              AppStore veya Google Play üzeirinden indirebileceğiniz Fitdays+ uygulaması sayesinde yirmiden fazla vücut bölgesinin ölçümünü yapabilirsiniz. Merak etmeyin ölçüm yapmak için terzi olmanıza gerek yok, aplikasyon size adım adım ugulamanız gerekenleri tarif edecek.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }} data-aos="fade-up">
              <Box 
                sx={{ 
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  p: 4,
                  width: '100%',
                  maxWidth: 350,
                  minHeight: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 90, 
                    height: 90, 
                    background: '#f5f9ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <SmartphoneIcon sx={{ fontSize: 45, color: '#0a192f' }} />
                </Box>
                
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Kolay Kullanım
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Kullanıcı dostu arayüz ile saniyeler içinde ölçüm alın
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }} data-aos="fade-up" data-aos-delay="100">
              <Box 
                sx={{ 
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  p: 4,
                  width: '100%',
                  maxWidth: 350,
                  minHeight: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: 90, 
                    height: 90, 
                    background: '#f5f9ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}
                >
                  <TouchAppIcon sx={{ fontSize: 45, color: '#0a192f' }} />
                </Box>
                
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                  Hızlı Senkronizasyon
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Bluetooth ile mezuranıza anında bağlanır
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <a 
              href="https://www.erdalguda.com"
              className="btn-primary btn-icon"
              style={{ textDecoration: 'none' }}
            >
              <GetAppIcon sx={{ mr: 1 }} />
              Uygulamayı İndir
            </a>
          </Box>
        </Container>
      </StyledSection>
      
      {/* Ürün Galerisi */}
      <StyledSection sx={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)', py: 10 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
            <GoldenTitle variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, paddingBottom: 2 }}>
              Ürün Galerisi
            </GoldenTitle>
            
            <Typography variant="body1" sx={{ mb: 5, fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 800, mx: 'auto', color: '#666' }}>
              Erdal Güda'nın özenle hazırladığı ürün koleksiyonunu keşfedin. Her bir parça, ustalık ve kaliteyi yansıtan özel tasarımlardan oluşmaktadır.
            </Typography>
          </Box>
          
          <Box data-aos="fade-up" data-aos-delay="200">
            <ProductSlider />
          </Box>
        </Container>
      </StyledSection>
      
      {/* Nasıl Çalışır */}
      <StyledSection id="nasil-calisir">
        <Container>
          <Box sx={{ textAlign: 'center', mb: 5 }} data-aos="fade-up">
            <GoldenTitle variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, paddingBottom: 2 }}>
              Nasıl Çalışır?
            </GoldenTitle>
            <Typography variant="subtitle1" sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}>
              Yaptığınız ölçümleri kesim şablonuna dökmekte zorlanıyor musunuz? İşte çözüm için 4 basit adım:
            </Typography>
          </Box>
          
          <Box className="step-container" sx={{ mb: 4 }}>
            {[
              { 
                icon: <GetAppIcon />, 
                title: 'www.erdalguda.com adresine gidin', 
                desc: 'Resmi web sitemizi ziyaret edin ve hesap oluşturun'
              },
              { 
                icon: <DevicesIcon />, 
                title: 'İstediğiniz formatta ölçümlerinizi yükleyin', 
                desc: 'Akıllı mezura ile aldığınız ölçümleri sisteme aktarın'
              },
              { 
                icon: <MobileFriendlyIcon />, 
                title: 'Kesim yapmak istediğiniz ürünü seçin', 
                desc: 'Geniş ürün yelpazemizden dikiş modelinizi belirleyin'
              },
              { 
                icon: <PhoneAndroidIcon />, 
                title: 'Ve yapay zeka sizler için şablonu anında hazırlasın', 
                desc: 'Yapay zeka teknolojimiz özel ölçülerinize göre şablon oluşturur'
              },
            ].map((step, index) => (
              <Box className="step-item" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <StepCard sx={{ minHeight: '180px', mx: 'auto' }}>
                  <StepNumber sx={{ width: '30px', height: '30px', top: '-15px', left: '15px', fontSize: '0.9rem' }}>{index + 1}</StepNumber>
                  <CardContent sx={{ pt: 3, pb: 2, px: 1, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      <FeatureIcon sx={{ width: '50px', height: '50px', marginBottom: '10px' }}>{step.icon}</FeatureIcon>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                      {step.desc}
                    </Typography>
                  </CardContent>
                </StepCard>
              </Box>
            ))}
          </Box>
        </Container>
      </StyledSection>
      
      {/* Teknik Özellikler */}
      <GradientSection>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
            <GoldenTitle variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, paddingBottom: 2 }}>
              Teknik Özellikler
            </GoldenTitle>
            <Typography variant="subtitle1" sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}>
              Modern ve kullanışlı tasarımıyla giyim sektöründe devrim yaratan akıllı vücut mezuranızı tanıyın
            </Typography>
          </Box>
          
          <div className="specs-container">
            <div className="spec-box" data-aos="fade-up">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ fontSize: 28, color: '#0a192f', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Ürün Özellikleri
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div className="spec-item">
                  <span className="spec-label">Ürün İsmi</span>
                  <span className="spec-value">Akıllı Vücut Mezurası</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Ürün Modeli</span>
                  <span className="spec-value">EG-150</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Ölçü Birimi</span>
                  <span className="spec-value">cm/inch</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Ölçüm kapasitesi</span>
                  <span className="spec-value">150cm veya 60 inch</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Ürün Boyutları</span>
                  <span className="spec-value">78x70x27mm</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Hata Payı</span>
                  <span className="spec-value">+- 4mm</span>
                </div>
              </Box>
            </div>
            
            <div className="spec-box" data-aos="fade-up" data-aos-delay="100">
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BatteryChargingFullIcon sx={{ fontSize: 28, color: '#0a192f', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Teknik Veriler
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div className="spec-item">
                  <span className="spec-label">Batarya Kapasitesi</span>
                  <span className="spec-value">300mAh 1.11Wh</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Şarj Girişi</span>
                  <span className="spec-value">5V 0.5A</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Güç Tüketimi</span>
                  <span className="spec-value">2.5W</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Mobil Destekli Ölçüm Alma</span>
                  <span className="spec-value">Evet</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Özelleştirilebilir Ölçümler</span>
                  <span className="spec-value">Evet</span>
                </div>
                
                <div className="spec-item">
                  <span className="spec-label">Yapay Zeka Desteğiyle Kesim Kalıbı Tasarımı</span>
                  <span className="spec-value">Evet</span>
                </div>
              </Box>
            </div>
          </div>
        </Container>
      </GradientSection>
      
      {/* CTA Bölümü */}
      <StyledSection sx={{ backgroundColor: '#2c2c2c', color: 'white', py: 12 }}>
        <Container>
          <Box sx={{ textAlign: 'center' }} data-aos="fade-up">
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3, fontFamily: "'Playfair Display', serif" }}>
              Cebinizdeki Terziniz
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 700, mx: 'auto', mb: 5, fontSize: '1.1rem' }}>
              Yaptığınız ölçümleri kesim şablonuna dökmekte zorlanıyor musunuz?
              Erdal Güda'nın yapay zeka destekli akıllı vücut mezurası ile tüm ölçümleriniz otomatik olarak şablona dönüşsün.
            </Typography>
            
            <a 
              href="https://www.erdalguda.com"
              className="btn-primary btn-large btn-pulse"
              style={{ textDecoration: 'none' }}
              data-aos="zoom-in"
            >
              Hemen Sipariş Ver
            </a>
          </Box>
        </Container>
      </StyledSection>
      
      <Footer />
    </>
  );
}

export default CebinizdekiTerziniz; 