import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  Layers, 
  Check, 
  Film, 
  Play, 
  Percent, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0); // Index in mediaList
  const [activeMediaType, setActiveMediaType] = useState('image'); // 'image' or 'video'
  const [activeMediaUrl, setActiveMediaUrl] = useState('');

  // Collect all images & videos into unified media list
  const images = selectedProduct?.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : (selectedProduct?.image ? [selectedProduct.image] : ['/redefine-tissue-box.webp']);
  const videos = selectedProduct?.videos || [];

  const mediaList = [
    ...images.map((url) => ({ type: 'image', url })),
    ...videos.map((url) => ({ type: 'video', url })),
  ];

  // Set default variant & media whenever a new product is selected
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        setSelectedVariant(selectedProduct.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setActiveMediaIndex(0);
      setActiveMediaType('image');
      setActiveMediaUrl(images[0] || selectedProduct.image || '/redefine-tissue-box.webp');
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const currentVariant = selectedVariant || (selectedProduct.variants && selectedProduct.variants[0]) || {
    size: 'Standard Pack',
    price: selectedProduct.price,
    mrp: selectedProduct.mrp || 0,
    pulls: selectedProduct.pullsCount || '',
  };

  const variantMrp = currentVariant.mrp || selectedProduct.mrp || 0;
  const variantPrice = currentVariant.price || selectedProduct.price;
  const hasDiscount = variantMrp > variantPrice;
  const discountPercent = hasDiscount
    ? Math.round(((variantMrp - variantPrice) / variantMrp) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(selectedProduct, currentVariant, quantity);
    setSelectedProduct(null);
  };

  const handleSelectMedia = (item, index) => {
    setActiveMediaIndex(index);
    setActiveMediaType(item.type);
    setActiveMediaUrl(item.url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= LEFT: MEDIA GALLERY (IMAGES & VIDEOS) ================= */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <div>
            {/* Main Stage View (Image or Video Player) */}
            <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs flex items-center justify-center">
              
              {activeMediaType === 'video' ? (
                <video
                  src={activeMediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black rounded-2xl"
                />
              ) : (
                <img
                  src={activeMediaUrl || selectedProduct.image || '/redefine-tissue-box.webp'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Category Tag */}
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                {selectedProduct.category}
              </span>

              {/* Discount Tag */}
              {hasDiscount && (
                <span className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {mediaList.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {mediaList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMedia(item, idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-white ${
                      activeMediaIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-400/40 scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-white" />
                      </div>
                    ) : (
                      <img src={item.url} alt="thumbnail" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="pt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500 border-t border-slate-200/60 mt-3">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fast Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Food &amp; Skin Safe</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: PRODUCT DETAILS & VARIANT PICKER ================= */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[55vh] md:max-h-[85vh] bg-white">
          <div className="space-y-4">
            
            {/* Header / Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                  {selectedProduct.ply || '2-Ply'} • {selectedProduct.material || '100% Virgin Pulp'}
                </span>
                {selectedProduct.pullsCount && (
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {selectedProduct.pullsCount}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {selectedProduct.name}
              </h2>

              {selectedProduct.tagline && (
                <p className="text-emerald-700 text-xs font-semibold mt-0.5">
                  {selectedProduct.tagline}
                </p>
              )}
            </div>

            {/* Price Display with MRP & Discount Badge */}
            <div className="border-y border-slate-100 py-3 space-y-1">
              <div className="flex items-baseline gap-2.5">
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{(variantMrp * quantity).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-2xl font-black text-[#1b4d3e]">
                  ₹{(variantPrice * quantity).toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    {discountPercent}% OFF (Save ₹{((variantMrp - variantPrice) * quantity).toLocaleString('en-IN')})
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Inclusive of all taxes • {currentVariant.size}
              </p>
            </div>

            {/* Quantity / Pack Variant Picker */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Select Pack Size / Quantity:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v, idx) => {
                    const isSelected = currentVariant.size === v.size;
                    const vDiscount = v.mrp && v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : null;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-2xs ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold">{v.size}</p>
                          {vDiscount && (
                            <span className="text-[9px] bg-emerald-700 text-white font-bold px-1 rounded">
                              {vDiscount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-1.5 mt-1">
                          {v.mrp > v.price && (
                            <span className="text-[10px] text-slate-400 line-through">₹{v.mrp}</span>
                          )}
                          <span className="text-xs font-black text-emerald-800">₹{v.price}</span>
                          <span className="text-[10px] text-slate-500">{v.pulls || v.unitWeight ? `• ${v.pulls || v.unitWeight}` : ''}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Highlights / Specs */}
            {selectedProduct.specs && selectedProduct.specs.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Product Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedProduct.specs.map((spec, index) => (
                    <div key={index} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedProduct.description && (
              <div className="text-xs text-slate-600 leading-relaxed pt-1">
                {selectedProduct.description}
              </div>
            )}

          </div>

          {/* Action Row */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
            {/* Number of Packs Stepper */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3 px-5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ₹{(variantPrice * quantity).toLocaleString('en-IN')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
