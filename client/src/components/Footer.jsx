import React from 'react';
import { Phone, Mail, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer = ({ onNavigate }) => {
  const { setIsCartOpen, setIsCheckoutOpen } = useCart();

  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        
        {/* Main 4 Columns Grid Matching Reference Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          
          {/* ================= 1. LEFT BRAND & CONTACT INFO (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-4">
            {/* Transparent Brand Logo */}
            <div>
              <img
                src="/logo.png"
                alt="NexBloom - Feel the Bloom in Every Box"
                className="h-11 w-auto object-contain"
              />
            </div>

            {/* Narrative Quote */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              We see growth not as an end goal, but as an opportunity to make better decisions at every stage.
            </p>

            {/* Direct Contact Phone & Email */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <p className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Phone: <a href="tel:+919871295556" className="font-semibold text-slate-800 hover:text-emerald-700">+91-9871295556</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Email: <a href="mailto:support@nexbloom.in" className="font-semibold text-slate-800 hover:text-emerald-700">support@nexbloom.in</a></span>
              </p>
            </div>

            {/* 3 Circular Social Media Icons (Instagram, Facebook, Youtube) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram (Pink) */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#E1306C] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook (Blue) */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              {/* YouTube (Red) */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ================= 2. OUR PRODUCTS (3 Cols) ================= */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              OUR PRODUCTS
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Family Pack &amp; Combos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Premium Face Tissues (100 Pulls)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Premium Face Tissues (200 Pulls)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Premium Kitchen Rolls
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Premium Toilet Rolls
                </button>
              </li>
            </ul>
          </div>

          {/* ================= 3. USEFUL LINKS (3 Cols) ================= */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              USEFUL LINKS
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => alert('Privacy Policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Cancellation & Refund Policy')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Cancellation &amp; Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Terms & Conditions')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  About us
                </button>
              </li>
            </ul>
          </div>

          {/* ================= 4. FOOTER MENU (2 Cols) ================= */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              FOOTER MENU
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => alert('Disclaimer: 100% sustainably sourced virgin cellulose products.')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Checkout
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-left"
                >
                  Shop
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= BOTTOM SUB-FOOTER BAR ================= */}
        <div className="pt-6 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>Copyright @2025 NexBloom. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
