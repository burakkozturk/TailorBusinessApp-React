// YouTube URL işleme utility fonksiyonları

/**
 * YouTube URL'inden video ID'sini çıkarır
 * @param {string} url - YouTube URL'i
 * @returns {string|null} - Video ID veya null
 */
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[7].length === 11) ? match[7] : null;
};

/**
 * Video ID'den YouTube embed URL'i oluşturur
 * @param {string} videoId - YouTube video ID'si
 * @returns {string} - Embed URL'i
 */
export const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
};

/**
 * Video ID'den YouTube thumbnail URL'i oluşturur
 * @param {string} videoId - YouTube video ID'si
 * @param {string} quality - Thumbnail kalitesi (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {string} - Thumbnail URL'i
 */
export const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * YouTube URL'nin geçerli olup olmadığını kontrol eder
 * @param {string} url - YouTube URL'i
 * @returns {boolean} - Geçerli ise true
 */
export const isValidYouTubeUrl = (url) => {
  if (!url) return true; // Boş URL'e izin ver
  
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null;
};

/**
 * YouTube URL'ini normalize eder (standart watch URL formatına çevirir)
 * @param {string} url - YouTube URL'i
 * @returns {string|null} - Normalize edilmiş URL veya null
 */
export const normalizeYouTubeUrl = (url) => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
};

/**
 * Video ID'den YouTube API'den video bilgilerini getirir
 * Bu fonksiyon gelişmiş özellikler için kullanılabilir
 * @param {string} videoId - YouTube video ID'si
 * @returns {Promise<Object>} - Video bilgileri
 */
export const getVideoInfo = async (videoId) => {
  // YouTube API Key gerektirir, şimdilik sadece basic bilgileri döndürelim
  return {
    id: videoId,
    thumbnail: getYouTubeThumbnail(videoId),
    embedUrl: getYouTubeEmbedUrl(videoId)
  };
};

export default {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isValidYouTubeUrl,
  normalizeYouTubeUrl,
  getVideoInfo
}; 