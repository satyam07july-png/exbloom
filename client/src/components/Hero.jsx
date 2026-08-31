import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 'banner-1',
    bgImage: '/hero-bg-1.webp',
    theme: 'light',
    headline: 'TRUSTED BY THOUSANDS OF MODERN HOMES.',
    subtitle: 'Upgrade Your Everyday Hygiene',
    ctaPrimary: 'Shop Now',
    ctaSecondary: null,
    category: 'All',
    alignment: 'left',
    headlineClass: 'text-[#1b4d3e]',
    subtitleClass: 'text-slate-700',
    btnClass: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 shadow-md',
  },
  {
    id: 'banner-2',
    bgImage: '/hero-bg-2.webp',
    theme: 'dark',
    headline: "India's #1 Choice for Premium Toilet Paper",
    subtitle: "Join NexBloom's Greener Mission with every purchase — grow more, waste less.",
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'Explore Our Mission',
    category: 'Toilet Roll',
    alignment: 'left',
    headlineClass: 'text-white',
    subtitleClass: 'text-emerald-100',
    btnClass: 'bg-white hover:bg-slate-100 text-slate-900 shadow-lg',
    btnSecondaryClass: 'bg-white/95 hover:bg-white text-slate-900 shadow-md',
  },
  {
    id: 'banner-3',
    bgImage: '/hero-bg-3.webp',
    theme: 'dark',
    headline: 'What If Every Purchase Gave Life Back To The Planet?',
    subtitle: 'Free seed gifting with every NexBloom order.',
    ctaPrimary: 'JOIN OUR GREENER MISSION',
    ctaSecondary: null,
    category: 'Green Mission',
    alignment: 'left',
    headlineClass: 'text-white',
    subtitleClass: 'text-slate-200',
    btnClass: 'bg-[#4b6a55] hover:bg-[#3d5945] text-white uppercase tracking-wider font-bold shadow-lg border border-white/20',
  },
];

export const Hero = ({ onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
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

  const slide = bannerSlides[currentSlide];

  return (
    <section 
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      className="relative w-full pt-16 md:pt-18 overflow-hidden bg-slate-950 select-none"
    >
      {/* ================= FULL-WIDTH EDGE-TO-EDGE BANNER CONTAINER ================= */}
      <div 
        className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[1024/575] max-h-[640px] flex items-center justify-center bg-slate-950"
      >
        
        {/* 1. Background Artwork Image (Transitions smoothly) */}
        <img
          key={`bg-${slide.id}`}
          src={slide.bgImage}
          alt={slide.headline}
          className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in transition-all duration-700 pointer-events-none"
        />

        {/* 2. Live Animated Text Overlay with Staggered Down-to-Up Animations */}
        <div 
          key={`content-${slide.id}`} 
          className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 h-full flex flex-col justify-center pointer-events-auto"
        >
          <div className="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
            
            {/* Headline H1 (Animates from bottom up) */}
            <h1 
              className={`animate-pop-1 text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.12] drop-shadow-sm ${slide.headlineClass}`}
            >
              {slide.headline}
            </h1>

            {/* Subtitle (Animates from bottom up with delay) */}
            <p 
              className={`animate-pop-2 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed drop-shadow-xs max-w-lg ${slide.subtitleClass}`}
            >
              {slide.subtitle}
            </p>

            {/* Action Buttons (Animates from bottom up with further delay) */}
            <div className="animate-pop-3 pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className={`px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${slide.btnClass}`}
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {slide.ctaSecondary && (
                <button
                  onClick={onExploreClick}
                  className={`px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${slide.btnSecondaryClass}`}
                >
                  {slide.ctaSecondary}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ================= SLIDER ARROWS (Left / Right) ================= */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 cursor-pointer shadow-xl active:scale-90 border border-white/20"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 cursor-pointer shadow-xl active:scale-90 border border-white/20"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* ================= BOTTOM SLIDE INDICATORS ================= */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-xs shadow-md"
        >
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-7 bg-white shadow-xs'
                  : 'w-2 bg-white/40 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
