import React, { useState, useEffect, useMemo } from 'react';
import { MessageSquare, User, X, Share2, Check, ArrowRight, Search, Clock, BookOpen, Sparkles, Filter } from 'lucide-react';
import BASE_URL from '../utils/api';

export const ALL_BLOGS = [];

export const Blogs = ({ isSection = false, onNavigateToBlogs }) => {
  const [blogsList, setBlogsList] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogsList(data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', 'Daily Hygiene', 'Skincare', 'Sustainability', 'Kitchen & Home', 'Hygiene Science'];

  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog) => {
      const matchesCat = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [blogsList, selectedCategory, searchQuery]);

  const handleShare = (id) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LANDING PAGE SECTION VIEW (TOP 3 LATEST BLOGS + "VIEW MORE BLOGS" BUTTON)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isSection) {
    const latestBlogs = blogsList.slice(0, 3);

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

          {/* Dynamic Content: Blogs Grid or Upcoming Blogs Note */}
          {latestBlogs.length === 0 ? (
            <div className="py-14 px-6 max-w-lg mx-auto text-center bg-slate-50/80 rounded-3xl border border-dashed border-slate-300 my-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100/60 text-[#1b4d3e] flex items-center justify-center border border-emerald-200 shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Upcoming Blogs
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We are currently writing informative guides on daily hygiene, skincare, and sustainable living. Exciting new stories will be published here soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestBlogs.map((blog) => (
                  <article
                    key={blog._id || blog.id}
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
            </>
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
              key={blog._id || blog.id}
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
        <div className="max-w-md mx-auto text-center py-20 px-6 bg-slate-50/80 rounded-3xl border border-dashed border-slate-300 space-y-3 shadow-2xs my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/60 text-[#1b4d3e] flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Upcoming Blogs &amp; Stories</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our editorial team is curating high-quality guides on hygiene, comfort, and wellness. New articles will be published here soon!
          </p>
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
              onClick={() => onShare(article._id || article.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Share Article Link"
            >
              {copiedId === (article._id || article.id) ? (
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

