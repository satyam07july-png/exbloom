import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categoryData = {
  'facial-100': {
    label: 'PREMIUM FACIAL TISSUES (100 PULLS)',
    items: [
      {
        id: 'f100-1',
        name: 'NexBloom SilkTouch 100 Pulls – Pack of 1 Box',
        subtitle: '100 Pulls • 2-Ply Ultra Soft',
        originalPrice: 99,
        price: 67,
        discount: '-32%',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 1 Box (100 Pulls)',
      },
      {
        id: 'f100-2',
        name: 'NexBloom SilkTouch 100 Pulls – Pack of 2 Boxes',
        subtitle: '200 Pulls Total • 2-Ply Silk Weave',
        originalPrice: 198,
        price: 121,
        discount: '-39%',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 2 Boxes (200 Pulls)',
      },
      {
        id: 'f100-4',
        name: 'NexBloom SilkTouch 100 Pulls – Pack of 4 Boxes',
        subtitle: '400 Pulls Total • Value Family Pack',
        originalPrice: 396,
        price: 226,
        discount: '-43%',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 4 Boxes (400 Pulls)',
      },
      {
        id: 'f100-6',
        name: 'NexBloom SilkTouch 100 Pulls – Pack of 6 Boxes',
        subtitle: '600 Pulls Total • Mega Saver Box',
        originalPrice: 594,
        price: 321,
        discount: '-46%',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 6 Boxes (600 Pulls)',
      },
    ],
  },
  'facial-200': {
    label: 'PREMIUM FACIAL TISSUES (200 PULLS)',
    items: [
      {
        id: 'f200-1',
        name: 'NexBloom Luxury 200 Pulls – Pack of 1 Box',
        subtitle: '200 Pulls • 3-Ply Extra Soft',
        originalPrice: 149,
        price: 99,
        discount: '-34%',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 1 Box (200 Pulls)',
      },
      {
        id: 'f200-2',
        name: 'NexBloom Luxury 200 Pulls – Pack of 2 Boxes',
        subtitle: '400 Pulls Total • 3-Ply Feather Silk',
        originalPrice: 298,
        price: 179,
        discount: '-40%',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 2 Boxes (400 Pulls)',
      },
      {
        id: 'f200-4',
        name: 'NexBloom Luxury 200 Pulls – Pack of 4 Boxes',
        subtitle: '800 Pulls Total • Living Room Pack',
        originalPrice: 596,
        price: 329,
        discount: '-45%',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 4 Boxes (800 Pulls)',
      },
      {
        id: 'f200-6',
        name: 'NexBloom Luxury 200 Pulls – Pack of 6 Boxes',
        subtitle: '1200 Pulls Total • Bumper Stock Pack',
        originalPrice: 894,
        price: 469,
        discount: '-48%',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
        category: 'Face Tissue',
        size: 'Pack of 6 Boxes (1200 Pulls)',
      },
    ],
  },
  'kitchen-rolls': {
    label: 'PREMIUM KITCHEN ROLLS',
    items: [
      {
        id: 'kr-2',
        name: 'NexBloom Ultra-Absorb Kitchen Towels – Pack of 2',
        subtitle: '120 Pulls • 3X Fast Liquid & Grease Wipes',
        originalPrice: 250,
        price: 179,
        discount: '-28%',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
        category: 'Kitchen Roll',
        size: 'Pack of 2 Rolls',
      },
      {
        id: 'kr-4',
        name: 'NexBloom Ultra-Absorb Kitchen Towels – Pack of 4',
        subtitle: '240 Pulls • Honeycomb Embossed 2-Ply',
        originalPrice: 500,
        price: 329,
        discount: '-34%',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
        category: 'Kitchen Roll',
        size: 'Pack of 4 Rolls',
      },
      {
        id: 'kr-6',
        name: 'NexBloom Ultra-Absorb Kitchen Towels – Pack of 6',
        subtitle: '360 Pulls • Heavy-Duty Frying Oil Absorb',
        originalPrice: 750,
        price: 469,
        discount: '-37%',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
        category: 'Kitchen Roll',
        size: 'Pack of 6 Rolls',
      },
      {
        id: 'kr-12',
        name: 'NexBloom Ultra-Absorb Kitchen Towels – Mega 12 Pack',
        subtitle: '720 Pulls Total • Restaurant & Home Bulk',
        originalPrice: 1500,
        price: 879,
        discount: '-41%',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
        category: 'Kitchen Roll',
        size: 'Mega Pack of 12 Rolls',
      },
    ],
  },
  'toilet-rolls': {
    label: 'PREMIUM TOILET ROLLS',
    items: [
      {
        id: 'tr-4',
        name: 'NexBloom CloudSoft Toilet Rolls – Pack of 4',
        subtitle: '3-Ply Luxury Cushion • 100% Flushable',
        originalPrice: 280,
        price: 199,
        discount: '-29%',
        image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
        category: 'Toilet Roll',
        size: 'Pack of 4 Rolls',
      },
      {
        id: 'tr-6',
        name: 'NexBloom CloudSoft Toilet Rolls – Pack of 6',
        subtitle: '3-Ply Micro-Quilted • Rapid Dissolve',
        originalPrice: 420,
        price: 289,
        discount: '-31%',
        image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
        category: 'Toilet Roll',
        size: 'Pack of 6 Rolls',
      },
      {
        id: 'tr-12',
        name: 'NexBloom CloudSoft Toilet Rolls – Value Pack of 12',
        subtitle: '1920 Sheets • Septic Safe & Chemical Free',
        originalPrice: 840,
        price: 549,
        discount: '-35%',
        image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
        category: 'Toilet Roll',
        size: 'Pack of 12 Rolls',
      },
      {
        id: 'tr-24',
        name: 'NexBloom CloudSoft Toilet Rolls – Family Box of 24',
        subtitle: '3840 Sheets • Maximum Household Savings',
        originalPrice: 1680,
        price: 999,
        discount: '-41%',
        image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
        category: 'Toilet Roll',
        size: 'Family Box of 24 Rolls',
      },
    ],
  },
  'combos': {
    label: 'FAMILY COMBO PACKS',
    items: [
      {
        id: 'cb-1',
        name: 'NexBloom Essential Home Hygiene Starter Kit',
        subtitle: '2x Kitchen Rolls + 4x Toilet Rolls + 2x Face Boxes',
        originalPrice: 799,
        price: 499,
        discount: '-38%',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
        category: 'Combo Pack',
        size: 'All-In-One Starter Combo',
      },
      {
        id: 'cb-2',
        name: 'NexBloom Monthly Family Restock Mega Box',
        subtitle: '6x Kitchen Rolls + 12x Toilet Rolls + 4x Face Boxes',
        originalPrice: 1799,
        price: 1099,
        discount: '-39%',
        image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
        category: 'Combo Pack',
        size: 'Monthly Mega Saver Box',
      },
      {
        id: 'cb-3',
        name: 'NexBloom Gourmet Kitchen & Dining Combo',
        subtitle: '4x Kitchen Rolls + 4x Table Tissue Napkins (400 Sheets)',
        originalPrice: 899,
        price: 549,
        discount: '-39%',
        image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80',
        category: 'Combo Pack',
        size: 'Kitchen & Table Dining Combo',
      },
      {
        id: 'cb-4',
        name: 'NexBloom Skincare & Bathroom Velvet Bundle',
        subtitle: '6x Facial Tissue Boxes + 12x CloudSoft Toilet Rolls',
        originalPrice: 1499,
        price: 899,
        discount: '-40%',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        category: 'Combo Pack',
        size: 'Skincare & Bathroom Velvet Pack',
      },
    ],
  },
};

