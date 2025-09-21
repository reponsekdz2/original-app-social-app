import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService.ts';

const AuthImageCarousel: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const carouselImages = await api.getAuthCarouselImages();
        if (carouselImages.length > 0) {
          setImages(carouselImages.map(img => img.image_url));
        }
      } catch (error) {
        console.error("Failed to fetch carousel images:", error);
        // Fallback to default images if API fails
        setImages([
          'https://images.unsplash.com/photo-1528732263494-242a3536015c?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
        ]);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
      return (
        <div className="relative w-full max-w-[280px] h-[540px] bg-black rounded-3xl border-8 border-gray-800 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading images...</p>
        </div>
      );
  }

  return (
    <div className="relative w-full max-w-[280px] h-[540px] bg-black rounded-3xl border-8 border-gray-800 overflow-hidden shadow-2xl shadow-red-900/10">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Carousel image ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default AuthImageCarousel;