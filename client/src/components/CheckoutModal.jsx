import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { handleRazorpayPayment } from '../utils/razorpay';

export const CheckoutModal = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    setLastOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address';
    if (!formData.phone.trim() || formData.phone.length < 10) return 'Please enter a valid 10-digit mobile number';
    if (!formData.address.trim()) return 'Please enter your delivery address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.pincode.trim() || formData.pincode.length < 6) return 'Please enter a valid 6-digit PIN code';
    return null;
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    await handleRazorpayPayment({
      customerData: formData,
      cartItems: cart,
      totalAmount: cartTotal,
      onSuccess: (completedOrder) => {
        setLoading(false);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        setLastOrder({
          ...completedOrder,
          customer: formData,
          items: cart,
          totalAmount: cartTotal,
        });

        clearCart();
        setIsCheckoutOpen(false);
      },
      onError: (err) => {
        setLoading(false);
        setErrorMessage(typeof err === 'string' ? err : 'Payment processing failed. Please try again.');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Secure Order Checkout</h2>
              <p className="text-[11px] text-slate-500">
                Safe &amp; Encrypted 256-Bit Razorpay Payment
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-5 mt-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePayNow} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                1. Delivery Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Phone Number (for Courier Updates) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                2. Shipping Address
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Complete Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Flat 402, Highline Residency, Bandra West"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-xs text-slate-800 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-xs text-slate-800 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="400050"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-xs text-slate-800 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Order Items ({cart.length})
              </h3>

              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId || item._id} className="flex items-center gap-2.5 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-md object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-slate-400 text-[10px]">
                        {item.selectedVariant || ''} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-800">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery</span>
                  <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-slate-800'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                  <span>Payable Total</span>
                  <span className="text-emerald-800">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Pay with Razorpay Button */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Razorpay...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{cartTotal.toLocaleString('en-IN')} with Razorpay</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>UPI, Debit/Credit Cards &amp; Netbanking Supported</span>
              </p>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
