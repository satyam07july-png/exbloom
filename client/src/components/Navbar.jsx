import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, Layers, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Our Range', id: 'catalog' },
    { label: 'Why Nexbloom', id: 'why-us' },
    { label: 'Blogs', id: 'blogs' },
    { label: 'Contact Us', id: 'contact' },
  ];

  const handleNavClick = (item) => {
    if (item.category) {
      setActiveTab('catalog');
    } else {
      setActiveTab(item.id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-md border-b border-emerald-100 shadow-xs py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Flex Container */}
        <div className="flex items-center justify-between">
          
          {/* ================= 1. LEFT SIDE: NAVIGATION LINKS (BOLD & GREEN) ================= */}
          <div className="flex-1 hidden md:flex items-center justify-start gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-3.5 py-1.5 text-xs sm:text-[13px] font-extrabold rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#1b4d3e] text-white shadow-xs'
                    : 'text-[#1b4d3e] hover:text-emerald-950 hover:bg-emerald-50/90'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[#1b4d3e] hover:text-emerald-950"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* ================= 2. CENTER: BRAND LOGO ================= */}
          <div
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-none flex items-center justify-center cursor-pointer select-none group px-2 sm:px-4"
          >
            <img
              src="/logo.png"
              alt="NexBloom - Feel the Bloom in Every Box"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* ================= 3. RIGHT SIDE: SEARCH, USER/LOGIN & CART ================= */}
          <div className="flex-1 flex items-center justify-end gap-2.5">
            
            {/* Search bar */}
            <div className="relative hidden lg:block w-44">
              <input
                type="text"
                placeholder="Search tissues & rolls..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full bg-emerald-50/40 text-xs font-bold text-[#1b4d3e] placeholder-[#1b4d3e]/60 pl-8 pr-3 py-1.5 rounded-full border border-emerald-200 focus:outline-none focus:border-[#1b4d3e] focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#1b4d3e] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Standard Unified Login / User Profile Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs font-black text-[#1b4d3e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#1b4d3e]" />
                  <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-emerald-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-[#1b4d3e] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveTab('admin');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-[#1b4d3e] hover:bg-emerald-50 font-black flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Open Admin Portal</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#1b4d3e] hover:text-emerald-950 px-3 py-1.5 rounded-full bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#1b4d3e]" />
                <span>Login</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-extrabold px-3.5 py-1.5 rounded-full text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#1b4d3e] text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-white border border-emerald-200 rounded-2xl shadow-lg flex flex-col gap-2">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full bg-emerald-50/40 text-xs font-bold text-[#1b4d3e] placeholder-[#1b4d3e]/60 pl-8 pr-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:border-[#1b4d3e]"
              />
              <Search className="w-3.5 h-3.5 text-[#1b4d3e] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`text-left px-3 py-2 text-xs font-extrabold rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#1b4d3e] text-white'
                    : 'text-[#1b4d3e] hover:bg-emerald-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-lg bg-[#1b4d3e] text-white text-xs font-black text-center mt-2 shadow-xs"
              >
                Login / Register
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};