export const FeaturedCategories = ({ onSelectCategory, products = [] }) => {
  const [activeKey, setActiveKey] = useState('facial-100');
  const { addToCart, setSelectedProduct } = useCart();

  // Helper to map dynamic products to category tabs
  const getCategoryItems = (key) => {
    const defaultItems = categoryData[key]?.items || [];
    if (!products || products.length === 0) return defaultItems;

    let matchingDynamic = [];
    if (key === 'facial-100' || key === 'facial-200') {
      matchingDynamic = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('face') || cat.includes('tissue') || cat.includes('box');
      });
    } else if (key === 'kitchen-rolls') {
      matchingDynamic = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('kitchen') || cat.includes('towel');
      });
    } else if (key === 'toilet-rolls') {
      matchingDynamic = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('toilet') || cat.includes('bath') || cat.includes('roll');
      });
    } else if (key === 'combos') {
      matchingDynamic = products.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('combo') || cat.includes('bundle') || cat.includes('pack');
      });
    }

    if (matchingDynamic.length > 0) {
      const formattedDynamic = matchingDynamic.map((p) => {
        const firstVariant = p.variants?.[0];
        const displayPrice = firstVariant?.price ?? p.price ?? 0;
        const originalPrice = p.mrp || p.originalPrice || firstVariant?.mrp || (displayPrice * 1.3);
        const hasDiscount = originalPrice > displayPrice;
        const discountPercent = hasDiscount
          ? `-${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%`
          : '-20%';

        return {
          id: p._id,
          name: p.name,
          subtitle: p.tagline || `${p.ply || '2-Ply'} • ${p.pullsCount || 'Ultra Soft'}`,
          originalPrice: Math.round(originalPrice),
          price: displayPrice,
          discount: discountPercent,
          image: p.image || (Array.isArray(p.images) && p.images[0]) || '/redefine-tissue-box.webp',
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
          category: p.category,
          size: firstVariant?.size || 'Standard Pack',
          rawProduct: p,
        };
      });

      // Combine dynamic products first, then fill with default items up to 4
      const combined = [...formattedDynamic, ...defaultItems.filter(d => !formattedDynamic.some(f => f.name === d.name))];
      return combined.slice(0, 4);
    }

    return defaultItems;
  };

  const currentCategoryLabel = categoryData[activeKey]?.label || 'FEATURED PRODUCTS';
  const currentItems = getCategoryItems(activeKey);

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
          {Object.entries(categoryData).map(([key, cat]) => {
            const isActive = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`pb-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? 'text-[#1b4d3e]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b4d3e] rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </div>

        {/* ================= 3. 4-PRODUCT CARDS GRID MATCHING REFERENCE IMAGE ================= */}
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
                    } else {
                      setSelectedProduct({
                        _id: item.id,
                        name: item.name,
                        category: item.category,
                        image: item.image,
                        images: item.images || [item.image],
                        price: item.price,
                        mrp: item.originalPrice,
                        tagline: item.subtitle,
                        description: `${item.name} - Ultra-soft, highly absorbent 100% virgin pulp tissues crafted for superior comfort and everyday hygiene.`,
                        ply: '2-Ply Ultra Soft',
                        variants: [{ size: item.size, price: item.price, mrp: item.originalPrice }],
                      });
                    }
                  }}
                  className="relative w-full aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-2 cursor-pointer"
                >
                  {/* Circular Discount Tag (-32%, -39%, -43%, -46%) */}
                  <div className="absolute top-3 left-3 z-10 w-11 h-11 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-bold shadow-md">
                    {item.discount}
                  </div>

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
                      } else {
                        setSelectedProduct({
                          _id: item.id,
                          name: item.name,
                          category: item.category,
                          image: item.image,
                          images: item.images || [item.image],
                          price: item.price,
                          mrp: item.originalPrice,
                          tagline: item.subtitle,
                          description: `${item.name} - Ultra-soft, highly absorbent 100% virgin pulp tissues crafted for superior comfort and everyday hygiene.`,
                          ply: '2-Ply Ultra Soft',
                          variants: [{ size: item.size, price: item.price, mrp: item.originalPrice }],
                        });
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
                    <span className="text-xs text-slate-400 line-through">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
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

      </div>
    </section>
  );
};
