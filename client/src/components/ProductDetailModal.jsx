import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, CheckCircle, ShieldCheck, Truck, Plus, Minus, Layers, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Set default variant whenever a new product is selected
  useEffect(() => {
    if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const currentVariant = selectedVariant || (selectedProduct.variants && selectedProduct.variants[0]) || {
    size: 'Standard Pack',
    price: selectedProduct.price,
  };

  const handleAdd = () => {
    addToCart(selectedProduct, currentVariant, quantity);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-slate-100 min-h-[240px] md:min-h-[380px] border-b md:border-b-0 md:border-r border-slate-200">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
            {selectedProduct.category}
          </span>
        </div>

        {/* Right: Product Details & Variant Selection Form */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[55vh] md:max-h-[85vh]">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                100% Virgin Wood Pulp • {selectedProduct.ply || '2-Ply'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 leading-snug">
                {selectedProduct.name}
              </h2>
              <p className="text-emerald-700 text-xs font-medium mt-0.5">
                {selectedProduct.tagline}
              </p>
            </div>

            {/* Price Display for Active Variant */}
            <div className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-baseline gap-2">
              <span>₹{(currentVariant.price * quantity).toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-normal">
                ({currentVariant.size} • incl. all taxes)
              </span>
            </div>

            {/* Quantity / Pack Variant Picker */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Select Pack Size / Quantity:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        currentVariant.size === v.size
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-xs font-bold">{v.size}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        ₹{v.price.toLocaleString('en-IN')} {v.unitWeight ? `• ${v.unitWeight}` : ''}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Checklist */}
            {selectedProduct.specs && selectedProduct.specs.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Product Features
                </h4>
                <ul className="space-y-1">
                  {selectedProduct.specs.map((spec, index) => (
                    <li key={index} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guarantee chips */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fast Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Skin Safe &amp; Food Grade</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
            {/* Number of Packs Stepper */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                Add {quantity}x ({currentVariant.size.split('(')[0].trim()}) • ₹{(currentVariant.price * quantity).toLocaleString('en-IN')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
