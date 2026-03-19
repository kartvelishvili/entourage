import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BeforeAfterSlider = ({ imageBefore, imageAfter, title, override = false }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);

  // Default images if not overridden
  const defaultImages = [
    {
      before: 'https://ihost.ge/s3/site-entourage-ge/images/results/before-after-cosmetic-operation.jpg',
      after: 'https://ihost.ge/s3/site-entourage-ge/images/results/before-after-cosmetic-operation.jpg',
      title: 'კოსმეტიკური პროცედურა',
    },
    {
      before: 'https://ihost.ge/s3/site-entourage-ge/images/results/female-double-chin-before-after.jpg',
      after: 'https://ihost.ge/s3/site-entourage-ge/images/results/female-double-chin-before-after.jpg',
      title: 'ნიკაპის კორექცია',
    },
    {
      before: 'https://ihost.ge/s3/site-entourage-ge/images/results/plastic-surgery-results-nasolabial.jpg',
      after: 'https://ihost.ge/s3/site-entourage-ge/images/results/plastic-surgery-results-nasolabial.jpg',
      title: 'ნაოჭების კორექცია',
    },
    {
      before: 'https://ihost.ge/s3/site-entourage-ge/images/results/woman-before-after-makeup.jpg',
      after: 'https://ihost.ge/s3/site-entourage-ge/images/results/woman-before-after-makeup.jpg',
      title: 'სრული ტრანსფორმაცია',
    },
    {
      before: 'https://ihost.ge/s3/site-entourage-ge/images/results/womans-clean-face-before-after.jpg',
      after: 'https://ihost.ge/s3/site-entourage-ge/images/results/womans-clean-face-before-after.jpg',
      title: 'ანტი-აგინგ მკურნალობა',
    },
  ];

  const currentImage = override ? { before: imageBefore, after: imageAfter, title } : defaultImages[activeIndex];

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const nextSlide = () => {
    if(override) return;
    setActiveIndex((prev) => (prev + 1) % defaultImages.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    if(override) return;
    setActiveIndex((prev) => (prev - 1 + defaultImages.length) % defaultImages.length);
    setSliderPosition(50);
  };

  return (
    <div className="space-y-8 w-full h-full">
      <div className="relative w-full h-full min-h-[300px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-full rounded-xl overflow-hidden shadow-lg select-none cursor-ew-resize"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          {/* After Image (Full) */}
          <img
            src={currentImage.after}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={currentImage.before}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
          </div>

          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-black">
              <div className="flex gap-0.5">
                <ChevronLeft size={14} />
                <ChevronRight size={14} />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            After
          </div>
        </motion.div>

        {/* Navigation Buttons (Only if not overridden) */}
        {!override && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
             {/* Thumbnails */}
            <div className="flex justify-center gap-4 overflow-x-auto pt-6 pb-2">
                {defaultImages.map((image, index) => (
                <button
                    key={index}
                    onClick={() => {
                    setActiveIndex(index);
                    setSliderPosition(50);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex
                        ? 'border-primary-purple scale-110'
                        : 'border-transparent hover:border-primary-purple/50'
                    }`}
                >
                    <img
                    src={image.before}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    />
                </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BeforeAfterSlider;