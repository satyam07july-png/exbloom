import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 'banner-1',
    image: '/hero-banner-1.png',
    alt: 'Trusted By Thousands of Modern Homes - NexBloom Everyday Hygiene',
    action: 'explore',
    category: 'All',
  },
  {
    id: 'banner-2',
    image: '/hero-banner-2.png',
    alt: "India's #1 Choice for Premium Toilet Paper - NexBloom",
    action: 'category',
    category: 'Toilet Roll',
  },
  {
    id: 'banner-3',
    image: '/hero-banner-3.png',
    alt: 'What If Every Purchase Gave Life Back To The Planet? - NexBloom Greener Mission',
    action: 'story',
  },
];

export const Hero = ({ onExploreClick, onSelectCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const prevSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const handleBannerClick = (slide) => {
    if (slide.action === 'story') {
      const el = document.getElementById('eco-story-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (slide.action === 'category' && onSelectCategory) {
      onSelectCategory(slide.category);
      return;
    }
    if (onExploreClick) {
      onExploreClick();
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section 
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      className="relative w-full pt-16 md:pt-18 overflow-hidden bg-slate-950 select-none"
    >
      {/* ================= FULL-WIDTH EDGE-TO-EDGE BANNER CONTAINER ================= */}
      <div 
        className="relative w-full max-w-[1920px] mx-auto overflow-hidden bg-slate-950 flex items-center justify-center"
        style={{ aspectRatio: '2048 / 1150' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* All Slides Rendered for Instant Preload & 60fps Crossfade */}
        {bannerSlides.map((slide, idx) => (
          <div
            key={slide.id}
            onClick={() => handleBannerClick(slide)}
            title="Click to explore"
            className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center select-none"
              draggable={false}
            />
          </div>
        ))}

        {/* ================= SLIDER ARROWS (Left / Right) ================= */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 cursor-pointer shadow-xl active:scale-95 border border-white/20"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 cursor-pointer shadow-xl active:scale-95 border border-white/20"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* ================= BOTTOM SLIDE INDICATORS ================= */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/45 px-3 sm:px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-md"
        >
          {bannerSlides.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 sm:w-8 bg-white shadow-xs'
                  : 'w-1.5 sm:w-2 bg-white/45 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
