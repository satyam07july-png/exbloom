import React, { useState, useMemo } from 'react';
import { MessageSquare, User, X, Share2, Check, ArrowRight, Search, Clock, BookOpen, Sparkles, Filter } from 'lucide-react';

export const ALL_BLOGS = [
  {
    id: 'b1',
    day: '05',
    month: 'SEP',
    date: '05 SEP 2026',
    readTime: '4 min read',
    category: 'Daily Hygiene',
    title: 'Best Toilet Paper in India for Daily Hygiene: 3-Ply Virgin Pulp & Quick Dissolving',
    author: 'NexBloom Team',
    commentsCount: 3,
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=900&q=80',
    summary:
      'Finding the ideal toilet roll for Indian plumbing and sensitive skin requires looking at 3-ply virgin fibers, rapid water dissolution, and chemical-free softness.',
    content: `
      When choosing toilet paper for everyday household hygiene in India, quality and safety matter just as much as comfort.

      ### 1. 3-Ply CloudSoft Cushioning
      NexBloom toilet rolls are engineered with 3 micro-quilted layers of 100% pure virgin wood pulp. Unlike rough single-ply papers, it provides gentle, irritation-free comfort suitable for the entire family including children and sensitive skin.

      ### 2. 100% Flushable & Clog-Free Guarantee
      Indian drainage systems require toilet paper that breaks down rapidly upon water contact. NexBloom toilet paper dissolves seamlessly within 15 seconds, preventing expensive pipeline blockages and septic tank issues.

      ### 3. Free Organic Plant Seeds
      Every pack of NexBloom toilet rolls comes with a complimentary packet of organic plant seeds ("Ek Nayi Muhim"), allowing you to give back to nature with every single order.
    `,
  },
  {
    id: 'b2',
    day: '02',
    month: 'SEP',
    date: '02 SEP 2026',
    readTime: '3 min read',
    category: 'Skincare',
    title: 'Soft Touch Tissue Paper for Irritation-Free Care & Acne Prevention',
    author: 'Dr. A. Sharma (Derm. Advisor)',
    commentsCount: 5,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    summary:
      'Why dermatologists recommend single-use SilkTouch virgin facial tissues over damp cloth towels for acne prevention, makeup removal, and refreshing hygiene.',
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
    day: '28',
    month: 'AUG',
    date: '28 AUG 2026',
    readTime: '5 min read',
    category: 'Sustainability',
    title: 'Choose Eco-Friendly Paper – The Green Promise with Plantable Seeds',
    author: 'NexBloom Green Initiative',
    commentsCount: 8,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80',
    summary:
      'Discover how sustainable forestry, 100% plastic-free seed packaging, and responsible manufacturing create a greener future for every Indian household.',
    content: `
      Choosing sustainable paper products is one of the easiest ways every household can reduce their environmental footprint without sacrificing luxury.

      ### 1. Sustainably Managed Forest Pulp
      NexBloom sources 100% of its cellulose from responsibly managed plantation forests where trees are continuously replanted and biodiversity is preserved.

      ### 2. The Green Promise ("Ek Nayi Muhim")
      Because paper is crafted from trees, NexBloom takes responsibility to give back. With every pack you buy, we gift plantable wildflower, tulsi, and marigold seeds to make India greener.

      ### 3. Tightly Bound, Long-Lasting Rolls
      Our precision winding technology packs more sheets per roll, reducing packaging waste and transport emissions while giving you superior everyday value.
    `,
  },
  {
    id: 'b4',
    day: '22',
    month: 'AUG',
    date: '22 AUG 2026',
    readTime: '4 min read',
    category: 'Hygiene Science',
    title: 'Why 100% Virgin Wood Pulp Beats Recycled Paper for Family Hygiene',
    author: 'NexBloom Labs',
    commentsCount: 2,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80',
    summary:
      'Understanding the critical difference between recycled paper processing chemicals versus pure, unbleached virgin cellulose fibers for intimate skin safety.',
    content: `
      While recycled paper is excellent for cardboard boxes and stationery, intimate hygiene requires high-purity virgin fibers that are free from industrial de-inking chemicals and heavy metals.

      ### 1. Purity Without Harmful Bleach
      Virgin pulp is sanitized at high temperatures during processing without the need for harsh chlorine bleaches or fluorescent brightening agents.

      ### 2. Superior Strength & Zero Lint
      Long natural wood fibers provide unmatched wet strength, meaning NexBloom tissues do not tear easily or leave annoying white paper lint on your face or fingers.
    `,
  },
  {
    id: 'b5',
    day: '15',
    month: 'AUG',
    date: '15 AUG 2026',
    readTime: '3 min read',
    category: 'Kitchen & Home',
    title: 'Kitchen Towel Rolls: Honeycomb Embossing vs Standard Napkins',
    author: 'Chef & Home Guide',
    commentsCount: 4,
    image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=900&q=80',
    summary:
      'How 3D honeycomb embossing traps oil and liquids 3x faster, making frying oil drainage and counter wiping clean, safe, and effortless.',
    content: `
      Every modern kitchen needs a reliable heavy-duty towel roll that can tackle grease, oil, and liquid spills without disintegrating.

      ### 1. 3X Liquid Absorption Capacity
      The honeycomb embossing creates micro-pockets of air that rapidly draw in water and cooking oils, making deep-fried food drainage safe and healthy.

      ### 2. Certified Food-Contact Safe
      NexBloom Kitchen Towels meet strict food safety standards, meaning you can safely wrap food, warm rotis, or drain fried snacks with complete peace of mind.
    `,
  },
  {
    id: 'b6',
    day: '10',
    month: 'AUG',
    date: '10 AUG 2026',
    readTime: '5 min read',
    category: 'Sustainability',
    title: 'How Nexbloom Plants Trees with Every Customer Box — Our Eco Story',
    author: 'NexBloom Founders',
    commentsCount: 6,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    summary:
      'Read the story behind our seed gifting movement and how our customer community is turning empty boxes into blooming garden plants across India.',
    content: `
      NexBloom was born from a simple belief: high quality everyday comfort shouldn't come at the cost of the environment.

      ### 1. The Seed Packet in Every Box
      Inside every tissue box and paper roll pack, customers receive organic plant seeds ready for home gardening. Thousands of plants have blossomed in homes across India through this initiative.

      ### 2. Join Our Green Community
      Share your plant growth pictures on Instagram with #BloomWithNexBloom and inspire thousands of families to make conscious, eco-friendly choices.
    `,
  },
];

