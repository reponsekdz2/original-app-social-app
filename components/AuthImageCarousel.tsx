import React, { useState, useEffect } from 'react';

const images = [
  'https://images.pexels.com/photos/7130666/pexels-photo-7130666.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/19409815/pexels-photo-19409815.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7770433/pexels-photo-7770433.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const AuthImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="hidden md:block w-[380px] h-[580px] bg-black border-[14px] border-gray-800 rounded-[40px] shadow-2xl relative flex-shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-gray-800 rounded-b-lg"></div>
      <div className="w-full h-full rounded-[26px] overflow-hidden relative">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="Authentication showcase"
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthImageCarousel;