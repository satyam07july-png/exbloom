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
import { 
  getStoredUser, 
  getStoredToken, 
  clearUserSession, 
  subscribeToAuthSync 
} from './utils/authSync';

function MainContent() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
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
    const stored = getStoredUser();
    return stored ? stored.user : null;
  });

  const { toastMessage, showToast, selectedProduct, setSelectedProduct } = useCart();

  // Multi-tab auth sync & token verification
  useEffect(() => {
    const unsubscribe = subscribeToAuthSync({
      onLogin: (user, role) => {
        if (role !== 'admin') {
          setCurrentUser(user);
          showToast(`Logged in as ${user.name}`);
        }
      },
      onLogout: () => {
        // Multi-tab instant auto-logout
        setCurrentUser(null);
        showToast('Session ended. Logged out across all tabs.');
        setActiveTab((prev) => (prev === 'admin' || prev === 'checkout' ? 'home' : prev));
        setAuthModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });

    // Session validation with backend
    const token = getStoredToken();
    if (token) {
      fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 401) {
            clearUserSession(true);
            setCurrentUser(null);
          } else if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          if (data?.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    }

    return unsubscribe;
  }, []);

  // Listen to hash change for direct URL access to #admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    clearUserSession(true);
    showToast('Signed out successfully');
    if (activeTab === 'admin' || activeTab === 'checkout') {
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
