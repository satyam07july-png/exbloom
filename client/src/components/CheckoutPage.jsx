import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  AlertCircle, 
  Loader2, 
  Tag, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles,
  Banknote
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { handleRazorpayPayment } from '../utils/razorpay';
import BASE_URL from '../utils/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh'
];

export const CheckoutPage = ({
  currentUser,
  onBackToShopping,
  onOpenAuth,
  onOrderSuccess,
}) => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    clearCart,
    setLastOrder,
    showToast,
  } = useCart();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    landmark: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    orderNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'cod'
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync user details if currentUser loads or updates
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  // Handle coupon application
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'NEXBLOOM10' || code === 'WELCOME10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedCoupon({ code, discount });
      showToast(`Coupon "${code}" applied! You saved ₹${discount}`);
    } else if (code === 'FREESHIP') {
      setAppliedCoupon({ code, discount: shippingFee });
      showToast(`Free Delivery coupon applied!`);
    } else {
      setCouponError('Invalid coupon code. Try NEXBLOOM10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPayable = Math.max(0, cartTotal - discountAmount);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.phone.trim() || formData.phone.length < 10) return 'Please enter a valid 10-digit mobile number';
    if (!formData.address.trim()) return 'Please enter your delivery street address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.pincode.trim() || formData.pincode.length < 6) return 'Please enter a valid 6-digit PIN code';
    return null;
  };

  // Place Order (Online or COD)
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please sign in or create an account to proceed');
      onOpenAuth && onOpenAuth('register', 'First create your account before order');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // ─────────────────────────────────────────────────────────────
    // 1. CASH ON DELIVERY (COD) FLOW
    // ─────────────────────────────────────────────────────────────
    if (paymentMethod === 'cod') {
      try {
        const res = await fetch(`${BASE_URL}/api/payment/cod`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalPayable,
            customer: formData,
            items: cart.map((item) => ({
              product: item._id,
              name: `${item.name} (${item.selectedVariant || 'Standard'})`,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          try {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          } catch (err) {}

          const completedOrder = {
            id: data.order?.razorpayOrderId || `order_cod_${Date.now()}`,
            dbOrderId: data.dbOrderId,
            customer: formData,
            items: cart,
            totalAmount: finalPayable,
            paymentMethod: 'Cash on Delivery (COD)',
            status: 'placed',
            createdAt: new Date().toISOString(),
          };

          setLastOrder(completedOrder);
          clearCart();
          onOrderSuccess && onOrderSuccess(completedOrder);
        } else {
          throw new Error(data.error || 'Failed to place COD order');
        }
      } catch (err) {
        setErrorMessage(err.message || 'Error placing Cash on Delivery order. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ONLINE PAYMENT (RAZORPAY) FLOW
    // ─────────────────────────────────────────────────────────────
    await handleRazorpayPayment({
      customerData: formData,
      cartItems: cart,
      totalAmount: finalPayable,
      onSuccess: (completedOrder) => {
        setLoading(false);
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (err) {}

        const finalOrder = {
          ...completedOrder,
          customer: formData,
          items: cart,
          totalAmount: finalPayable,
          paymentMethod: 'Online Payment (Razorpay)',
          status: 'paid',
          createdAt: new Date().toISOString(),
        };

        setLastOrder(finalOrder);
        clearCart();
        onOrderSuccess && onOrderSuccess(finalOrder);
      },
      onError: (err) => {
        setLoading(false);
        setErrorMessage(typeof err === 'string' ? err : 'Payment failed or cancelled. Please try again.');
      },
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTH GUARD: User must be signed in to access checkout
  // ─────────────────────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1b4d3e] border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create an Account to Checkout
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              First create your account before placing your order. An account ensures your delivery address, live parcel tracking, and order receipts are safely linked to you.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth && onOpenAuth('register', 'First create your account before placing your order')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => onOpenAuth && onOpenAuth('login', 'Please sign in to continue with your checkout')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Sign In to Existing Account
            </button>
          </div>

          <button
            onClick={onBackToShopping}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPTY CART VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any items in your cart to checkout. Browse our premium range and add your preferred pack sizes.
          </p>
          <button
            onClick={onBackToShopping}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Nexbloom Range</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2-COLUMN MAIN CHECKOUT PAGE
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <button
            onClick={onBackToShopping}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 transition-colors mb-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout &amp; Delivery
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>256-Bit SSL Encrypted &amp; Verified</span>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-2xs animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================================================
            LEFT COLUMN (7 COLS): BILLING, SHIPPING ADDRESS & PAYMENT METHOD
        ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* 1. Contact Information Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Contact &amp; Customer Information
                  </h3>
                  <p className="text-[11px] text-slate-400">Order updates will be sent here</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Mobile Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Delivery & Billing Address Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Shipping &amp; Delivery Address
                  </h3>
                  <p className="text-[11px] text-slate-400">Where should we deliver your Nexbloom order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Flat / House No. / Building / Street Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="e.g. Flat 402, Green Meadows, 5th Main Road"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Near City Mall / Metro Pillar"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    PIN Code (6 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="110001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderNotes"
                    placeholder="e.g. Leave with guard, ring doorbell twice"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#1b4d3e] focus:ring-1 focus:ring-[#1b4d3e] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Select Payment Method
                  </h3>
                  <p className="text-[11px] text-slate-400">Choose your preferred payment method</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                
                {/* Option 1: Online Payment via Razorpay */}
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'online'
                      ? 'bg-emerald-50/70 border-[#1b4d3e] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-1 text-[#1b4d3e] focus:ring-[#1b4d3e] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Online Payment (UPI, Cards, NetBanking, Wallets)
                        </span>
                        <span className="bg-[#1b4d3e] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                          Fast &amp; Secure
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pay safely using Google Pay, PhonePe, Paytm, Debit/Credit Cards or NetBanking.
                      </p>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                </label>

                {/* Option 2: Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-50/70 border-[#1b4d3e] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#1b4d3e] focus:ring-[#1b4d3e] cursor-pointer"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pay with cash or UPI at the time of doorstep delivery.
                      </p>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                </label>

              </div>
            </div>

          </form>

        </div>

        {/* =========================================================================
            RIGHT COLUMN (5 COLS): ORDER SUMMARY, COUPON CODE & PLACE ORDER CTA
        ========================================================================= */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Summary Title */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Order Summary
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {/* Cart Items List Preview */}
            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {cart.map((item) => (
                <div
                  key={item.cartItemId || item._id}
                  className="flex items-center gap-3 bg-slate-50/90 rounded-2xl p-2.5 border border-slate-100"
                >
                  <img
                    src={item.image || '/redefine-tissue-box.webp'}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.selectedVariant || 'Standard Pack'} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Eco Seeds Free Gift Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center shrink-0 text-xs font-black">
                🌱
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-emerald-950">Free Organic Seeds Included!</p>
                <p className="text-[10px] text-emerald-700">
                  Every order includes plantable wildflower &amp; tulsi seeds ("Ek Nayi Muhim").
                </p>
              </div>
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. NEXBLOOM10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={appliedCoupon !== null}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 disabled:opacity-50"
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponError && (
                <p className="text-[11px] text-rose-600 pl-1">{couponError}</p>
              )}
            </form>

            {/* Pricing Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Home Delivery Fee</span>
                <span className={shippingFee === 0 ? 'text-emerald-700 font-extrabold' : 'font-bold text-slate-800'}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-400">Inclusive of all taxes</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#1b4d3e]">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Primary Order Placement Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#1b4d3e] hover:bg-[#143c30] disabled:bg-slate-400 text-white text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : paymentMethod === 'cod' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Place Order with Cash on Delivery (₹{finalPayable})</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Pay Online (₹{finalPayable})</span>
                </>
              )}
            </button>

            {/* Security Assurance footer */}
            <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Safe &amp; Protected 256-Bit Encrypted Order</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
