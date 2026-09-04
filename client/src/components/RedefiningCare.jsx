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
          SEAMLESS 3-COLUMN CONTAINER:
          - Parent: rounded single frame with zero inner gaps
          - Col 1: aspect-square (1:1 square)
          - Col 2: aspect-square (1:1 square)
          - Col 3: aspect-square containing 2 equal height (h-1/2) stacked images
        */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch">
            
            {/* COLUMN 1: Recycling Poster (Left Square) */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#ece8de] flex items-center justify-center">
              <img
                src="/redefine-recycling.webp"
                alt="Thoughtfully Made. Easily Recycled."
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* COLUMN 2: Tissue Box (Middle Square, Exact Same Size) */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#1e2e1e] flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-200/50">
              <img
                src="/redefine-tissue-box.webp"
                alt="NexBloom Facial Tissue Box"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* COLUMN 3: 2 Stacked Images (Right Square, Exact Same Height & Width as Col 1 & 2) */}
            <div className="relative aspect-square w-full overflow-hidden flex flex-col border-t md:border-t-0 md:border-l border-slate-200/50">
              
              {/* Top Row: Toilet Roll (Takes 50% height) */}
              <div className="relative h-1/2 w-full overflow-hidden bg-[#f3ede4] flex items-center justify-center border-b border-slate-200/40">
                <img
                  src="/redefine-toilet-roll-wide.webp"
                  alt="NexBloom Toilet Roll"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Bottom Row: Kitchen Roll (Takes 50% height) */}
              <div className="relative h-1/2 w-full overflow-hidden bg-[#f9f7f3] flex items-center justify-center">
                <img
                  src="/redefine-kitchen-roll-wide.webp"
                  alt="NexBloom Kitchen Towel Roll"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
