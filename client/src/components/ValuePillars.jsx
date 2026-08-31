import React from 'react';

export const ValuePillars = () => {
  const pillars = [
    {
      bgColor: 'bg-[#fbe0dc]', // Soft Pastel Pink/Peach
      title: 'Uncompromising Softness',
      description:
        'Experience a smooth, gentle touch designed for sensitive skin. Comfort that feels soft, every single time.',
    },
    {
      bgColor: 'bg-[#d8e7f8]', // Soft Pastel Sky Blue
      title: 'Engineered Strength',
      description:
        'Crafted for durability, each sheet stays strong without tearing. Dependable performance you can trust daily.',
    },
    {
      bgColor: 'bg-[#fef0cb]', // Soft Pastel Warm Yellow/Cream
      title: 'Refined Hygiene',
      description:
        'Made with skin safe materials to ensure clean and hygienic use. Care that protects you and your family.',
    },
    {
      bgColor: 'bg-[#e3d0f7]', // Soft Pastel Lavender/Purple
      title: 'Sustainable by Design',
      description:
        'Eco conscious packaging with thoughtful materials. Because premium care should also care for the planet.',
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className={`${pillar.bgColor} p-8 sm:p-10 flex flex-col justify-start space-y-3.5 transition-transform duration-300 hover:brightness-98`}
          >
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              {pillar.title}
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
