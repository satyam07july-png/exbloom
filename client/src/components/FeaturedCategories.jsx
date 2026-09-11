import React, { useState, useEffect } from 'react';
import { ShoppingBag, PackageOpen, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BASE_URL from '../utils/api';

const CATEGORY_TABS = [
  { key: 'facial-100', label: 'PREMIUM FACIAL TISSUES (100 PULLS)' },
  { key: 'facial-200', label: 'PREMIUM FACIAL TISSUES (200 PULLS)' },
  { key: 'kitchen-rolls', label: 'PREMIUM KITCHEN ROLLS' },
  { key: 'toilet-rolls', label: 'PREMIUM TOILET ROLLS' },
  { key: 'combos', label: 'FAMILY COMBO PACKS' },
];


export const FeaturedCategories = ({ onSelectCategory, products: propProducts = [] }) => {
  const [activeKey, setActiveKey] = useState('facial-100');
  const [products, setProducts] = useState(propProducts || []);
  const { addToCart, setSelectedProduct } = useCart();

  // Keep products in sync with propProducts, or fetch from API if empty
  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
    } else {
      fetch(`${BASE_URL}/api/products`)
        .then((res) => {
          if (!res.ok) throw new Error('API offline');
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        })
        .catch(() => {});
    }
  }, [propProducts]);

  // Filter ONLY real products that exist in the database for each category
  const getCategoryItems = (key) => {
    if (!products || products.length === 0) return [];

    let matching = [];

    if (key === 'facial-100') {
      matching = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const pulls = (p.pullsCount || '').toLowerCase();
        const isFace = cat.includes('face') || cat.includes('tissue') || name.includes('face');
        const is100 = name.includes('100') || pulls.includes('100');
        return isFace && is100;
      });
    } else if (key === 'facial-200') {
      matching = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const pulls = (p.pullsCount || '').toLowerCase();
        const isFace = cat.includes('face') || cat.includes('tissue') || name.includes('face');
        const is200 = name.includes('200') || pulls.includes('200');
        return isFace && is200;
      });
    } else if (key === 'kitchen-rolls') {
      matching = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('kitchen') || name.includes('kitchen');
      });
    } else if (key === 'toilet-rolls') {
      matching = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('toilet') || cat.includes('bath') || name.includes('toilet');
      });
    } else if (key === 'combos') {
      const comboMatches = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('combo') || cat.includes('bundle') || name.includes('combo') || name.includes('bundle');
      });
      // As requested: show all our products under family combo packs!
      matching = comboMatches.length > 0 ? comboMatches : products;
    }

    return matching.map((p) => {
      const firstVariant = p.variants?.[0];
      const displayPrice = p.price ?? firstVariant?.price ?? 0;
      const originalPrice = p.mrp || (p.price && p.mrp > p.price ? p.mrp : Math.round(displayPrice * 1.25));
      const hasDiscount = originalPrice > displayPrice;
      const discountPercent = hasDiscount
        ? `-${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%`
        : null;

      let subtitle = p.tagline;
      if (!subtitle || subtitle.length > 55) {
        subtitle = firstVariant?.size || p.pullsCount || (p.ply ? `${p.ply} Ultra Soft` : 'Premium Hygiene');
      }

      return {
        id: p._id,
        name: p.name,
        subtitle: subtitle,
        originalPrice: originalPrice,
        price: displayPrice,
        discount: discountPercent,
        image: p.image || (Array.isArray(p.images) && p.images[0]) || '/redefine-tissue-box.webp',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
        category: p.category,
        size: firstVariant?.size || 'Standard Pack',
        rawProduct: p,
      };
    });
  };

  const currentItems = getCategoryItems(activeKey);
  const currentTab = CATEGORY_TABS.find((t) => t.key === activeKey);

  const handleAddToCart = (item) => {
    if (item.rawProduct) {
      addToCart(item.rawProduct, null, 1);
    } else {
      addToCart(
        {
          _id: item.id,
          name: item.name,
          category: item.category,
          image: item.image,
          price: item.price,
        },
        { size: item.size, price: item.price }
      );
    }
  };

  return (
    <section id="shop-by-category-section" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. SECTION TITLE ================= */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4d3e] tracking-tight">
            Shop by Category
          </h2>
          <div className="w-16 h-0.5 bg-[#1b4d3e]/30 mx-auto mt-3" />
        </div>

        {/* ================= 2. HORIZONTAL CATEGORY TABS ================= */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-slate-100">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveKey(tab.key)}
                className={`pb-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? 'text-[#1b4d3e]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b4d3e] rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </div>

        {/* ================= 3. DYNAMIC CONTENT: SKELETON / REAL DB PRODUCTS / CLEAN NOTE ================= */}
        {products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-3 shadow-2xs"
              >
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded-md w-3/4 mx-auto" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2 mx-auto" />
                <div className="h-8 bg-slate-100 rounded-full w-full mt-2" />
              </div>
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="py-16 px-6 max-w-lg mx-auto text-center bg-slate-50/80 rounded-3xl border border-slate-200/80 shadow-xs animate-fade-in my-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100/60 text-[#1b4d3e] flex items-center justify-center border border-emerald-200 shadow-xs">
              <PackageOpen className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No Products in this Category Yet
            </h3>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              We are currently formulating and packing fresh batches for <span className="font-semibold text-slate-700">{currentTab?.label || 'this category'}</span>. Please explore our other ranges in the meantime!
            </p>

            <button
              onClick={() => onSelectCategory && onSelectCategory('All')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 group"
              >
                <div>
                  {/* Product Image Container */}
                  <div 
                    onClick={() => {
                      if (item.rawProduct) {
                        setSelectedProduct(item.rawProduct);
                      }
                    }}
                    className="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-3 cursor-pointer"
                  >
                    {/* Circular Discount Tag */}
                    {item.discount && (
                      <div className="absolute top-3 left-3 z-10 w-11 h-11 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-bold shadow-md">
                        {item.discount}
                      </div>
                    )}

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 rounded-xl"
                    />
                  </div>

                  {/* Card Text Content */}
                  <div className="p-4 text-center space-y-1.5">
                    <h3
                      onClick={() => {
                        if (item.rawProduct) {
                          setSelectedProduct(item.rawProduct);
                        }
                      }}
                      className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                      {item.subtitle}
                    </p>

                    {/* Pricing Row */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-base font-black text-[#1b4d3e]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2 px-4 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO CART</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
