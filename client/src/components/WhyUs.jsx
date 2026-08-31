import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Leaf, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Feather, 
  Sprout, 
  Palette, 
  Heart,
  Droplet 
} from 'lucide-react';
import { CraftedBeyondOrdinary } from './CraftedBeyondOrdinary';

export const WhyUs = ({ onExploreClick }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const processSteps = [
    {
      step: "01",
      title: "Pure Pulp Selection",
      desc: "Sourcing 100% certified virgin cellulose and natural botanical fibers."
    },
    {
      step: "02",
      title: "Micro-Embossing & Ply Layering",
      desc: "Precision mechanical bonding of 2-ply, 3-ply, and 4-ply sheets for 5X strength."
    },
    {
      step: "03",
      title: "Sterilization & Hygiene Check",
      desc: "High-temperature sanitization and dermatological safety certification."
    },
    {
      step: "04",
      title: "Hygienic Sealed Packing with Seed Gift",
      desc: "Automated dust-proof sealing with complimentary living plant seeds pouch in every box."
    }
  ];

  const faqs = [
    {
      q: "What makes NexBloom tissues 'Crafted Beyond Ordinary'?",
      a: "NexBloom tissues are engineered with ultra-soft, 5X stronger sheets that feel gentle on sensitive skin without tearing. Plus, every order comes with complimentary plantable seeds to give life back to nature."
    },
    {
      q: "What pack sizes and quantities are available?",
      a: "We offer tailored packs for every need: Face Tissues (100 & 200 Pulls boxes, packs of 1, 2, 4, 6), Kitchen Rolls (Packs of 1, 2, 4, 6, 12), Toilet Rolls (Packs of 4, 6, 12, 24), and Family Combo packs."
    },
    {
      q: "Are NexBloom kitchen rolls food-contact safe?",
      a: "Yes! All NexBloom kitchen towels and table tissues are 100% food grade certified. You can safely use them to soak excess oil from fried foods, wrap rotis/sandwiches, and wipe kitchen countertops."
    },
    {
      q: "Will the toilet rolls cause clogging in my bathroom pipes?",
      a: "No. NexBloom CloudSoft toilet rolls are engineered with rapid-dissolving cellulose technology that breaks down immediately in water, making them 100% safe for standard drains and septic tanks."
    },
    {
      q: "What is the minimum order value for free delivery?",
      a: "All orders above ₹499 qualify for Free Express Doorstep Delivery across India. For orders below ₹499, a nominal ₹49 delivery charge applies."
    }
  ];

  return (
    <div className="pt-20 pb-20">
      
      {/* 1. Main Manifesto Showcase */}
      <CraftedBeyondOrdinary />

      {/* 2. Stats Counter Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-slate-100 last:border-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1b4d3e]">50,000+</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Homes &amp; Offices Served</p>
            </div>
            <div className="border-r border-slate-100 last:border-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1b4d3e]">4.9 / 5</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Customer Rating</p>
            </div>
            <div className="border-r border-slate-100 last:border-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1b4d3e]">100%</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Virgin Pulp Certified</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1b4d3e]">5X</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Stronger Wet Durability</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 4-Step Hygiene Process */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Manufacturing Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our Hygiene &amp; Quality Process
            </h2>
            <p className="text-xs text-slate-500">
              How we ensure every single roll and pull is hygienic, soft, and durable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-2xs relative">
                <span className="text-3xl font-black text-emerald-200 block mb-3 font-mono">
                  {step.step}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions (FAQ) Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10 space-y-1.5">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Learn more about pack sizes, food safety certifications, and seed planting.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-emerald-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1b4d3e] to-[#143c30] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black">Stock Up on Everyday Hygiene Essentials</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Explore our value packs of tissue papers, kitchen towels, toilet rolls, and face tissues with free home delivery.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreClick}
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Products &amp; Packs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
