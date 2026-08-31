import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Catalog = ({ products, searchQuery, setSearchQuery, initialCategory = 'All' }) => {
  const { addToCart, setSelectedProduct } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedVariants, setSelectedVariants] = useState({});

  const categories = ['All', 'Tissue Paper', 'Kitchen Roll', 'Toilet Roll', 'Face Tissue'];

  const handleSelectVariant = (productId, variant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        if (
          searchQuery &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
          Paper &amp; Hygiene Products
        </span>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">Our Range</h1>
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> products with customizable pack sizes
          </p>
        </div>
      </div>

      {/* =========================================================================
          2 PURE VISUAL POSTERS (VERTICALLY STACKED - EK KE NICHE EK)
      ========================================================================= */}
      <div className="space-y-6">
        
        {/* POSTER 1 (Top Pure Visual Poster) */}
        <div 
          onClick={() => setSelectedCategory('Kitchen Roll')}
          className="relative w-full h-48 sm:h-72 md:h-96 rounded-3xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group"
        >
          <img
            src="https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1800&q=85"
            alt="Nexbloom Kitchen Rolls & Table Tissues Poster"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          {/* Subtle natural overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* POSTER 2 (Bottom Pure Visual Poster) */}
        <div 
          onClick={() => setSelectedCategory('Toilet Roll')}
          className="relative w-full h-48 sm:h-72 md:h-96 rounded-3xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer group"
        >
          <img
            src="https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=1800&q=85"
            alt="Nexbloom CloudSoft Toilet Rolls & Facial Tissues Poster"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          {/* Subtle natural overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

      </div>

      {/* =========================================================================
          CONTROL BAR: Categories & Sorting Filter
      ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary filters row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <input
              type="text"
              placeholder="Search tissue, kitchen roll, toilet paper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-8 pr-7 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 text-xs text-slate-800 py-1.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="featured">Featured Packs</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {(selectedCategory !== 'All' || searchQuery || sortBy !== 'featured') && (
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRODUCT GRID (Showing Products with Pack Variants)
      ========================================================================= */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const activeVariant = selectedVariants[product._id] || (product.variants && product.variants[0]) || {
              size: 'Standard Pack',
              price: product.price,
            };

            const originalPrice = Math.round(activeVariant.price * 1.18);
            const discountPercent = Math.round(((originalPrice - activeVariant.price) / originalPrice) * 100);

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group hover:border-emerald-300 transition-all duration-200 shadow-2xs hover:shadow-md"
              >
                <div>
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                    {/* Top-Left Circular Discount Tag */}
                    <div className="absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-[11px] font-bold shadow-md">
                      -{discountPercent > 0 ? discountPercent : 15}%
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />

                    <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {product.ply || '2-Ply'}
                    </span>

                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="p-2.5 bg-white text-slate-800 rounded-full hover:bg-emerald-600 hover:text-white transition-colors shadow-md cursor-pointer"
                        title="View Specifications & Packs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.tagline || product.description}
                      </p>
                    </div>

                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Available Packs:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.variants.map((v, i) => (
                            <button
                              key={i}
                              onClick={() => handleSelectVariant(product._id, v)}
                              className={`px-2 py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                                activeVariant.size === v.size
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {v.size.split('(')[0].trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-none font-medium">
                        {activeVariant.size.split('(')[0].trim()}
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        ₹{activeVariant.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product, activeVariant)}
                      className="flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs active:scale-95 cursor-pointer transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-sm mx-auto space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or category filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
