import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService.ts';
import type { AuthCarouselImage } from '../types.ts';

const AuthImageCarousel: React.FC = () => {
  const [images, setImages] = useState<AuthCarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageData = await api.getCarouselImages();
        setImages(imageData);
      } catch (error) {
        console.error('Failed to fetch carousel images:', error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(timer);
    }
  }, [images.length]);

  if (images.length === 0) {
    return <div className="w-96 h-[580px] bg-gray-800 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="relative w-96 h-[580px] overflow-hidden rounded-lg shadow-2xl">
      {images.map((image, index) => (
        <img
          key={image.id}
          src={image.image_url}
          alt={`Carousel image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default AuthImageCarousel;
