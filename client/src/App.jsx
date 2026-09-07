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
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
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
import BASE_URL from './utils/api';

function MainContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [authModalConfig, setAuthModalConfig] = useState({
    isOpen: false,
    mode: 'login',
    message: null,
  });
  const [pendingCheckout, setPendingCheckout] = useState(false);
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

  const { toastMessage, showToast, selectedProduct, setSelectedProduct } = useCart();

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
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
    setSelectedProduct(null);
    setSelectedCategory(cat);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAll = () => {
    setSelectedProduct(null);
    setActiveTab('catalog');
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setSelectedProduct(null);
    if (tab === 'checkout') {
      handleProceedToCheckout();
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth-gated checkout transition
  const handleProceedToCheckout = () => {
    setSelectedProduct(null);
    if (!currentUser) {
      showToast('First create your account before order');
      setPendingCheckout(true);
      setAuthModalConfig({
        isOpen: true,
        mode: 'register',
        message: 'First create your account before order',
      });
      return;
    }
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (authData) => {
    setCurrentUser(authData.user);
    if (authData.role === 'admin') {
      showToast('Welcome Administrator! Opening Admin Portal...');
      setTimeout(() => {
        setSelectedProduct(null);
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      showToast(`Welcome back, ${authData.user.name}!`);
      if (pendingCheckout) {
        setPendingCheckout(false);
        showToast('Account ready! Proceeding to Checkout...');
        setTimeout(() => {
          setSelectedProduct(null);
          setActiveTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
      }
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
        activeTab={selectedProduct ? '' : activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setAuthModalConfig({ isOpen: true, mode: 'login', message: null })}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            products={products}
            onBackToCatalog={() => {
              setSelectedProduct(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
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
                <FeaturedCategories products={products} onSelectCategory={handleSelectCategory} />
                <GreenMission onExploreClick={handleExploreAll} />
                <RedefiningCare />
                <UpgradeToBetterCare />
                <Reviews />
                <Blogs isSection={true} onNavigateToBlogs={() => handleTabChange('blogs')} />
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

            {activeTab === 'checkout' && (
              <div>
                <CheckoutPage
                  currentUser={currentUser}
                  onBackToShopping={() => {
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenAuth={(mode, msg) => {
                    setPendingCheckout(true);
                    setAuthModalConfig({
                      isOpen: true,
                      mode: mode || 'register',
                      message: msg || 'First create your account before order',
                    });
                  }}
                  onOrderSuccess={(completedOrder) => {
                    showToast('🎉 Order placed successfully!');
                  }}
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
          </>
        )}
      </main>

      {/* Value Pillars 4-Pastel Strip (Above Footer) */}
      <ValuePillars />

      {/* Footer */}
      <Footer onNavigate={handleTabChange} />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        noticeMessage={authModalConfig.message}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false, message: null }))}
        onLoginSuccess={handleLoginSuccess}
      />
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />
      <CheckoutModal />
      <OrderSuccessModal onContinueShopping={() => handleTabChange('catalog')} />
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
