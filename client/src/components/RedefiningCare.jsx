import React from 'react';

export const RedefiningCare = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* SECTION TITLE & SUBTITLE */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight mb-2">
            Redefining Everyday Care with Purpose
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed">
            Experience everyday essentials reimagined with care and quality. NexBloom offers soft, strong, and eco-friendly tissue products for better living.
          </p>
        </div>

        {/*
          LAYOUT APPROACH:
          - All 4 images are 1024×1024 squares.
          - We want a fixed row height (~380px) and object-contain so nothing is cropped.
          - Left (3 cols) + Center (4 cols) = 2 square images side by side.
          - Right (3 cols) = 2 images stacked, each taking half the height.
          - object-contain + matching background = full product visible, no cut.
        */}
        <div
          className="grid grid-cols-10 gap-3 sm:gap-4"
          style={{ height: '420px' }}
        >
          {/* COL 1: Recycling poster */}
          <div
            className="col-span-3 overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: '#ece8de' }}
          >
            <img
              src="/redefine-recycling.webp"
              alt="Thoughtfully Made. Easily Recycled."
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          {/* COL 2: NexBloom Tissue Box */}
          <div
            className="col-span-4 overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: '#1e2e1e' }}
          >
            <img
              src="/redefine-tissue-box.webp"
              alt="NexBloom Facial Tissue Box"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>

          {/* COL 3: Two stacked cards */}
          <div className="col-span-3 flex flex-col gap-3 sm:gap-4">

            {/* Top: Toilet Roll */}
            <div
              className="flex-1 overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#f3ede4' }}
            >
              <img
                src="/redefine-toilet-roll.webp"
                alt="NexBloom Toilet Roll"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Bottom: Kitchen Roll */}
            <div
              className="flex-1 overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#f3ede4' }}
            >
              <img
                src="/redefine-kitchen-roll.webp"
                alt="NexBloom Kitchen Towel Roll"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
