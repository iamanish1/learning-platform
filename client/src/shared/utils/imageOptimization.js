// Image optimization utilities

export const getOptimizedImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return '';
  
  // If using a CDN that supports image optimization, add parameters
  // Example: Cloudinary, Imgix, etc.
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality}/`);
  }
  
  // For local images or other CDNs, return as-is
  // In production, you might want to use a service like Cloudinary
  return url;
};

export const lazyLoadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

