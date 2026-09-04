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
          SEAMLESS SINGLE CONTAINER (3 EQUAL COLUMNS, ZERO GAP):
          - Col 1 (1/3): Square recycling poster (same size)
          - Col 2 (1/3): Square tissue box (same size)
          - Col 3 (1/3): Exact same square size, divided into 2 equal stacked images (toilet roll + kitchen roll)
        */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm bg-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            
            {/* COLUMN 1: Recycling Poster (Left Square) */}
            <div className="aspect-square w-full relative overflow-hidden bg-[#ece8de] flex items-center justify-center">
              <img
                src="/redefine-recycling.webp"
                alt="Thoughtfully Made. Easily Recycled."
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* COLUMN 2: Tissue Box (Middle Square, Same Size) */}
            <div className="aspect-square w-full relative overflow-hidden bg-[#1e2e1e] flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-200/50">
              <img
                src="/redefine-tissue-box.webp"
                alt="NexBloom Facial Tissue Box"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* COLUMN 3: 2 Stacked Images (Right Square, Same Total Size as Left/Middle) */}
            <div className="aspect-square w-full grid grid-rows-2 gap-0 overflow-hidden border-t md:border-t-0 md:border-l border-slate-200/50">
              
              {/* Top Row: Toilet Roll */}
              <div className="relative overflow-hidden bg-[#f3ede4] flex items-center justify-center border-b border-slate-200/40">
                <img
                  src="/redefine-toilet-roll-wide.webp"
                  alt="NexBloom Toilet Roll"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Bottom Row: Kitchen Roll */}
              <div className="relative overflow-hidden bg-[#f9f7f3] flex items-center justify-center">
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
