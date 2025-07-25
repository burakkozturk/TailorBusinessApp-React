import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Fade } from '@mui/material';
import { PlayArrow, YouTube } from '@mui/icons-material';
import { extractYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/youtubeUtils';

const YouTubePlayer = ({ youtubeUrl, title, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!youtubeUrl) return null;

  const videoId = extractYouTubeVideoId(youtubeUrl);
  if (!videoId) return null;

  const thumbnailUrl = getYouTubeThumbnail(videoId, 'maxresdefault');
  const embedUrl = getYouTubeEmbedUrl(videoId);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleIframeLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Paper 
      elevation={4} 
      className={className}
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
        aspectRatio: '16/9',
        maxWidth: '100%',
        '&:hover .play-overlay': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      {!isPlaying ? (
        // Thumbnail with play button
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handlePlay}
        >
          {/* Dark overlay */}
          <Box
            className="play-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Play button */}
            <IconButton
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#ff0000',
                width: 80,
                height: 80,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              <PlayArrow sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>

          {/* YouTube logo */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <YouTube sx={{ color: '#ff0000', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
              YouTube
            </Typography>
          </Box>

          {/* Video title overlay */}
          {title && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: 1,
                px: 2,
                py: 1,
                maxWidth: '70%'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {title}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        // YouTube iframe
        <Fade in={isPlaying} timeout={500}>
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {!isLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
              >
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Video yükleniyor...
                </Typography>
              </Box>
            )}
            <iframe
              width="100%"
              height="100%"
              src={`${embedUrl}&autoplay=1`}
              title={title || 'YouTube video player'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
              style={{
                border: 'none',
                borderRadius: 'inherit'
              }}
            />
          </Box>
        </Fade>
      )}
    </Paper>
  );
};

export default YouTubePlayer; 