export const Blogs = ({ isSection = false, onNavigateToBlogs }) => {
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Daily Hygiene', 'Skincare', 'Sustainability', 'Kitchen & Home', 'Hygiene Science'];

  const filteredBlogs = useMemo(() => {
    return ALL_BLOGS.filter((blog) => {
      const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (id) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LANDING PAGE SECTION VIEW (TOP 3 LATEST BLOGS + "VIEW MORE BLOGS" BUTTON)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isSection) {
    const latestBlogs = ALL_BLOGS.slice(0, 3);

    return (
      <section id="our-blog-section" className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
              📖 Latest Insights &amp; Stories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
              Our Blogs
            </h2>
            <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
          </div>

          {/* Top 3 Latest Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => setActiveArticle(blog)}
                className="flex flex-col justify-between group cursor-pointer bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 p-4"
              >
                <div>
                  {/* Image Container with Top-Left Date Badge */}
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100">
                    <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 text-center shadow-md">
                      <span className="block text-base font-black text-slate-900 leading-none">
                        {blog.day}
                      </span>
                      <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                        {blog.month}
                      </span>
                    </div>

                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Category Tag */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                      {blog.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {blog.readTime}
                    </span>
                  </div>

                  {/* Blog Title */}
                  <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>

                {/* Author & Read More */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{blog.author}</span>
                  <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Post →
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* "View More Blogs" Button */}
          {onNavigateToBlogs && (
            <div className="mt-12 text-center">
              <button
                onClick={onNavigateToBlogs}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>View More Blogs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Modal */}
        {activeArticle && (
          <BlogModal
            article={activeArticle}
            onClose={() => setActiveArticle(null)}
            onShare={handleShare}
            copiedId={copiedId}
          />
        )}
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. DEDICATED ALL-BLOGS PAGE (HERO, FILTERS, SEARCH & COMPLETE ARCHIVE)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
          Nexbloom Knowledge Hub
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1b4d3e] tracking-tight">
          Our Blogs &amp; Stories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Explore expert guides on everyday hygiene, sustainable living, skincare tips, and our tree-planting eco initiatives.
        </p>
      </div>

      {/* Control Bar: Categories & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1b4d3e] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

        </div>
      </div>

      {/* All Blogs Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => setActiveArticle(blog)}
              className="flex flex-col justify-between group cursor-pointer bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 p-5"
            >
              <div>
                {/* Image Container with Top-Left Date Badge */}
                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100">
                  <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 text-center shadow-md">
                    <span className="block text-base font-black text-slate-900 leading-none">
                      {blog.day}
                    </span>
                    <span className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                      {blog.month}
                    </span>
                  </div>

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Category & Read Time */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                    {blog.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> {blog.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                  {blog.title}
                </h3>

                {/* Summary */}
                <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {blog.summary}
                </p>
              </div>

              {/* Author & Read CTA */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{blog.author}</span>
                <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read Article →
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Articles Found</h3>
          <p className="text-xs text-slate-500">
            No blogs matched your search "{searchQuery}". Try selecting another category or clear the search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Reading Modal */}
      {activeArticle && (
        <BlogModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          onShare={handleShare}
          copiedId={copiedId}
        />
      )}

    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE BLOG ARTICLE READING MODAL
// ─────────────────────────────────────────────────────────────────────────────
const BlogModal = ({ article, onClose, onShare, copiedId }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-white bg-[#1b4d3e] px-2.5 py-1 rounded uppercase">
              {article.category}
            </span>
            <span className="text-xs text-slate-400">• {article.date}</span>
            <span className="text-xs text-slate-400">• {article.readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(article.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Share Article Link"
            >
              {copiedId === article.id ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {article.title}
            </h1>
            <p className="text-xs text-slate-500">
              Published by <strong className="text-slate-800">{article.author}</strong> • {article.date}
            </p>
          </div>

          <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            {article.content
              .trim()
              .split('\n\n')
              .map((paragraph, index) => {
                if (paragraph.trim().startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-base font-bold text-slate-900 mt-6 mb-2">
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
  );
};

