import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Shuffle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { TiltCard } from './TiltCard';
import BASE_URL from '../utils/api';

export const FeaturedProducts = ({ onExploreAll, products: propProducts = [] }) => {
  const { addToCart, setSelectedProduct, showToast } = useCart();
  const [wishlist, setWishlist] = useState({});
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [products, setProducts] = useState(propProducts || []);

  // Sync when parent products change
  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
    }
  }, [propProducts]);

  // Fetch products from backend if needed and not supplied
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {}
    };
    if (!propProducts || propProducts.length === 0) {
      fetchProducts();
    }
  }, []);

  const toggleWishlist = (id, e) => {
    e?.stopPropagation();
    setWishlist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? 'Added to Wishlist' : 'Removed from Wishlist');
      return next;
    });
  };

  const handleOpenProduct = (product, e) => {
    e?.stopPropagation();
    const fullProduct = (propProducts && propProducts.find((p) => p._id === product._id)) || product;
    setSelectedProduct(fullProduct);
    window.scrollTo(0, 0);
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

  return (
    <section id="bestsellers-section" className="py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
            Our Bestsellers
          </h2>
          <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
        </div>

        {/* 4-Column Product Grid (1 row me 4 products, total 8 products) */}
        {products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs animate-pulse flex flex-col items-center space-y-3"
              >
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2 mt-2" />
                <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                <div className="h-9 bg-slate-100 rounded-full w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
            {products.slice(0, 8).map((product) => {
            const firstVariant = product.variants?.[0];
            const displayPrice = firstVariant?.price ?? product.price ?? 0;
            const originalPrice = product.mrp || product.originalPrice || firstVariant?.mrp || (displayPrice > 0 ? Math.round(displayPrice * 1.25) : 0);
            const hasDiscount = originalPrice > displayPrice;
            const discountPercent = product.discountPercent || (hasDiscount
              ? `-${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%`
              : '-15%');

            const productImage =
              product.image ||
              (Array.isArray(product.images) && product.images[0]) ||
              '/redefine-tissue-box.webp';

            const isCardActive = hoveredCardId === product._id || activeCardId === product._id;

            return (
              <TiltCard
                key={product._id}
                maxTilt={10}
                perspective={1000}
                scale={1.025}
                onMouseEnter={() => setHoveredCardId(product._id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => setActiveCardId(activeCardId === product._id ? null : product._id)}
                className={`group relative bg-white rounded-2xl p-3 border transition-all duration-300 flex flex-col items-center preserve-3d ${
                  isCardActive
                    ? 'border-emerald-300/90 z-20'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* 1. Image Box with Top-Left Round Discount Badge + Split Icon */}
                <div 
                  className="relative w-full aspect-square bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-100/80 p-3 flex items-center justify-center preserve-3d"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  
                  {/* Round Dark-Green Discount Badge (Floats above image) */}
                  <div 
                    className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-black shadow-md tracking-tight"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    {discountPercent}
                  </div>

                  {/* Product Image (Floats in 3D parallax) */}
                  <img
                    src={productImage}
                    alt={product.name}
                    onClick={(e) => handleOpenProduct(product, e)}
                    style={{ transform: 'translateZ(25px)' }}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 rounded-xl cursor-pointer drop-shadow-sm"
                  />

                  {/* Shuffle / Quick View Icon */}
                  <button
                    onClick={(e) => handleOpenProduct(product, e)}
                    style={{ transform: 'translateZ(32px)' }}
                    className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#1b4d3e] hover:border-emerald-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                    title="Compare / View Specs"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Permanent Product Info (Title, Subtitle, Price) */}
                <div 
                  className="w-full pt-3 text-center space-y-1 preserve-3d"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {/* Product Title */}
                  <h3
                    onClick={(e) => handleOpenProduct(product, e)}
                    className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2 min-h-[36px] flex items-center justify-center px-1 cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  {/* Subtitle / Tagline */}
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

                {/* 3. Interactive Expandable Section */}
                <div
                  style={{ transform: 'translateZ(22px)' }}
                  className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                    isCardActive
                      ? 'max-h-64 opacity-100 mt-2.5 pt-2 border-t border-slate-100'
                      : 'max-h-0 opacity-0 mt-0 pt-0'
                  }`}
                >
                  {/* Product Description */}
                  <p className="text-[11px] text-slate-500 text-center leading-relaxed line-clamp-3 px-1">
                    {product.description || 'Engineered for softness, superior absorbency, and everyday hygiene needs. 100% pure virgin wood pulp.'}
                  </p>

                  {/* Dark Green ADD TO CART Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    style={{ transform: 'translateZ(28px)' }}
                    className="w-full mt-3 py-2 px-4 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>ADD TO CART</span>
                  </button>

                  {/* Sub-actions: Wishlist & Search / Quick View */}
                  <div className="flex items-center justify-center gap-3 mt-2.5 pt-1">
                    <button
                      onClick={(e) => toggleWishlist(product._id, e)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                        wishlist[product._id]
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-300'
                      }`}
                      title="Add to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${wishlist[product._id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => handleOpenProduct(product, e)}
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      title="View Details"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </TiltCard>
            );
          })}
        </div>
      )}

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
