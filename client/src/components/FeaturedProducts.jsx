import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Shuffle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BASE_URL from '../utils/api';

const DEFAULT_BESTSELLERS = [
  {
    _id: 'nb-kr-1',
    name: 'NexBloom Kitchen Rolls - Pack of 1',
    tagline: 'Premium Kitchen Rolls',
    category: 'Kitchen Roll',
    price: 249,
    mrp: 289,
    discountPercent: '-14%',
    image: '/nexbloom-kitchen-roll-banner.webp',
    description: 'Engineered for spills, messes, and everyday kitchen needs. NexBloom Kitchen Rolls combine strength, absorbency, and sustainability.',
    ply: '2-Ply Extra Absorb',
    pullsCount: '60 Pulls / Roll',
    variants: [{ size: 'Pack of 1', price: 249, mrp: 289, pulls: '60 Pulls' }]
  },
  {
    _id: 'nb-kr-2',
    name: 'NexBloom Kitchen Rolls - Pack of 2',
    tagline: 'Premium Kitchen Rolls',
    category: 'Kitchen Roll',
    price: 457,
    mrp: 578,
    discountPercent: '-21%',
    image: '/nexbloom-kitchen-roll-banner.webp',
    description: 'Engineered for spills, messes, and everyday kitchen needs. NexBloom Kitchen Rolls combine strength, absorbency, and sustainability.',
    ply: '2-Ply Extra Absorb',
    pullsCount: '120 Pulls Total',
    variants: [{ size: 'Pack of 2', price: 457, mrp: 578, pulls: '120 Pulls' }]
  },
  {
    _id: 'nb-ft-100-1',
    name: 'NexBloom Premium Face Tissues – 100 Pulls (Pack of 1 /One)',
    tagline: 'NexBloom Premium Face Tissues – 100 Pulls',
    category: 'Face Tissue',
    price: 129,
    mrp: 189,
    discountPercent: '-32%',
    image: '/nexbloom-living-room-tissue.webp',
    description: 'Luxury softness meets sustainable living. Designed for everyday comfort with uncompromised quality.',
    ply: '2-Ply SilkTouch',
    pullsCount: '100 Pulls',
    variants: [{ size: 'Pack of 1 (100 Pulls)', price: 129, mrp: 189, pulls: '100 Pulls' }]
  },
  {
    _id: 'nb-ft-100-2',
    name: 'NexBloom Premium Face Tissues – 100 Pulls (Pack of 2 /Two)',
    tagline: 'NexBloom Premium Face Tissues – 100 Pulls',
    category: 'Face Tissue',
    price: 229,
    mrp: 378,
    discountPercent: '-39%',
    image: '/nexbloom-living-room-tissue.webp',
    description: 'Luxury softness meets sustainable living. Designed for everyday comfort with uncompromised quality.',
    ply: '2-Ply SilkTouch',
    pullsCount: '200 Pulls Total',
    variants: [{ size: 'Pack of 2 (200 Pulls)', price: 229, mrp: 378, pulls: '200 Pulls' }]
  },
  {
    _id: 'nb-ft-100-4',
    name: 'NexBloom Premium Face Tissues – 100 Pulls (Pack of 4/four)',
    tagline: 'NexBloom Premium Face Tissues – 100 Pulls',
    category: 'Face Tissue',
    price: 429,
    mrp: 756,
    discountPercent: '-43%',
    image: '/nexbloom-living-room-tissue.webp',
    description: 'Luxury softness meets sustainable living. Designed for everyday comfort with uncompromised quality.',
    ply: '2-Ply SilkTouch',
    pullsCount: '400 Pulls Total',
    variants: [{ size: 'Pack of 4 (400 Pulls)', price: 429, mrp: 756, pulls: '400 Pulls' }]
  },
  {
    _id: 'nb-ft-100-6',
    name: 'NexBloom Premium Face Tissues – 100 Pulls (Pack of 6/Six)',
    tagline: 'NexBloom Premium Face Tissues – 100 Pulls',
    category: 'Face Tissue',
    price: 609,
    mrp: 1134,
    discountPercent: '-46%',
    image: '/nexbloom-living-room-tissue.webp',
    description: 'Luxury softness meets sustainable living. Designed for everyday comfort with uncompromised quality.',
    ply: '2-Ply SilkTouch',
    pullsCount: '600 Pulls Total',
    variants: [{ size: 'Pack of 6 (600 Pulls)', price: 609, mrp: 1134, pulls: '600 Pulls' }]
  },
  {
    _id: 'nb-ft-200-1',
    name: 'NexBloom Premium Face Tissues – 200 Pulls (Pack of 1)',
    tagline: 'NexBloom Premium Face Tissues – 200 Pulls',
    category: 'Face Tissue',
    price: 219,
    mrp: 279,
    discountPercent: '-22%',
    image: '/nexbloom-living-room-tissue.webp',
    description: 'More comfort, more care — extra thick 2-ply facial tissues for home, office, and car.',
    ply: '2-Ply Luxury',
    pullsCount: '200 Pulls',
    variants: [{ size: 'Pack of 1 (200 Pulls)', price: 219, mrp: 279, pulls: '200 Pulls' }]
  },
  {
    _id: 'nb-ft-200-2',
    name: 'NexBloom Premium Face Tissues – 200 Pulls (Pack of 2)',
    tagline: 'NexBloom Premium Face Tissues – 200 Pulls',
    category: 'Face Tissue',
    price: 417,
    mrp: 558,
    discountPercent: '-25%',
    image: '/nexbloom-living-room-tissue.webp',
    description: 'More comfort, more care — extra thick 2-ply facial tissues for home, office, and car.',
    ply: '2-Ply Luxury',
    pullsCount: '400 Pulls Total',
    variants: [{ size: 'Pack of 2 (400 Pulls)', price: 417, mrp: 558, pulls: '400 Pulls' }]
  },
];

