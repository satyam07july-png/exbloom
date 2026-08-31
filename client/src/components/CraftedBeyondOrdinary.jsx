import React from 'react';
import { 
  Feather, 
  Sprout, 
  Sparkles, 
  ShieldCheck, 
  Palette, 
  Leaf, 
  Heart,
  CheckCircle2
} from 'lucide-react';

const pillars = [
  {
    icon: Feather,
    title: 'Unmatched Softness & Strength',
    description:
      'NexBloom tissues are designed with ultra-soft, 5X stronger sheets that feel gentle on your skin while staying durable during use. Perfect for sensitive skin, daily hygiene, and makeup removal without tearing.',
    badge: '5X Stronger',
  },
  {
    icon: Sprout,
    title: 'Beauty That Gives Back',
    description:
      'NexBloom goes beyond comfort. With complimentary seeds in every box, we invite you to be part of something bigger because true luxury cares for both you and the planet.',
    badge: 'Free Seeds Inside',
  },
  {
    icon: Sparkles,
    title: 'Premium Everyday Convenience',
    description:
      'Whether at home, office, or on the go, NexBloom offers 100 Pulls & 200 pulls boxes, ensuring long-lasting value and convenience for your daily needs.',
    badge: '100 & 200 Pulls',
  },
  {
    icon: ShieldCheck,
    title: 'Pure, Hygienic and Skin Loving',
    description:
      'Made from high-quality, skin-friendly materials, NexBloom tissues are safe, absorbent, and ideal for all age groups, ensuring cleanliness anytime, anywhere.',
    badge: 'Dermatologist Safe',
  },
  {
    icon: Palette,
    title: 'Elegant & Aesthetic Design',
    description:
      'Our thoughtfully designed packaging adds a premium touch to your space, making it not just a necessity but a stylish addition to your home or workspace.',
    badge: 'Modern Décor Box',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly & Responsible Choice',
    description:
      'NexBloom is crafted with sustainability in mind, using eco-conscious materials and processes that reduce environmental impact. It’s a smarter choice for those who value both quality and a greener future.',
    badge: '100% Sustainable Pulp',
  },
];

export const CraftedBeyondOrdinary = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= 1. HEADER SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>The NexBloom Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight leading-tight">
            NexBloom: Crafted Beyond Ordinary
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Experience the perfect blend of luxury, hygiene, and sustainability with NexBloom Face Tissues — crafted to elevate your everyday essentials.
          </p>

          <div className="w-20 h-1 bg-[#1b4d3e]/25 mx-auto rounded-full mt-2" />
        </div>

        {/* ================= 2. 6 FEATURE PILLARS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle corner light tint */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full pointer-events-none transition-all group-hover:bg-emerald-100/60" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-[#1b4d3e] shadow-2xs group-hover:bg-[#1b4d3e] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1b4d3e] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 3. THE NEXBLOOM PROMISE BANNER ================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1b4d3e] via-[#143c30] to-[#0d2820] text-white p-8 sm:p-12 shadow-2xl border border-emerald-800/40">
          <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Our Core Commitment</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              The NexBloom Promise
            </h3>

            <p className="text-sm sm:text-base md:text-lg text-emerald-100 font-medium leading-relaxed max-w-2xl mx-auto">
              "With NexBloom, you don’t just choose a tissue; you choose comfort, quality, and conscious living."
            </p>

            <div className="pt-3 flex items-center justify-center gap-6 text-xs text-emerald-200 font-bold flex-wrap">
              <span>✓ 100% Skin Safe</span>
              <span>✓ 5X Stronger Sheets</span>
              <span>✓ Complimentary Seeds Included</span>
            </div>

          </div>

          {/* Decorative background circle */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>
    </section>
  );
};
