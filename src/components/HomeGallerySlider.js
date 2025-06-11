import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AOS from 'aos';
import '../styles/HomeGallerySlider.css';

// Home fotoğrafları listesi
const homeImages = [
  { id: 1, src: './img/home1.jpg', alt: 'Erdal Güda Atölyesi 1' },
  { id: 2, src: './img/home2.jpg', alt: 'Erdal Güda Atölyesi 2' },
  { id: 3, src: './img/home3.jpg', alt: 'Erdal Güda Atölyesi 3' },
  { id: 4, src: './img/home4.jpg', alt: 'Erdal Güda Atölyesi 4' },
  { id: 5, src: './img/home5.jpg', alt: 'Erdal Güda Atölyesi 5' },
  { id: 6, src: './img/home6.jpg', alt: 'Erdal Güda Atölyesi 6' },
  { id: 7, src: './img/home7.jpg', alt: 'Erdal Güda Atölyesi 7' },
  { id: 8, src: './img/home8.jpg', alt: 'Erdal Güda Atölyesi 8' },
  { id: 9, src: './img/home9.jpg', alt: 'Erdal Güda Atölyesi 9' },
  { id: 10, src: './img/home10.jpg', alt: 'Erdal Güda Atölyesi 10' },
  { id: 11, src: './img/home11.jpg', alt: 'Erdal Güda Atölyesi 11' },
  { id: 12, src: './img/home12.jpg', alt: 'Erdal Güda Atölyesi 12' },
  { id: 13, src: './img/home13.jpg', alt: 'Erdal Güda Atölyesi 13' },
  { id: 14, src: './img/home14.jpg', alt: 'Erdal Güda Atölyesi 14' }
];

// Styled Components
const GallerySection = styled(Box)(({ theme }) => ({
  padding: '80px 0',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
  position: 'relative'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  marginBottom: '20px',
  color: '#2c2c2c',
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 3,
    background: 'linear-gradient(90deg, #f5e6b0, #a09060)',
    borderRadius: '2px'
  }
}));

const SliderWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  height: '400px',
  overflow: 'hidden',
  borderRadius: '15px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  [theme.breakpoints.down('md')]: {
    height: '350px'
  },
  [theme.breakpoints.down('sm')]: {
    height: '250px'
  }
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
}));

const SliderTrack = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  willChange: 'transform'
}));

const SlideItem = styled(Box)(({ theme }) => ({
  minWidth: '300px',
  height: '100%',
  marginRight: '20px',
  position: 'relative',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 2
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '250px',
    marginRight: '15px'
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '200px',
    marginRight: '10px'
  }
}));

const SliderImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: '10px',
  transition: 'filter 0.3s ease',
  '&:hover': {
    filter: 'brightness(1.1)'
  }
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  color: 'white',
  padding: '20px 15px 15px',
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease',
  '.slide-item:hover &': {
    transform: 'translateY(0)'
  }
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '4px',
  background: 'linear-gradient(90deg, #f5e6b0, #a09060)',
  transition: 'width 3s linear',
  zIndex: 3,
  borderRadius: '0 0 15px 15px'
}));

const SlideCounter = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: '#f5e6b0',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  zIndex: 4,
  backdropFilter: 'blur(10px)'
}));

const PauseIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  left: '20px',
  backgroundColor: 'rgba(0,0,0,0.8)',
  color: '#f5e6b0',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '600',
  zIndex: 4,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backdropFilter: 'blur(10px)'
}));

const PulseDot = styled(Box)(({ theme }) => ({
  width: '8px',
  height: '8px',
  backgroundColor: '#f5e6b0',
  borderRadius: '50%',
  animation: 'pulse 1.5s infinite'
}));

const HomeGallerySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });

    // Responsive slides sayısını ayarla
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setSlidesToShow(1);
      } else if (width < 900) {
        setSlidesToShow(2);
      } else if (width < 1200) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Otomatik geçiş
  useEffect(() => {
    if (isPaused) return;

    const maxIndex = homeImages.length - slidesToShow;
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
      setProgress(0);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, slidesToShow]);

  // Progress bar
  useEffect(() => {
    if (isPaused) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / 30); // 3 saniyede 100%
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentIndex, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const getTranslateX = () => {
    const slideWidth = 300 + 20; // slide width + margin
    return -(currentIndex * slideWidth);
  };

  return (
    <GallerySection>
      <Container>
        <Box sx={{ textAlign: 'center', mb: 6 }} data-aos="fade-up">
          <SectionTitle variant="h3" component="h2">
            Atölyemizden Kareler
          </SectionTitle>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem', 
              lineHeight: 1.8, 
              maxWidth: 700, 
              mx: 'auto', 
              color: '#666',
              mt: 3
            }}
          >
            Erdal Güda atölyesinin içinden özel anlar ve ustalık detayları. 
            Her kare, kalite ve özenin bir yansıması.
          </Typography>
        </Box>

        <Box data-aos="fade-up" data-aos-delay="200">
          <SliderWrapper
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SliderContainer>
              <SliderTrack
                sx={{
                  transform: `translateX(${getTranslateX()}px)`,
                  width: `${homeImages.length * 320}px`
                }}
              >
                {homeImages.map((image, index) => (
                  <SlideItem 
                    key={image.id} 
                    className="slide-item"
                    sx={{
                      opacity: index >= currentIndex && index < currentIndex + slidesToShow ? 1 : 0.7
                    }}
                  >
                    <SliderImage
                      src={image.src}
                      alt={image.alt}
                      onError={(e) => {
                        console.error(`Fotoğraf yüklenemedi: ${image.src}`);
                        e.target.style.display = 'none';
                      }}
                    />
                    <ImageOverlay>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {image.alt}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Erdal Güda Atölyesi
                      </Typography>
                    </ImageOverlay>
                  </SlideItem>
                ))}
              </SliderTrack>

              <SlideCounter>
                {Math.min(currentIndex + slidesToShow, homeImages.length)} / {homeImages.length}
              </SlideCounter>

              {isPaused && (
                <PauseIndicator>
                  <PulseDot />
                  Duraklatıldı
                </PauseIndicator>
              )}

              {!isPaused && (
                <ProgressBar sx={{ width: `${progress}%` }} />
              )}
            </SliderContainer>
          </SliderWrapper>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }} data-aos="fade-up" data-aos-delay="400">
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#888',
              fontStyle: 'italic'
            }}
          >
            Otomatik kayan galeri • {homeImages.length} fotoğraf • Duraklatmak için üzerine gelin
          </Typography>
        </Box>
      </Container>
    </GallerySection>
  );
};

export default HomeGallerySlider; 