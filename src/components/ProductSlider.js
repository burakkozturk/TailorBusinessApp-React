import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// Ürün fotoğrafları listesi
const productImages = [
  { id: 1, src: '/img/product-1.jpeg', alt: 'Ürün 1' },
  { id: 2, src: '/img/product-2.jpeg', alt: 'Ürün 2' },
  { id: 3, src: '/img/product-3.jpeg', alt: 'Ürün 3' },
  { id: 4, src: '/img/product-4.jpeg', alt: 'Ürün 4' },
  { id: 5, src: '/img/product-5.jpeg', alt: 'Ürün 5' },
  { id: 6, src: '/img/product-6.jpeg', alt: 'Ürün 6' },
  { id: 7, src: '/img/product-7.jpeg', alt: 'Ürün 7' },
  { id: 8, src: '/img/product-8.jpeg', alt: 'Ürün 8' },
  { id: 9, src: '/img/product-9.jpeg', alt: 'Ürün 9' },
  { id: 10, src: '/img/product-10.jpeg', alt: 'Ürün 10' }
];

// Styled Components
const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  background: '#fff'
}));

const SliderWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '600px',
  overflow: 'hidden',
  borderRadius: '20px',
  [theme.breakpoints.down('md')]: {
    height: '450px'
  },
  [theme.breakpoints.down('sm')]: {
    height: '350px'
  }
}));

const SlideImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center',
  transition: 'transform 0.5s ease',
  backgroundColor: '#f8f9fa',
  '&:hover': {
    transform: 'scale(1.02)'
  }
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.9)',
  color: '#0a192f',
  width: '50px',
  height: '50px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  zIndex: 2,
  '&:hover': {
    backgroundColor: '#f5e6b0',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
  }
}));

const PrevButton = styled(NavigationButton)(({ theme }) => ({
  left: '20px'
}));

const NextButton = styled(NavigationButton)(({ theme }) => ({
  right: '20px'
}));

const DotsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '12px',
  padding: '20px',
  backgroundColor: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)'
}));

const Dot = styled(Box)(({ theme, active }) => ({
  width: active ? '30px' : '12px',
  height: '12px',
  borderRadius: '6px',
  backgroundColor: active ? '#f5e6b0' : 'rgba(160,144,96,0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? '#e6d79e' : 'rgba(160,144,96,0.5)',
    transform: 'scale(1.1)'
  }
}));

const ImageCounter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '500',
  zIndex: 2
}));

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Minimum swipe mesafesi
  const minSwipeDistance = 50;

  // Otomatik geçiş
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % productImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Klavye navigasyonu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key >= '1' && event.key <= '9') {
        const index = parseInt(event.key) - 1;
        if (index < productImages.length) {
          goToSlide(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resim değiştiğinde loading state'i sıfırla
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % productImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Touch event handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <SliderContainer
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Ürün galerisi"
      tabIndex={0}
    >
      <SliderWrapper>
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f9fa',
              zIndex: 1
            }}
          >
            <Typography variant="body2" sx={{ color: '#666' }}>
              Yükleniyor...
            </Typography>
          </Box>
        )}
        
        <SlideImage
          src={productImages[currentIndex].src}
          alt={`${productImages[currentIndex].alt} - Erdal Güda koleksiyonundan`}
          loading="lazy"
          draggable={false}
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        <ImageCounter>
          {currentIndex + 1} / {productImages.length}
        </ImageCounter>

        <PrevButton 
          onClick={goToPrevious} 
          aria-label="Önceki ürün resmi"
          tabIndex={0}
        >
          <ChevronLeft fontSize="large" />
        </PrevButton>

        <NextButton 
          onClick={goToNext} 
          aria-label="Sonraki ürün resmi"
          tabIndex={0}
        >
          <ChevronRight fontSize="large" />
        </NextButton>
      </SliderWrapper>

      <DotsContainer role="tablist" aria-label="Ürün resimleri navigasyonu">
        {productImages.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`${index + 1}. ürün resmini göster`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
              }
            }}
          />
        ))}
      </DotsContainer>
    </SliderContainer>
  );
};

export default ProductSlider; 