import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const HeroSection = () => {
  const { heroSlides, s } = useContent();
  const images = heroSlides.length > 0
    ? heroSlides.map(slide => slide.image)
    : ['https://ihost.ge/s3/site-entourage-ge/images/hero/hero-slide-1.jpg'];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, images.length]);

  return (
    <section className="relative h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img
            src={images[currentIndex]}
            alt="Aesthetic Center"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white font-bold text-sm mb-6"
          >
            {s('hero.badge', 'პრემიუმ ესთეტიკური ცენტრი')}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight font-display"
          >
            {s('hero.title_line1', 'სილამაზე')}
            <span className="block text-primary-purple text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-pink-500">
              {s('hero.title_line2', 'დეტალებშია')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-body"
          >
            {s('hero.subtitle', 'აღმოაჩინეთ სილამაზის ახალი სტანდარტები ბაია კონდრატიევას ესთეტიკურ ცენტრში.')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 bg-primary-purple hover:bg-primary-purple/90 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-primary-purple/30 transition-all hover:scale-105"
            >
              {s('hero.cta_text', 'დაჯავშნე კონსულტაცია')}
              <ChevronRight size={20} />
            </Link>
            <Link
              to="/procedures"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105"
            >
              პროცედურები
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative p-1"
              aria-label={`სლაიდი ${index + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'w-8 h-2.5 bg-white shadow-lg shadow-white/30'
                    : 'w-2.5 h-2.5 bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;