import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    shippingFee,
    cartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingTarget = 499;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingTarget) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingTarget - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">Shopping Cart</h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-emerald-50/60 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add <strong className="text-emerald-800">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> for FREE Delivery
                  </>
                ) : (
                  <strong className="text-emerald-800">🎉 You unlocked FREE Home Delivery!</strong>
                )}
              </span>
              <span className="text-emerald-800 font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-14 space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500">Add tissue rolls or boxes to get started.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId || item._id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-center"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    
                    {/* Selected Pack Size Tag */}
                    {item.selectedVariant && (
                      <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.2 rounded mt-0.5">
                        {item.selectedVariant}
                      </span>
                    )}

                    <p className="text-xs text-emerald-700 font-bold mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center bg-white border border-slate-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item._id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item._id, 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId || item._id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : 'text-slate-800'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-emerald-800">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
