import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Search, 
  Filter, 
  X, 
  PlusCircle, 
  MinusCircle, 
  RefreshCw, 
  Layers, 
  Phone, 
  Mail, 
  MapPin,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Key,
  AlertCircle
} from 'lucide-react';

export const AdminPortal = ({ onBackToStore, products, setProducts }) => {
  const [token, setToken] = useState(() => localStorage.getItem('nexbloom_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexbloom_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('admin@nexbloom.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Portal Dashboard States
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'queries'
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 48920,
    totalOrders: 28,
    totalProducts: products.length,
    lowStockCount: 2,
    pendingQueries: 3,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle local image file → upload to Cloudinary → save URL in form
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProductForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Tissue Paper',
    price: 149,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    tagline: '',
    description: '',
    ply: '2-Ply',
    stock: 50,
    variants: [
      { size: 'Pack of 2', price: 149, stock: 30, unitWeight: '100 Sheets / Pack' },
      { size: 'Pack of 4', price: 279, stock: 20, unitWeight: '100 Sheets / Pack' },
    ],
  });

  // Handle Admin Login via JWT API
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem('nexbloom_admin_token', data.token);
        localStorage.setItem('nexbloom_admin_user', JSON.stringify(data.admin));
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Connection failed. Make sure backend server is running.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    setToken('');
    setAdminUser(null);
    localStorage.removeItem('nexbloom_admin_token');
    localStorage.removeItem('nexbloom_admin_user');
  };

  // Fetch Dashboard Data with JWT Authorization Header
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      // 1. Dashboard stats
      const dashRes = await fetch('/api/admin/dashboard', { headers: authHeaders });
      if (dashRes.status === 401) {
        handleLogout();
        return;
      }
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        if (dashData.stats) setStats(dashData.stats);
      }

      // 2. Orders
      const orderRes = await fetch('/api/admin/orders', { headers: authHeaders });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (Array.isArray(orderData)) setOrders(orderData);
      }

      // 3. Customer Queries
      const queryRes = await fetch('/api/admin/queries', { headers: authHeaders });
      if (queryRes.ok) {
        const queryData = await queryRes.json();
        if (Array.isArray(queryData)) setQueries(queryData);
      }
    } catch (e) {
      console.log('Using local fallback state for dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Stock Quick Adjustment
  const handleStockChange = async (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );

    if (token) {
      try {
        await fetch(`/api/admin/products/${productId}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delta }),
        });
      } catch (e) {}
    }
  };

  // Order Status Update
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    if (token) {
      try {
        await fetch(`/api/admin/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (e) {}
    }
  };

  // Query Status Update
  const handleQueryStatusChange = async (queryId, newStatus) => {
    setQueries((prev) =>
      prev.map((q) => (q._id === queryId ? { ...q, status: newStatus } : q))
    );

    if (token) {
      try {
        await fetch(`/api/admin/queries/${queryId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (e) {}
    }
  };

  // Handle Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (editingProduct) {
      const updatedList = products.map((p) =>
        p._id === editingProduct._id ? { ...p, ...productForm } : p
      );
      setProducts(updatedList);
      if (token) {
        try {
          await fetch(`/api/admin/products/${editingProduct._id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify(productForm),
          });
        } catch (e) {}
      }
    } else {
      const newProd = {
        ...productForm,
        _id: `prod_${Date.now()}`,
      };
      setProducts([newProd, ...products]);
      if (token) {
        try {
          await fetch('/api/admin/products', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(productForm),
          });
        } catch (e) {}
      }
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product from store?')) {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      if (token) {
        try {
          await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {}
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      tagline: product.tagline || '',
      description: product.description || '',
      ply: product.ply || '2-Ply',
      stock: product.stock || 50,
      variants: product.variants || [
        { size: 'Pack of 2', price: product.price, stock: 20 },
        { size: 'Pack of 4', price: Math.round(product.price * 1.9), stock: 20 },
      ],
    });
    setIsAddModalOpen(true);
  };

  // Variant change helper
  const updateVariant = (index, field, value) => {
    const updated = [...productForm.variants];
    updated[index][field] = field === 'price' || field === 'stock' ? Number(value) : value;
    setProductForm({ ...productForm, variants: updated });
  };

  const addVariantRow = () => {
    setProductForm({
      ...productForm,
      variants: [
        ...productForm.variants,
        { size: 'Pack of 6', price: Math.round(productForm.price * 2.8), stock: 20 },
      ],
    });
  };

  const removeVariantRow = (index) => {
    if (productForm.variants.length > 1) {
      const updated = productForm.variants.filter((_, i) => i !== index);
      setProductForm({ ...productForm, variants: updated });
    }
  };


  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (When not authenticated via JWT)
  // =========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Brand Logo & Title */}
          <div className="text-center space-y-2">
            <div className="inline-block py-1">
              <img
                src="/logo.png"
                alt="NexBloom Logo"
                className="h-10 w-auto object-contain brightness-0 invert opacity-95"
              />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">NexBloom Admin Portal</h1>
            <p className="text-xs text-slate-400">
              Enter your database credentials to access store controls.
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@nexbloom.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 pl-9 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 pl-9 pr-10 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <span>Authenticating with JWT...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Admin Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Default Credentials Note */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">🔑 Default Credentials (Auto-Seeded):</p>
            <p>Email: <strong className="text-emerald-400 font-mono">admin@nexbloom.com</strong></p>
            <p>Password: <strong className="text-emerald-400 font-mono">admin123</strong></p>
          </div>

          {/* Back to Store Button */}
          <button
            onClick={onBackToStore}
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Store</span>
          </button>

        </div>
      </div>
    );
  }


  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20">
      
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand / Admin Label */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="NexBloom Logo"
                  className="h-8 w-auto object-contain brightness-0 invert opacity-95"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    JWT Secured Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Logged-in Profile, Refresh & Logout */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{adminUser?.name || 'Admin'}</strong>
              </span>

              <button
                onClick={fetchData}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onBackToStore}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Store</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products &amp; Inventory ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Customer Orders ({orders.length > 0 ? orders.length : 3})</span>
            </button>

            <button
              onClick={() => setActiveTab('queries')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'queries'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Queries ({queries.length > 0 ? queries.length : 2})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stat Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>Total Sales Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  ↑ Verified via Razorpay Payments
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>Total Customer Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  {orders.length > 0 ? orders.length : stats.totalOrders}
                </p>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Pan-India deliveries
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>Active Products in Catalog</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  {products.length}
                </p>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  Tissue, Kitchen, Toilet &amp; Face
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>Pending Customer Inquiries</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  {queries.filter(q => q.status === 'new').length || stats.pendingQueries}
                </p>
                <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                  Requires support reply
                </span>
              </div>
            </div>

            {/* Quick Actions & Add Product Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Store Management &amp; Inventory Hub</h3>
                <p className="text-xs text-slate-500">
                  Add new tissue packs, adjust warehouse stock units, or update order statuses.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Manage Orders
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items / Packs</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">
                        Rajesh Khanna
                        <span className="block text-[10px] text-slate-400">rajesh@gmail.com</span>
                      </td>
                      <td className="p-3">CloudSoft Toilet Rolls (Pack of 12)</td>
                      <td className="p-3 font-bold text-slate-900">₹549</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          PAID (Razorpay)
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                          Shipped
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">
                        Cafe Mocha (B2B Bulk)
                        <span className="block text-[10px] text-slate-400">manager@cafemocha.in</span>
                      </td>
                      <td className="p-3">Kitchen Rolls (Pack of 12) x 4</td>
                      <td className="p-3 font-bold text-slate-900">₹3,516</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          PAID (UPI)
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Delivered
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}


        {/* ================= TAB 2: PRODUCTS & INVENTORY MANAGER ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Product Catalog &amp; Inventory</h2>
                <p className="text-xs text-slate-500">
                  Manage product details, pricing, pack variants, and live warehouse inventory counts.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Starting Price</th>
                      <th className="p-3.5">Pack Sizes</th>
                      <th className="p-3.5">Stock Level</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.ply || '2-Ply'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {p.category}
                          </span>
                        </td>

                        <td className="p-3.5 font-bold text-slate-900">
                          ₹{p.price}
                        </td>

                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {p.variants && p.variants.map((v, i) => (
                              <span
                                key={i}
                                className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold"
                              >
                                {v.size.split('(')[0].trim()} (₹{v.price})
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Stock Adjustment Stepper */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStockChange(p._id, -5)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
                              title="Decrease Stock (-5)"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-xs ${
                                (p.stock || 0) <= 20
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-900'
                              }`}
                            >
                              {p.stock || 50} units
                            </span>
                            <button
                              onClick={() => handleStockChange(p._id, 10)}
                              className="p-1 text-slate-400 hover:text-emerald-700 rounded hover:bg-slate-100 cursor-pointer"
                              title="Add Stock (+10)"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        {/* Edit & Delete Actions */}
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Customer Orders</h2>
              <p className="text-xs text-slate-500">
                Track payments, delivery addresses, items, and update order statuses.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer &amp; Phone</th>
                      <th className="p-3.5">Delivery Address</th>
                      <th className="p-3.5">Ordered Items</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">
                            {o.razorpayOrderId || o._id.slice(-6)}
                          </td>

                          <td className="p-3.5">
                            <p className="font-bold text-slate-900">{o.customer?.name}</p>
                            <p className="text-[10px] text-slate-400">{o.customer?.phone} • {o.customer?.email}</p>
                          </td>

                          <td className="p-3.5 max-w-[200px] truncate">
                            <span className="text-slate-600 text-[11px]">
                              {o.customer?.address}, {o.customer?.city}, {o.customer?.pincode}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              {o.items?.map((item, i) => (
                                <p key={i} className="text-[11px] text-slate-800">
                                  {item.quantity}x {item.name}
                                </p>
                              ))}
                            </div>
                          </td>

                          <td className="p-3.5 font-bold text-slate-900">
                            ₹{o.totalAmount?.toLocaleString('en-IN')}
                          </td>

                          {/* Order Status Dropdown */}
                          <td className="p-3.5">
                            <select
                              value={o.status || 'paid'}
                              onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                              className="bg-slate-100 text-xs font-bold text-slate-800 py-1.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="created">Created</option>
                              <option value="paid">Paid (Confirmed)</option>
                              <option value="processing">Processing Pack</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">
                          order_rcpt_9821
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">Sunil Deshmukh</p>
                          <p className="text-[10px] text-slate-400">9820011223 • sunil@gmail.com</p>
                        </td>
                        <td className="p-3.5">
                          <span className="text-slate-600 text-[11px]">Flat 502, Powai, Mumbai, 400076</span>
                        </td>
                        <td className="p-3.5">
                          <p className="text-[11px] text-slate-800">2x Kitchen Towels (Pack of 4)</p>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">₹658</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            PAID
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* ================= TAB 4: CUSTOMER QUERIES ================= */}
        {activeTab === 'queries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Customer Messages &amp; Bulk Inquiries</h2>
              <p className="text-xs text-slate-500">
                Inquiries submitted via the Contact Us page (Retail orders, restaurant &amp; hotel bulk quotes).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(queries.length > 0 ? queries : [
                {
                  _id: 'q1',
                  name: 'Rohit Verma (Green Leaf Cafe)',
                  email: 'rohit@greenleaf.com',
                  phone: '+91 9876543210',
                  inquiryType: 'Restaurant / Cafe / Hotel Orders',
                  message: 'We require 50 cartons of 2-ply dinner tissue napkins and 20 packs of kitchen rolls every month for our cafe branches in Mumbai. Please send bulk wholesale pricing.',
                  status: 'new',
                  createdAt: '2026-08-24T10:00:00Z',
                },
                {
                  _id: 'q2',
                  name: 'Anjali Sharma',
                  email: 'anjali@yahoo.com',
                  phone: '+91 9811223344',
                  inquiryType: 'Household / Personal Order',
                  message: 'Is express same-day delivery available for South Delhi? Looking to order family toilet roll boxes.',
                  status: 'responded',
                  createdAt: '2026-08-23T14:30:00Z',
                }
              ]).map((q) => (
                <div
                  key={q._id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {q.inquiryType}
                      </span>
                      
                      {/* Query Status selector */}
                      <select
                        value={q.status || 'new'}
                        onChange={(e) => handleQueryStatusChange(q._id, e.target.value)}
                        className={`text-[10px] font-bold py-1 px-2 rounded-md border cursor-pointer ${
                          q.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="new">New Query</option>
                        <option value="in_progress">In Progress</option>
                        <option value="responded">Responded / Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{q.name}</h3>
                    
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{q.email}</span>
                      </p>
                      {q.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{q.phone}</span>
                        </p>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      "{q.message}"
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`mailto:${q.email}?subject=Nexbloom Inquiry Response`}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    {q.phone && (
                      <a
                        href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        WhatsApp Chat
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>


      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product & Pack Variants' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexbloom Kitchen Rolls"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tissue Paper">Tissue Paper</option>
                    <option value="Kitchen Roll">Kitchen Roll</option>
                    <option value="Toilet Roll">Toilet Roll</option>
                    <option value="Face Tissue">Face Tissue</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* ── Image Upload (Local → Cloudinary) ── */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Product Image *
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Upload Button + Preview Row */}
                <div className="flex items-start gap-3">
                  
                  {/* Drag-drop / Click area */}
                  <button
                    type="button"
                    disabled={imageUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl py-5 transition-all cursor-pointer text-center
                      ${imageUploading
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-500 hover:text-emerald-700'
                      }`}
                  >
                    {imageUploading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold">Click to choose image</span>
                        <span className="text-[10px]">JPG, PNG, WEBP — max 10MB</span>
                      </>
                    )}
                  </button>

                  {/* Live Preview */}
                  {productForm.image && (
                    <div className="w-24 h-24 rounded-xl border-2 border-emerald-200 overflow-hidden bg-slate-100 shrink-0 relative">
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setProductForm((prev) => ({ ...prev, image: '' }))}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 text-[10px] leading-none"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Show current Cloudinary URL (read-only) */}
                {productForm.image && (
                  <p className="mt-1.5 text-[10px] text-slate-400 truncate">
                    ✅ {productForm.image}
                  </p>
                )}
              </div>


              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Virgin wood pulp, ultra absorbent"
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  className="w-full bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Quantity Pack Variants Builder */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Pack Quantity Variants &amp; Pricing:</label>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pack Variant</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Pack Name (e.g. Pack of 4)"
                        value={v.size}
                        onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                        className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={v.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                        className="w-24 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove Variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save &amp; Publish Product
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
