import React from 'react';
import { CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const OrderSuccessModal = ({ onContinueShopping }) => {
  const { lastOrder, setLastOrder } = useCart();
  const [copied, setCopied] = React.useState(false);

  if (!lastOrder) return null;

  const copyOrderId = () => {
    const id = lastOrder.razorpayPaymentId || lastOrder._id || 'NEX-883920';
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl text-center space-y-5">
        
        {/* Success Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Order Confirmed
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Payment Successful!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Confirmation receipt sent to{' '}
            <strong className="text-slate-800">{lastOrder.customer?.email || 'your email'}</strong>.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Payment ID</span>
            <button
              onClick={copyOrderId}
              className="flex items-center gap-1 text-emerald-700 font-mono font-semibold hover:underline cursor-pointer"
            >
              <span>{lastOrder.razorpayPaymentId || lastOrder.razorpayOrderId || 'pay_confirmed'}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Customer</span>
            <span className="text-slate-800 font-medium">{lastOrder.customer?.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Shipping To</span>
            <span className="text-slate-800 font-medium text-right max-w-[180px] truncate">
              {lastOrder.customer?.address}, {lastOrder.customer?.city}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Delivery</span>
            <span className="text-emerald-700 font-semibold">2 - 4 Business Days</span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold">
            <span className="text-slate-900">Total Paid</span>
            <span className="text-emerald-800">₹{(lastOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            setLastOrder(null);
            if (onContinueShopping) onContinueShopping();
          }}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
