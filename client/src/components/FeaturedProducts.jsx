import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Shuffle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BASE_URL from '../utils/api';

export const FeaturedProducts = ({ onExploreAll }) => {
  const { addToCart, setSelectedProduct, showToast } = useCart();
  const [wishlist, setWishlist] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleWishlist = (id, e) => {
    e?.stopPropagation();
    setWishlist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? 'Added to Wishlist' : 'Removed from Wishlist');
      return next;
    });
  };

  const handleCardClick = (id) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    const firstVariant = product.variants?.[0];
    addToCart(
      {
        _id: product._id,
        name: product.name,
        category: product.category,
        image: product.image,
        price: firstVariant?.price ?? product.price,
      },
      {
        size: firstVariant?.size ?? 'Default',
        price: firstVariant?.price ?? product.price,
      }
    );
  };

  // ── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="bestsellers-section" className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
              Our Bestsellers
            </h2>
            <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
          </div>
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#1b4d3e] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // ── Empty / Error State ────────────────────────────────────────────────
  if (error || products.length === 0) {
    return (
      <section id="bestsellers-section" className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
              Our Bestsellers
            </h2>
            <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
          </div>
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-slate-500">
            <ShoppingBag className="w-14 h-14 text-slate-300" />
            <p className="text-lg font-semibold text-slate-600">
              {error ? 'Products load nahi ho sake.' : 'Abhi koi product available nahi hai.'}
            </p>
            <p className="text-sm text-slate-400">
              Admin portal se products add karein.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── Product Grid ───────────────────────────────────────────────────────
  return (
    <section id="bestsellers-section" className="py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
            Our Bestsellers
          </h2>
          <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
          {products.map((product) => {
            const isWishlisted = !!wishlist[product._id];
            const isActive = activeCardId === product._id;
            // Use first variant data for display
            const firstVariant = product.variants?.[0];
            const displayPrice = firstVariant?.price ?? product.price ?? 0;
            const originalPrice = product.mrp || product.originalPrice || firstVariant?.mrp || 0;
            const hasDiscount = originalPrice > displayPrice;
            const discountPercent = hasDiscount
              ? `-${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%`
              : null;

            return (
              <div
                key={product._id}
                onClick={() => handleCardClick(product._id)}
                className={`bg-white rounded-2xl border transition-all duration-300 group cursor-pointer relative flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? 'border-emerald-400 shadow-2xl z-20 scale-[1.03] ring-2 ring-emerald-300/60'
                    : 'border-slate-200 shadow-2xs hover:shadow-xl hover:border-emerald-300 hover:scale-[1.02] hover:z-10'
                }`}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 p-2 flex items-center justify-center">

                    {/* Discount Badge */}
                    {discountPercent && (
                      <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-lg bg-[#1b4d3e] text-white flex items-center justify-center text-[10px] font-black shadow-md tracking-wider">
                        {discountPercent}
                      </div>
                    )}

                    {/* Shuffle Icon */}
                    <div
                      className={`absolute bottom-3 right-3 z-10 p-1.5 rounded-full bg-white/90 text-slate-700 shadow-sm border border-slate-200 transition-all duration-300 ${
                        isActive
                          ? 'opacity-100 bg-emerald-100 text-emerald-800 rotate-180 scale-110'
                          : 'opacity-0 group-hover:opacity-100 hover:text-emerald-800'
                      }`}
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                    </div>

                    {/* Product Image */}
                    <img
                      src={
                        isActive && (product.images?.[1] || product.secondaryImage)
                          ? (product.images?.[1] || product.secondaryImage)
                          : (product.image || product.images?.[0] || '/redefine-tissue-box.webp')
                      }
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-all duration-500 rounded-xl"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 text-center space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2 min-h-[38px] flex items-center justify-center">
                      {product.name}
                    </h3>

                    {/* Pulls / Sheets or Tagline */}
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {product.pullsCount && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {product.pullsCount}
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                        {product.tagline || product.category}
                      </p>
                    </div>

                    {/* Pricing (MRP strikethrough + Selling Price) */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{originalPrice}
                        </span>
                      )}
                      <span className="text-base sm:text-lg font-black text-[#1b4d3e]">
                        ₹{displayPrice}
                      </span>
                    </div>

                    {/* Expandable Description */}
                    <div
                      className={`overflow-hidden transition-all duration-300 text-left ${
                        isActive
                          ? 'max-h-32 opacity-100 pt-2.5'
                          : 'max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 group-hover:pt-2.5'
                      }`}
                    >
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-4 pt-0">
                  <div
                    className={`pt-3 border-t border-slate-100 flex items-center justify-between gap-2 transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 transform-none'
                        : 'opacity-0 sm:opacity-90 group-hover:opacity-100 transform sm:translate-y-0'
                    }`}
                  >
                    {/* Wishlist */}
                    <button
                      onClick={(e) => toggleWishlist(product._id, e)}
                      className={`p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer ${
                        isWishlisted ? 'text-rose-500' : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>

                    {/* Add to Cart */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 py-2 px-3 sm:px-4 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer text-center"
                    >
                      ADD TO CART
                    </button>

                    {/* Quick View */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct({
                          _id: product._id,
                          name: product.name,
                          category: product.category,
                          image: product.image,
                          price: displayPrice,
                          tagline: product.tagline,
                          description: product.description,
                          ply: product.ply,
                          variants: product.variants?.length
                            ? product.variants
                            : [{ size: displaySize, price: displayPrice }],
                        });
                      }}
                      className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Quick View Details"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
