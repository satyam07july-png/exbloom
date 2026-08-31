import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Catalog } from './components/Catalog';
import { WhyUs } from './components/WhyUs';
import { Blogs } from './components/Blogs';
import { ContactUs } from './components/ContactUs';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { GreenMission } from './components/GreenMission';
import { TrustBadges } from './components/TrustBadges';
import { RedefiningCare } from './components/RedefiningCare';
import { UpgradeToBetterCare } from './components/UpgradeToBetterCare';
import { Reviews } from './components/Reviews';
import { ValuePillars } from './components/ValuePillars';
import { Footer } from './components/Footer';
import { Check } from 'lucide-react';

const sampleFallbackProducts = [
  {
    _id: "65d8a1",
    name: "Nexbloom Premium Table Tissue Napkins",
    category: "Tissue Paper",
    price: 129,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
    tagline: "Soft, highly absorbent 2-ply dinner & table napkins.",
    description: "Crafted from 100% natural virgin wood pulp. Embossed texture for maximum absorbency, skin-friendly, and food-safe certified.",
    specs: ["2-Ply Ultra Soft", "100% Virgin Wood Pulp", "Food Contact Safe Certified", "Lint-Free & Hypoallergenic"],
    ply: "2-Ply",
    material: "Virgin Wood Pulp",
    stock: 120,
    variants: [
      { size: "Pack of 2 (200 Sheets)", price: 129, stock: 50, unitWeight: "100 Sheets / Pack" },
      { size: "Pack of 4 (400 Sheets)", price: 239, stock: 40, unitWeight: "100 Sheets / Pack" },
      { size: "Pack of 8 (800 Sheets)", price: 449, stock: 30, unitWeight: "100 Sheets / Pack" },
      { size: "Bulk Pack of 12 (1200 Sheets)", price: 629, stock: 20, unitWeight: "100 Sheets / Pack" }
    ]
  },
  {
    _id: "65d8a2",
    name: "Nexbloom Ultra-Absorb Kitchen Towel Rolls",
    category: "Kitchen Roll",
    price: 179,
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=900&q=80",
    tagline: "3x quick-absorb honeycomb embossed kitchen rolls.",
    description: "Tough when wet, wipes grease, oil, and liquid spills effortlessly. Safe for food wrapping, frying oil drainage, and countertop wiping.",
    specs: ["2-Ply Honeycomb Embossed", "3X Liquid & Oil Absorption", "Certified Food Grade", "Fits all standard roll dispensers"],
    ply: "2-Ply Extra Thick",
    material: "100% Cellulose Fiber",
    stock: 95,
    variants: [
      { size: "Pack of 2 Rolls (120 Pulls)", price: 179, stock: 40, unitWeight: "60 Pulls / Roll" },
      { size: "Pack of 4 Rolls (240 Pulls)", price: 329, stock: 35, unitWeight: "60 Pulls / Roll" },
      { size: "Pack of 6 Rolls (360 Pulls)", price: 469, stock: 25, unitWeight: "60 Pulls / Roll" },
      { size: "Mega Pack of 12 Rolls", price: 879, stock: 15, unitWeight: "60 Pulls / Roll" }
    ]
  },
  {
    _id: "65d8a3",
    name: "Nexbloom CloudSoft Toilet Tissue Rolls",
    category: "Toilet Roll",
    price: 199,
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=900&q=80",
    tagline: "3-ply velvety soft, quick-dissolve & flushable bathroom rolls.",
    description: "Gentle on sensitive skin with micro-quilted cushioning. Dissolves rapidly in water, preventing pipe clogs in standard drainage & septic systems.",
    specs: ["3-Ply Micro-Quilted Softness", "100% Clog-Safe & Flushable", "No Bleach & Chemical Free", "Dermatologically Tested"],
    ply: "3-Ply Luxury Cushion",
    material: "Organic Virgin Pulp",
    stock: 140,
    variants: [
      { size: "Pack of 4 Rolls", price: 199, stock: 50, unitWeight: "160 Sheets / Roll" },
      { size: "Pack of 6 Rolls", price: 289, stock: 45, unitWeight: "160 Sheets / Roll" },
      { size: "Pack of 12 Rolls (Value Pack)", price: 549, stock: 30, unitWeight: "160 Sheets / Roll" },
      { size: "Family Box of 24 Rolls", price: 999, stock: 20, unitWeight: "160 Sheets / Roll" }
    ]
  },
  {
    _id: "65d8a4",
    name: "Nexbloom SilkTouch Facial Tissue Boxes",
    category: "Face Tissue",
    price: 149,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    tagline: "Dermatologist-approved featherlight soft facial pulls.",
    description: "Enriched with gentle natural fibers for everyday skincare, makeup removal, and refreshing hygiene. Completely lint-free and irritation-free.",
    specs: ["2-Ply Feather-Soft Sheets", "Dermatologically Tested", "Decorative Modern Box Design", "Odorless & Hypoallergenic"],
    ply: "2-Ply Silk Weave",
    material: "100% Pure Virgin Fibers",
    stock: 110,
    variants: [
      { size: "Pack of 2 Boxes (200 Pulls)", price: 149, stock: 45, unitWeight: "100 Pulls / Box" },
      { size: "Pack of 4 Boxes (400 Pulls)", price: 279, stock: 35, unitWeight: "100 Pulls / Box" },
      { size: "Pack of 6 Boxes (600 Pulls)", price: 399, stock: 25, unitWeight: "100 Pulls / Box" },
      { size: "Cuboid Car Pack of 4", price: 319, stock: 30, unitWeight: "80 Pulls / Box" }
    ]
  },
  {
    _id: "65d8a5",
    name: "Nexbloom Organic Bamboo Face Wipes & Tissues",
    category: "Face Tissue",
    price: 199,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
    tagline: "100% unbleached natural bamboo fiber facial wipes.",
    description: "Eco-friendly, naturally antibacterial bamboo facial tissue. Tree-free, chlorine-free, and ideal for sensitive and allergy-prone skin.",
    specs: ["100% Organic Bamboo Fiber", "Naturally Antibacterial", "Zero Chlorine / Unbleached", "Plastic-Free Packaging"],
    ply: "3-Ply Bamboo Fiber",
    material: "100% Bamboo",
    stock: 80,
    variants: [
      { size: "Pack of 2 Boxes (200 Sheets)", price: 199, stock: 35, unitWeight: "100 Sheets / Box" },
      { size: "Pack of 4 Boxes (400 Sheets)", price: 369, stock: 25, unitWeight: "100 Sheets / Box" },
      { size: "Pack of 8 Boxes (800 Sheets)", price: 689, stock: 15, unitWeight: "100 Sheets / Box" }
    ]
  },
  {
    _id: "65d8a6",
    name: "Nexbloom Heavy-Duty Multipurpose Kitchen Towels",
    category: "Kitchen Roll",
    price: 219,
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=900&q=80",
    tagline: "Extra thick 3-ply heavy spills & kitchen hygiene rolls.",
    description: "High tensile strength wet-wipe kitchen towel designed for tough greasy chimney cleans, stove wiping, and soaking oil from deep-fried snacks.",
    specs: ["3-Ply Ultra Absorbent", "Tear-Resistant When Wet", "Reusable up to 2 times for wiping", "Food Safe Certified"],
    ply: "3-Ply Extra Thick",
    material: "Virgin Cellulose",
    stock: 75,
    variants: [
      { size: "Pack of 2 Jumbo Rolls (160 Pulls)", price: 219, stock: 30, unitWeight: "80 Pulls / Roll" },
      { size: "Pack of 4 Jumbo Rolls (320 Pulls)", price: 399, stock: 25, unitWeight: "80 Pulls / Roll" },
      { size: "Pack of 8 Jumbo Rolls (640 Pulls)", price: 749, stock: 20, unitWeight: "80 Pulls / Roll" }
    ]
  }
];

function MainContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(sampleFallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const adminSaved = localStorage.getItem('nexbloom_admin_user');
      if (adminSaved) return JSON.parse(adminSaved);
      const userSaved = localStorage.getItem('nexbloom_user');
      if (userSaved) return JSON.parse(userSaved);
      return null;
    } catch (e) {
      return null;
    }
  });

  const { toastMessage, showToast } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {
        // Fallback data
      });
  }, []);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAll = () => {
    setActiveTab('catalog');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (authData) => {
    setCurrentUser(authData.user);
    if (authData.role === 'admin') {
      showToast('Welcome Administrator! Opening Admin Portal...');
      setTimeout(() => {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      showToast(`Welcome back, ${authData.user.name}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexbloom_admin_token');
    localStorage.removeItem('nexbloom_admin_user');
    localStorage.removeItem('nexbloom_user_token');
    localStorage.removeItem('nexbloom_user');
    showToast('Signed out successfully');
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // If Admin Portal is opened, render full-screen Admin Portal
  if (activeTab === 'admin') {
    return (
      <AdminPortal
        onBackToStore={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        products={products}
        setProducts={setProducts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <Hero
              onExploreClick={handleExploreAll}
            />
            <TrustBadges />
            <FeaturedProducts
              products={products}
              onExploreAll={handleExploreAll}
            />
            <FeaturedCategories onSelectCategory={handleSelectCategory} />
            <GreenMission onExploreClick={handleExploreAll} />
            <RedefiningCare />
            <UpgradeToBetterCare />
            <Reviews />
            <Blogs isSection={true} />
          </div>
        )}

        {activeTab === 'catalog' && (
          <div>
            <Catalog
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              initialCategory={selectedCategory}
            />
          </div>
        )}

        {activeTab === 'why-us' && (
          <div>
            <WhyUs onExploreClick={handleExploreAll} />
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <Blogs />
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <ContactUs onExploreClick={handleExploreAll} />
          </div>
        )}
      </main>

      {/* Value Pillars 4-Pastel Strip (Above Footer) */}
      <ValuePillars />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal onContinueShopping={() => setActiveTab('catalog')} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
