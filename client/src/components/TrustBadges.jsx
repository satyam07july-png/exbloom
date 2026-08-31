import React from 'react';
import { Feather, Droplets, Leaf, Sprout } from 'lucide-react';

export const TrustBadges = () => {
  const items = [
    {
      icon: (
        <div className="w-6 h-6 rounded-full border border-emerald-700 flex items-center justify-center text-emerald-700">
          <Feather className="w-3.5 h-3.5" />
        </div>
      ),
      label: 'Ultra Soft & Gentle',
    },
    {
      icon: <Droplets className="w-5 h-5 text-emerald-700" />,
      label: 'Highly Absorbent',
    },
    {
      icon: <Leaf className="w-5 h-5 text-emerald-700" />,
      label: 'Eco-Friendly Materials',
    },
    {
      icon: <Sprout className="w-5 h-5 text-emerald-700" />,
      label: 'Free Seeds with Every Order',
    },
  ];

  return (
    <section className="w-full bg-white border-b border-slate-200/80 py-4 sm:py-5 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-around gap-y-3 gap-x-4">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2.5 group select-none">
                <span className="shrink-0">{item.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  {item.label}
                </span>
              </div>

              {/* Subtle Vertical Divider between items */}
              {idx < items.length - 1 && (
                <span className="hidden lg:block h-5 w-[1px] bg-slate-300/80 mx-2" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
