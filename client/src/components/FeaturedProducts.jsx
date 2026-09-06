import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Shuffle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BASE_URL from '../utils/api';

export const FeaturedProducts = ({ onExploreAll, products: propProducts = [] }) => {
  const { addToCart, setSelectedProduct, showToast } = useCart();
  const [wishlist, setWishlist] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);
  const [products, setProducts] = useState(propProducts);
  const [loading, setLoading] = useState(propProducts.length === 0);
  const [error, setError] = useState(null);

  // Sync when parent products change
  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      setLoading(false);
    }
  }, [propProducts]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (propProducts.length === 0) {
          setLoading(true);
        }
        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
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

  const handleCardClick = (product) => {
    setSelectedProduct(product);
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
  if (loading && products.length === 0) {
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

  // ── Product Grid ───────────────────────────────────────────────────────
  return (
    <section id="bestsellers-section" className="py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-2">
            ⭐ Top Rated &amp; Popular
          </span>
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
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xl hover:border-emerald-400 hover:scale-[1.02] transition-all duration-300 group cursor-pointer relative flex flex-col justify-between overflow-hidden"
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

                    {/* Product Image */}
                    <img
                      src={
                        product.image ||
                        (Array.isArray(product.images) && product.images[0]) ||
                        '/redefine-tissue-box.webp'
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

                    {/* Short Description */}
                    {product.description && (
                      <p className="text-[11px] text-slate-500 leading-relaxed font-normal line-clamp-2 pt-1 border-t border-slate-100">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
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

                    {/* View Details */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="View Full Product Page"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Explore All Button */}
        {onExploreAll && (
          <div className="mt-12 text-center">
            <button
              onClick={onExploreAll}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore All Nexbloom Range</span>
              <span>→</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
