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

        {/* 4-Column Product Grid (Matching Reference Screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {products.map((product) => {
            const firstVariant = product.variants?.[0];
            const displayPrice = firstVariant?.price ?? product.price ?? 0;
            const originalPrice = product.mrp || product.originalPrice || firstVariant?.mrp || (displayPrice > 0 ? Math.round(displayPrice * 1.25) : 0);
            const hasDiscount = originalPrice > displayPrice;
            const discountPercent = hasDiscount
              ? `-${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%`
              : '-15%';

            const productImage =
              product.image ||
              (Array.isArray(product.images) && product.images[0]) ||
              '/redefine-tissue-box.webp';

            return (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer flex flex-col items-center transition-all duration-300"
              >
                {/* Image Container with Top-Left Round Discount Badge */}
                <div className="relative w-full aspect-square bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-100/80 p-3 flex items-center justify-center group-hover:shadow-lg group-hover:border-emerald-200 transition-all duration-300">
                  
                  {/* Round Dark-Green Discount Badge (-14%, -21%, -32%, etc.) */}
                  <div className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-black shadow-md tracking-tight">
                    {discountPercent}
                  </div>

                  {/* Product Image */}
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-contain object-center group-hover:scale-104 transition-transform duration-500 rounded-xl"
                  />
                </div>

                {/* Card Text Content (Centered, Matching Screenshot) */}
                <div className="w-full pt-3 text-center space-y-1">
                  {/* Product Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2 min-h-[36px] flex items-center justify-center px-1">
                    {product.name}
                  </h3>

                  {/* Subtitle / Category */}
                  <p className="text-[11px] text-slate-400 font-medium truncate px-2">
                    {product.tagline || product.category || 'Premium Hygiene Products'}
                  </p>

                  {/* Pricing Row: Strikethrough MRP + Bold Green Selling Price */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through font-normal">
                        ₹{Number(originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="text-sm sm:text-base font-black text-[#1b4d3e]">
                      ₹{Number(displayPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Explore All Button */}
        {onExploreAll && (
          <div className="mt-14 text-center">
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
