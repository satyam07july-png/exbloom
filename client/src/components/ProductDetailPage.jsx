import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Grid, 
  Maximize2, 
  Heart, 
  ArrowLeftRight, 
  Check, 
  Truck, 
  ShieldCheck, 
  Star, 
  ShoppingBag, 
  X, 
  ArrowUp,
  Share2
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductDetailPage = ({ product, products = [], onBackToCatalog, onSelectProduct }) => {
  const { addToCart, showToast } = useCart();

  // State for selected variant, quantity, media & tabs
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'reviews', 'shipping'
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewsList, setReviewsList] = useState([]);

  // Collect all images & media
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : (product?.image ? [product.image] : ['/redefine-tissue-box.webp']);

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
      setActiveMediaIndex(0);
      setPincodeStatus(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  if (!product) return null;

  // Active Variant & Pricing Calculations
  const currentVariant = selectedVariant || (product.variants && product.variants[0]) || {
    size: 'Standard Pack',
    price: product.price,
    mrp: product.mrp || 0,
    pulls: product.pullsCount || '',
  };

  const variantMrp = currentVariant.mrp || product.mrp || (currentVariant.price * 1.2);
  const variantPrice = currentVariant.price || product.price;
  const hasDiscount = variantMrp > variantPrice;
  const discountPercent = hasDiscount
    ? Math.round(((variantMrp - variantPrice) / variantMrp) * 100)
    : 0;

  // Next / Previous product navigation
  const currentIndex = products.findIndex((p) => p._id === product._id);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : products[products.length - 1];
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : products[0];

  // Related products (exclude current product)
  const relatedProducts = products
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  // Pincode validation handler
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available to ${pincode.trim()} within 2-3 business days. Free shipping on orders over ₹499.`,
    });
  };

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product, currentVariant, quantity);
  };

  // Thumbnail Navigation Handlers
  const handlePrevImage = () => {
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setActiveMediaIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20 relative font-sans">
      
      {/* =========================================================================
          1. BREADCRUMBS & TOP NAVIGATION ROW (Matching Image 2)
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Breadcrumb Links */}
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <button
              onClick={onBackToCatalog}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={onBackToCatalog}
              className="hover:text-emerald-800 transition-colors cursor-pointer"
            >
              {product.category || 'Premium Tissues'}
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </div>

          {/* Prev / Grid / Next Product Controls (< ⊞ >) */}
          <div className="flex items-center gap-1.5 text-slate-500">
            {prevProduct && (
              <button
                onClick={() => onSelectProduct && onSelectProduct(prevProduct)}
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title={`Previous: ${prevProduct.name}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onBackToCatalog}
              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Back to All Products"
            >
              <Grid className="w-4 h-4" />
            </button>

            {nextProduct && (
              <button
                onClick={() => onSelectProduct && onSelectProduct(nextProduct)}
                className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title={`Next: ${nextProduct.name}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. MAIN PRODUCT SHOWCASE SECTION (2 COLUMNS - MATCHING IMAGE 2)
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── LEFT COLUMN: VERTICAL THUMBNAIL STRIP + MAIN IMAGE VIEWER ── */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4 items-start">
            
            {/* Vertical Thumbnails Strip (Left) */}
            {images.length > 1 && (
              <div className="hidden sm:flex flex-col items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto scrollbar-none py-1">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-18 h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-50 shrink-0 ${
                        activeMediaIndex === idx
                          ? 'border-emerald-700 shadow-sm scale-102'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Main Image Container */}
            <div className="relative flex-1 w-full aspect-square bg-slate-50 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex items-center justify-center group">
              
              {/* Discount Percentage Badge (Top-Right) */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-xs font-black shadow-md tracking-wider">
                  -{discountPercent}%
                </div>
              )}

              {/* Main Product Image */}
              <img
                src={images[activeMediaIndex] || product.image || '/redefine-tissue-box.webp'}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103 cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Left Navigation Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Right Navigation Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Fullscreen / Zoom Button (Bottom-Left) */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 transition-all hover:scale-105 cursor-pointer"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile horizontal thumbnails row */}
            {images.length > 1 && (
              <div className="flex sm:hidden items-center gap-2 overflow-x-auto w-full pb-2">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeMediaIndex === idx ? 'border-emerald-700' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN: PRODUCT INFO & PURCHASE PANEL (MATCHING IMAGE 2) ── */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header: Title & Brand Box */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {product.ply || '2-Ply'} • {product.material || '100% Virgin Pulp'} {product.pullsCount ? `• ${product.pullsCount}` : ''}
                </p>
              </div>

              {/* Brand Logo Box (Top-Right) */}
              <div className="shrink-0 border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 flex items-center justify-center">
                <span className="text-xs font-black tracking-tight text-[#1b4d3e]">nexbloom</span>
              </div>
            </div>

            {/* Pricing Row: Strikethrough MRP + Selling Price */}
            <div className="flex items-baseline gap-3 pt-1">
              {hasDiscount && (
                <span className="text-lg sm:text-xl text-slate-400 line-through font-normal">
                  ₹{variantMrp.toFixed(2)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-black text-[#1b4d3e]">
                ₹{variantPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Save ₹{(variantMrp - variantPrice).toFixed(2)} ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* PINCODE DELIVERY CHECKER */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-white text-xs text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-emerald-600 font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  CHECK PINCODE
                </button>
              </form>

              {pincodeStatus && (
                <p className={`text-xs font-semibold ${pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.tagline || product.description || 'Engineered for spills, messes, and everyday hygiene needs. NexBloom combines strength, absorbency, and sustainability.'}
            </p>

            {/* Pack Size / Quantity Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Pack Size / Quantity:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.variants.map((v, idx) => {
                    const isSelected = currentVariant.size === v.size;
                    const vDiscount = v.mrp && v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : null;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{v.size}</p>
                          {vDiscount && (
                            <span className="text-[9px] bg-emerald-700 text-white font-black px-1.5 py-0.2 rounded">
                              {vDiscount}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-emerald-800 mt-1">
                          ₹{v.price.toFixed(2)} <span className="text-[11px] text-slate-500 font-normal">{v.pulls || v.unitWeight ? `• ${v.pulls || v.unitWeight}` : ''}</span>
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & ADD TO CART Button */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              
              {/* Stepper [- 1 +] */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer text-base font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer text-base font-bold"
                >
                  +
                </button>
              </div>

              {/* Dark Green ADD TO CART Pill Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            </div>

            {/* Secondary Action Links (Compare & Wishlist) */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setIsCompared(!isCompared);
                  showToast(isCompared ? 'Removed from comparison' : 'Added to product compare list');
                }}
                className={`flex items-center gap-1.5 hover:text-emerald-800 transition-colors cursor-pointer ${
                  isCompared ? 'text-emerald-700 font-bold' : ''
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isCompared ? 'Added to compare' : 'Add to compare'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to your wishlist');
                }}
                className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer ${
                  isWishlisted ? 'text-rose-600 font-bold' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                <span>{isWishlisted ? 'In your wishlist' : 'Add to wishlist'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          3. TABS SECTION: DESCRIPTION | REVIEWS | SHIPPING (MATCHING IMAGE 3)
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 border-b border-slate-200 pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === 'description'
                ? 'text-[#1b4d3e] border-b-2 border-[#1b4d3e]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            DESCRIPTION
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'text-[#1b4d3e] border-b-2 border-[#1b4d3e]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            REVIEWS ({reviewsList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-2 transition-all cursor-pointer ${
              activeTab === 'shipping'
                ? 'text-[#1b4d3e] border-b-2 border-[#1b4d3e]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            SHIPPING AND DELIVERY
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="py-8 max-w-4xl mx-auto">
          
          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed animate-fade-in">
              <p>
                {product.description || 'Engineered for spills, messes, and everyday kitchen needs. NexBloom Kitchen Rolls combine strength, absorbency, and sustainability.'}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-900 text-sm">Key Features:</h4>
                <ul className="space-y-2.5">
                  {(product.specs && product.specs.length > 0 ? product.specs : [
                    'Pack of 2 heavy-duty kitchen rolls',
                    'High absorbency power & 3X grease wiping',
                    'Strong & tear-resistant even when wet',
                    '100% Eco-friendly, chlorine-free & recyclable',
                    'Ideal for Families seeking premium everyday hygiene',
                  ]).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {reviewsList.length === 0 ? 'There are no reviews yet.' : `${reviewsList.length} Customer Reviews`}
                </p>
                <p className="text-xs text-slate-500">
                  Be the first to review &ldquo;{product.name}&rdquo;
                </p>
              </div>

              {/* Review Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewForm.name || !reviewForm.comment) return;
                  setReviewsList([...reviewsList, { ...reviewForm, date: new Date().toLocaleDateString() }]);
                  setReviewForm({ name: '', rating: 5, comment: '' });
                  showToast('Thank you for your review!');
                }}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4"
              >
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave a Review</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Rating *</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full bg-slate-50 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Good)</option>
                      <option value={2}>⭐⭐ (2 - Average)</option>
                      <option value={1}>⭐ (1 - Poor)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience with this tissue product..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b4d3e] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#143c30] transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SHIPPING AND DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3">
                <Truck className="w-6 h-6 text-emerald-800 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-xs">Free Standard Delivery on Orders Over ₹499</p>
                  <p className="text-[11px] text-slate-500">Delivered within 2-4 business days across India.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-xs">100% Hygienically Sealed &amp; Food-Safe</p>
                  <p className="text-[11px] text-slate-500">Every box and roll is packed in sterilized, moisture-proof protective packaging.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          4. RELATED PRODUCTS SECTION (MATCHING IMAGE 3)
      ========================================================================= */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-8">
            Related products
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {relatedProducts.map((rel) => {
              const relMrp = rel.mrp || rel.originalPrice || (rel.price * 1.25);
              const relDiscount = relMrp > rel.price ? Math.round(((relMrp - rel.price) / relMrp) * 100) : null;
              return (
                <div
                  key={rel._id}
                  onClick={() => onSelectProduct && onSelectProduct(rel)}
                  className="bg-white rounded-2xl border border-slate-200 p-3 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                      {relDiscount && (
                        <div className="absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center text-[10px] font-black shadow-md">
                          -{relDiscount}%
                        </div>
                      )}

                      <img
                        src={rel.image || (rel.images && rel.images[0]) || '/redefine-tissue-box.webp'}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 min-h-[32px]">
                      {rel.name}
                    </h4>

                    <div className="flex items-baseline gap-2 pt-1">
                      {relMrp > rel.price && (
                        <span className="text-[11px] text-slate-400 line-through">₹{relMrp.toFixed(2)}</span>
                      )}
                      <span className="text-sm font-black text-[#1b4d3e]">₹{rel.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(rel);
                    }}
                    className="mt-3 w-full py-2 bg-slate-100 hover:bg-[#1b4d3e] text-slate-800 hover:text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. FLOATING SCROLL TO TOP BUTTON (MATCHING IMAGE 3)
      ========================================================================= */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white text-slate-700 shadow-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* =========================================================================
          6. FULLSCREEN IMAGE LIGHTBOX MODAL
      ========================================================================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={images[activeMediaIndex] || product.image}
            alt={product.name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-scale-in"
          />
        </div>
      )}

    </div>
  );
};
