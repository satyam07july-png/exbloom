import React, { useState } from 'react';
import { MessageSquare, User, X, Share2, Check, ArrowRight } from 'lucide-react';

export const topThreeBlogs = [
  {
    id: 'b1',
    day: '27',
    month: 'AUG',
    date: '27 AUG 2025',
    category: 'TOILET PAPER',
    title: 'Best Toilet Paper in India for Daily Hygiene',
    author: 'NexBloom',
    commentsCount: 0,
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=800&q=80',
    summary:
      'Finding the ideal toilet roll for Indian plumbing and sensitive skin requires looking at 3-ply virgin fibers, rapid water dissolution, and chemical-free softness.',
    content: `
      When choosing toilet paper for everyday household hygiene in India, quality and safety matter just as much as comfort.

      ### 1. 3-Ply CloudSoft Cushioning
      NexBloom toilet rolls are engineered with 3 micro-quilted layers of 100% pure virgin wood pulp. Unlike rough single-ply papers, it provides gentle, irritation-free comfort suitable for the entire family including children.

      ### 2. 100% Flushable & Clog-Free Guarantee
      Indian drainage systems require toilet paper that breaks down rapidly upon water contact. NexBloom toilet paper dissolves seamlessly within 15 seconds, preventing expensive pipeline blockages and septic tank issues.

      ### 3. Free Organic Plant Seeds
      Every pack of NexBloom toilet rolls comes with a complimentary packet of organic plant seeds, allowing you to give back to nature with every single order.
    `,
  },
  {
    id: 'b2',
    day: '27',
    month: 'AUG',
    date: '27 AUG 2025',
    category: 'TISSUES',
    title: 'Soft Touch Tissue Paper for Irritation-Free Care',
    author: 'NexBloom',
    commentsCount: 0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    summary:
      'Why dermatologists recommend single-use SilkTouch virgin facial tissues over damp cloth towels for acne prevention and makeup removal.',
    content: `
      Facial skin is significantly more sensitive than the rest of the body, making proper drying and makeup removal essentials crucial for a clear complexion.

      ### 1. Say Goodbye to Damp Towel Bacteria
      Traditional cloth towels in bathrooms harbor bacteria and mold spores within hours of use. Using a fresh, sterile NexBloom facial tissue prevents acne-causing bacterial transfer.

      ### 2. Hypoallergenic & Chemical-Free
      NexBloom SilkTouch facial tissues contain zero optical brighteners, zero chlorine bleaches, and zero artificial fragrances, making them ideal for sensitive, allergy-prone skin.

      ### 3. Decorative Aesthetic Packaging
      Designed with charming pastel packaging and our signature panda mascot, NexBloom tissue boxes elevate the look of your living room, vanity counter, and office desk.
    `,
  },
  {
    id: 'b3',
    day: '27',
    month: 'AUG',
    date: '27 AUG 2025',
    category: 'TOILET PAPER',
    title: 'Choose Eco Toilet Paper – Better for You, Better for Earth',
    author: 'NexBloom',
    commentsCount: 0,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    summary:
      'Discover how sustainable forestry, 100% plastic-free seed packaging, and responsible manufacturing create a greener future.',
    content: `
      Choosing sustainable paper products is one of the easiest ways every household can reduce their environmental footprint without sacrificing luxury.

      ### 1. Sustainably Managed Forest Pulp
      NexBloom sources 100% of its cellulose from responsibly managed plantation forests where trees are continuously replanted.

      ### 2. The Green Promise ("Ek Nayi Muhim")
      Because paper is crafted from trees, NexBloom takes responsibility to give back. With every pack you buy, we gift plantable wildflower, tulsi, and marigold seeds.

      ### 3. Tightly Bound, Long-Lasting Rolls
      Our precision winding technology packs more sheets per roll, reducing packaging waste and transport emissions while giving you superior value.
    `,
  },
];

export const Blogs = ({ isSection = false }) => {
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleShare = (id) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="our-blog-section" className={`bg-white border-b border-slate-200/80 ${isSection ? 'py-16' : 'pt-24 pb-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. SECTION TITLE (Matching Screenshot) ================= */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
            Our Blog
          </h2>
          <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
        </div>

        {/* ================= 2. TOP 3 BLOGS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topThreeBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => setActiveArticle(blog)}
              className="flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image Container with Top-Left Date Badge */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-2xs group-hover:shadow-md transition-all duration-300">
                  
                  {/* Top-Left Date Badge (27 AUG) */}
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 text-center shadow-md">
                    <span className="block text-base sm:text-lg font-black text-slate-900 leading-none">
                      {blog.day}
                    </span>
                    <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                      {blog.month}
                    </span>
                  </div>

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
                  />
                </div>

                {/* Category Pill Tag Below Image */}
                <div className="mt-4 flex justify-center">
                  <span className="px-3.5 py-1 rounded-sm bg-[#1b4d3e] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                    {blog.category}
                  </span>
                </div>

                {/* Blog Title */}
                <div className="mt-3 text-center px-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {blog.title}
                  </h3>
                </div>
              </div>

              {/* Blog Meta Row (Posted by NexBloom • Comments) */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <span>Posted by</span>
                  <span className="font-bold text-slate-700">{blog.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{blog.commentsCount}</span>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* ================= 3. FULL ARTICLE READING MODAL ================= */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white bg-[#1b4d3e] px-2.5 py-0.5 rounded uppercase">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-slate-400">• {activeArticle.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(activeArticle.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Share Article Link"
                >
                  {copiedId === activeArticle.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {activeArticle.title}
                </h1>
                <p className="text-xs text-slate-500">
                  By <strong className="text-slate-800">{activeArticle.author}</strong> • {activeArticle.date}
                </p>
              </div>

              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                {activeArticle.content
                  .trim()
                  .split('\n\n')
                  .map((paragraph, index) => {
                    if (paragraph.trim().startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-base font-bold text-slate-900 mt-5 mb-2">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    return (
                      <p key={index} className="text-slate-600 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
