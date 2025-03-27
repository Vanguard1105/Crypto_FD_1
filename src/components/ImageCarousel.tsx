import React, { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  theme: 'dark' | 'light';
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, interval = 4000, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-violet-500/30 mix-blend-overlay" />
        </div>
      ))}
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? theme === 'dark'
                  ? 'bg-white w-3'
                  : 'bg-blue-500 w-3'
                : theme === 'dark'
                ? 'bg-white/50'
                : 'bg-blue-500/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;