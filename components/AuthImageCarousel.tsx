
import React, { useState, useEffect } from 'react';

const images = [
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517026575980-3e1e2ded2ab4?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542372421-256952764f53?q=80&w=1964&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
];

const AuthImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-80 h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-red-900/20 border-4 border-gray-800">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Carousel image ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthImageCarousel;