export const FeaturedProducts = ({ onExploreAll, products: propProducts = [] }) => {
  const { addToCart, setSelectedProduct, showToast } = useCart();
  const [wishlist, setWishlist] = useState({});
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const [products, setProducts] = useState(
    propProducts && propProducts.length > 0 ? propProducts : DEFAULT_BESTSELLERS
  );
  const [loading, setLoading] = useState(false);

  // Sync when parent products change
  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
    }
  }, [propProducts]);

  // Fetch products from backend if needed
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        // Keep fallback data
      }
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

        {/* 4-Column Product Grid (Matching refrence.mp4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {products.map((product) => {
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
              <div
                key={product._id}
                onMouseEnter={() => setHoveredCardId(product._id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => setActiveCardId(activeCardId === product._id ? null : product._id)}
                className={`group relative bg-white rounded-2xl p-3 border transition-all duration-300 flex flex-col items-center ${
                  isCardActive
                    ? 'shadow-xl border-slate-200 z-20 -translate-y-1'
                    : 'border-transparent shadow-2xs hover:border-slate-200 hover:shadow-lg'
                }`}
              >
                {/* 1. Image Box with Top-Left Round Discount Badge + Split Icon */}
                <div className="relative w-full aspect-square bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-100/80 p-3 flex items-center justify-center">
                  
                  {/* Round Dark-Green Discount Badge */}
                  <div className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-black shadow-md tracking-tight">
                    {discountPercent}
                  </div>

                  {/* Product Image */}
                  <img
                    src={productImage}
                    alt={product.name}
                    onClick={(e) => handleOpenProduct(product, e)}
                    className="w-full h-full object-contain object-center group-hover:scale-104 transition-transform duration-500 rounded-xl cursor-pointer"
                  />

                  {/* Shuffle / Quick View Icon (Bottom-Right of Image, matching refrence.mp4) */}
                  <button
                    onClick={(e) => handleOpenProduct(product, e)}
                    className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#1b4d3e] hover:border-emerald-300 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                    title="Compare / View Specs"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Permanent Product Info (Title, Subtitle, Price) */}
                <div className="w-full pt-3 text-center space-y-1">
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

                {/* 3. Interactive Expandable Section (Slide down on hover / click, matching refrence.mp4) */}
                <div
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
