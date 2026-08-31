import React from 'react';
import { Sprout, CheckCircle2, ArrowRight } from 'lucide-react';

export const GreenMission = ({ onExploreClick }) => {
  return (
    <section id="eco-story-section" className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 2-COLUMN SPLIT LAYOUT (Matching Reference Image) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual Gift Poster with Seeds & Living Plant Sprout */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-md border border-slate-200/80 group hover:shadow-xl transition-all duration-300">
              <img
                src="/eco-story-poster.png"
                alt="A Thoughtful Gift with Every Order - Free Seed Gifting"
                className="w-full h-auto object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: Narrative Story Matching Reference Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category Tag: ECO STORY */}
            <div>
              <span className="text-sm sm:text-base font-black text-[#1b4d3e] uppercase tracking-wider inline-block border-b-2 border-[#1b4d3e] pb-0.5">
                ECO STORY
              </span>
            </div>

            {/* Main Headline: Care That Goes Beyond You */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Care That Goes Beyond You
            </h2>

            {/* 3 Story Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <p>
                At NexBloom, care extends far beyond everyday essentials to creating a lasting, positive impact. Every thoughtfully designed pack reflects our commitment to premium quality, mindful living, and a cleaner future. With complimentary seeds included in every box, we invite you to take a small yet meaningful step towards nurturing nature and restoring balance to the environment.
              </p>

              <p>
                Our approach blends comfort with responsibility, offering tissue products that deliver exceptional softness, superior performance, and eco conscious innovation. From sourcing to packaging, every detail is designed to reduce environmental impact while enhancing your daily experience.
              </p>

              <p>
                NexBloom is not just about what you use, it is about what you contribute. By choosing smarter, more sustainable alternatives, you become part of a growing movement that values both personal care and planetary wellbeing. Because true care is not just felt, it is shared and sustained for generations to come.
              </p>
            </div>

            {/* Feature Checkpoints */}
            <div className="pt-2 flex items-center gap-6 text-xs sm:text-sm font-bold text-[#1b4d3e] flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Complimentary Seeds in Every Box
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                100% Virgin Botanical Pulp
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
