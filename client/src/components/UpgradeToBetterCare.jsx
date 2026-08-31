import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  [
    {
      id: 1,
      title: 'Kitchen Spill Absorption',
      subtitle: '3X Liquid & Grease Wiping',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'SilkTouch Skincare Wipes',
      subtitle: 'Dermatologist Safe & Gentle',
      image: 'https://images.unsplash.com/photo-1512290900672-1f02e3597c5e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Everyday Family Comfort',
      subtitle: 'Safe for Toddlers & Kids',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    },
  ],
  [
    {
      id: 4,
      title: 'Eco-Friendly Plant Seeds',
      subtitle: 'Gifted with Every Box',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      title: 'CloudSoft 3-Ply Toilet Rolls',
      subtitle: '100% Flushable & Clog-Free',
      image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      title: 'Table & Dining Luxury',
      subtitle: 'Embossed Soft Napkins',
      image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80',
    },
  ],
];

export const UpgradeToBetterCare = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentCards = slides[currentSlideIndex];

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. SECTION TITLE & SUBTITLE ================= */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
            Upgrade to Better Care
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-700 tracking-wide">
            Softness you feel. Strength you trust. Care you deserve.
          </p>
        </div>

        {/* ================= 2. 3-IMAGE CAROUSEL ROW WITH CHEVRONS ================= */}
        <div className="relative flex items-center justify-between gap-2 sm:gap-4 mb-6">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="flex-none p-2 rounded-full text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
          </button>

          {/* 3 Square Aspect Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 animate-fade-in">
            {currentCards.map((card) => (
              <div
                key={card.id}
                className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200/80 transition-all duration-300 group cursor-pointer bg-slate-100"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="text-white space-y-0.5">
                    <p className="text-sm font-bold">{card.title}</p>
                    <p className="text-xs text-slate-200">{card.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="flex-none p-2 rounded-full text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-7 h-7 stroke-[1.5]" />
          </button>

        </div>

        {/* ================= 3. CAROUSEL PAGINATION DOTS (● ○) ================= */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                currentSlideIndex === index
                  ? 'bg-slate-800 scale-110'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
