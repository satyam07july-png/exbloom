import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  Truck, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';

export const ContactUs = ({ onExploreClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Household / Personal Order',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/admin/public/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {}

    setLoading(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'Household / Personal Order',
      message: '',
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Customer &amp; Bulk Support</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch with <span className="text-emerald-700">Nexbloom</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Have questions regarding our tissue packs, delivery tracking, or need bulk supplies for cafes, hotels &amp; offices? We are here to assist you!
        </p>
      </div>

      {/* Main Grid: Form (7 cols) + Contact Details Cards (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* ================= 1. CONTACT & INQUIRY FORM (7 Cols) ================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill out the form below and our customer support team will reply within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you for reaching out. A Nexbloom representative has received your inquiry and will contact you via email/phone shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Inquiry Type *
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
                  >
                    <option value="Household / Personal Order">Household / Personal Order</option>
                    <option value="Bulk & Wholesale Supplies">Bulk &amp; Wholesale Supplies</option>
                    <option value="Restaurant / Cafe / Hotel Orders">Restaurant / Cafe / Hotel Orders</option>
                    <option value="Distribution & Retailer Partnership">Distribution &amp; Retailer Partnership</option>
                    <option value="Order Tracking & Support">Order Tracking &amp; Delivery Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Message / Requirement Details *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about the products, pack quantities, or questions you have..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Nexbloom</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>


        {/* ================= 2. DIRECT CONTACT INFO CARDS (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Phone Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Call / WhatsApp Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">+91 (022) 2890-4422 / +91 98200-11223</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700">
                Mon - Sat: 9:00 AM - 7:00 PM IST
              </span>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Email Inquiries</h3>
              <p className="text-xs text-slate-500 mt-0.5">support@nexbloom.com</p>
              <p className="text-xs text-slate-500">bulkorders@nexbloom.com</p>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Corporate Office &amp; Warehouse</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Nexbloom Hygiene Products Co.<br />
                Plot 14, Paper &amp; Logistics Hub, Andheri East, Mumbai, Maharashtra 400069
              </p>
            </div>
          </div>

          {/* B2B / Institutional Orders Spotlight */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold">Cafes, Hotels &amp; Corporate Bulk Orders</h3>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Looking for monthly carton supplies of dinner napkins, kitchen towels, or customized branding on tissue boxes?
            </p>
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-semibold">Custom Invoicing &amp; GST B2B</span>
              <span className="underline font-bold text-white cursor-pointer">Inquire Now &rarr;</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
