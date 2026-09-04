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
  AlertCircle,
  Upload,
  Film,
  Video,
  Image as ImageIcon,
  Percent,
  Check,
  Sparkles,
  Tag,
  Play
} from 'lucide-react';
import BASE_URL from '../utils/api';

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

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('admin@nexbloom.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Dashboard Active Tab & Data States
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'queries'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Media Upload States
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState('image'); // 'image' or 'video'
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Product Form Initial State
  const defaultProductForm = {
    name: '',
    category: 'Tissue Paper',
    price: 129, // Discount ke baad ka amount (Selling Price)
    mrp: 199,   // Discount se pehle ka amount (Original MRP)
    image: '',  // Main / Primary Image URL
    images: [], // Multiple Images Array
    videos: [], // Multiple Videos Array
    pullsCount: '100 Pulls / Box',
    tagline: '100% Virgin wood pulp, ultra absorbent & soft',
    description: 'Crafted with premium virgin pulp for maximum softness, strength, and hygiene. Safe for everyday personal care and dining.',
    ply: '2-Ply',
    material: '100% Virgin Pulp',
    stock: 50,
    specs: ['100% Virgin Wood Pulp', 'Ultra Soft & Absorbent', 'Food Contact Safe Certified', 'Lint-Free & Hypoallergenic'],
    variants: [
      { size: 'Pack of 2 (200 Sheets)', mrp: 249, price: 129, pulls: '100 Pulls / Box', stock: 30, unitWeight: '100 Sheets / Pack' },
      { size: 'Pack of 4 (400 Sheets)', mrp: 499, price: 239, pulls: '100 Pulls / Box', stock: 20, unitWeight: '100 Sheets / Pack' },
    ],
  };

  const [productForm, setProductForm] = useState(defaultProductForm);
  const [specInput, setSpecInput] = useState('');

  // Handle Multi-Image & Video Local File Upload to Cloudinary
  const handleFileUpload = async (e, type = 'image') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingMedia(true);
    setUploadProgressText(`Uploading ${files.length} ${type}(s) to Cloudinary...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append(type === 'video' ? 'video' : 'image', file);

      try {
        setUploadProgressText(`Uploading ${i + 1}/${files.length}: ${file.name}...`);
        const endpoint = type === 'video' ? `${BASE_URL}/api/upload/video` : `${BASE_URL}/api/upload/image`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.url) {
          if (type === 'video') {
            setProductForm((prev) => ({
              ...prev,
              videos: [...(prev.videos || []), data.url],
            }));
          } else {
            setProductForm((prev) => {
              const newImages = [...(prev.images || []), data.url];
              return {
                ...prev,
                image: prev.image || data.url, // Set first image as main if empty
                images: newImages,
              };
            });
          }
        } else {
          alert(`Upload error for ${file.name}: ` + (data.error || 'Upload failed'));
        }
      } catch (err) {
        alert(`Error uploading ${file.name}: ` + err.message);
      }
    }

    setUploadingMedia(false);
    setUploadProgressText('');
    // Reset file input value
    if (e.target) e.target.value = '';
  };

  // Add Direct Media URL
  const handleAddMediaUrl = () => {
    if (!mediaUrlInput.trim()) return;
    const url = mediaUrlInput.trim();

    if (mediaTypeInput === 'video') {
      setProductForm((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), url],
      }));
    } else {
      setProductForm((prev) => {
        const newImages = [...(prev.images || []), url];
        return {
          ...prev,
          image: prev.image || url,
          images: newImages,
        };
      });
    }

    setMediaUrlInput('');
  };

  // Remove Image from array
  const handleRemoveImage = (indexToRemove) => {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated.length > 0 ? (prev.image === prev.images[indexToRemove] ? updated[0] : prev.image) : '',
      };
    });
  };

  // Remove Video from array
  const handleRemoveVideo = (indexToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Set as Primary Image
  const handleSetPrimaryImage = (imgUrl) => {
    setProductForm((prev) => ({
      ...prev,
      image: imgUrl,
    }));
  };

  // Add Specification / Highlight
  const handleAddSpec = () => {
    if (!specInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), specInput.trim()],
    }));
    setSpecInput('');
  };

  // Remove Specification
  const handleRemoveSpec = (indexToRemove) => {
    setProductForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Handle Admin Login via JWT API
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
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

  // Dashboard Stats & Real MongoDB Orders & Queries
  const [dashboardStats, setDashboardStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);

  // Fetch real data from backend
  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    const authHeaders = { Authorization: `Bearer ${token}` };

    try {
      // 1. Dashboard metrics
      const dashRes = await fetch(`${BASE_URL}/api/admin/dashboard`, { headers: authHeaders });
      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboardStats(dashData.stats);
      }

      // 2. Orders list
      const orderRes = await fetch(`${BASE_URL}/api/admin/orders`, { headers: authHeaders });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }

      // 3. Customer Queries
      const queryRes = await fetch(`${BASE_URL}/api/admin/queries`, { headers: authHeaders });
      if (queryRes.ok) {
        const queryData = await queryRes.json();
        setQueries(queryData);
      }

      // 4. Products List
      const prodRes = await fetch(`${BASE_URL}/api/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) {
          setProducts(prodData);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Handle Quick Stock Update (+/-)
  const handleStockDelta = async (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
      )
    );

    if (token) {
      try {
        await fetch(`${BASE_URL}/api/admin/products/${productId}/stock`, {
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

  // Handle Order Status Change
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    if (token) {
      try {
        await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
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

  // Handle Query Status Change
  const handleQueryStatusChange = async (queryId, newStatus) => {
    setQueries((prev) =>
      prev.map((q) => (q._id === queryId ? { ...q, status: newStatus } : q))
    );

    if (token) {
      try {
        await fetch(`${BASE_URL}/api/admin/queries/${queryId}/status`, {
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

    // Ensure main image is set
    const finalImage = productForm.image || (productForm.images && productForm.images[0]) || '';
    const payload = {
      ...productForm,
      image: finalImage,
      price: Number(productForm.price),
      mrp: Number(productForm.mrp || 0),
      stock: Number(productForm.stock || 0),
    };

    if (editingProduct) {
      const updatedList = products.map((p) =>
        p._id === editingProduct._id ? { ...p, ...payload } : p
      );
      setProducts(updatedList);
      if (token) {
        try {
          const res = await fetch(`${BASE_URL}/api/admin/products/${editingProduct._id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            fetchAdminData();
          }
        } catch (e) {}
      }
    } else {
      const tempId = `prod_${Date.now()}`;
      setProducts([{ ...payload, _id: tempId }, ...products]);
      if (token) {
        try {
          const res = await fetch(`${BASE_URL}/api/admin/products`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            fetchAdminData();
          }
        } catch (e) {}
      }
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
    setProductForm(defaultProductForm);
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product from store?')) {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      if (token) {
        try {
          await fetch(`${BASE_URL}/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {}
      }
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm(defaultProductForm);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp || product.originalPrice || 0,
      image: product.image,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      videos: Array.isArray(product.videos) ? product.videos : [],
      pullsCount: product.pullsCount || '',
      tagline: product.tagline || '',
      description: product.description || '',
      ply: product.ply || '2-Ply',
      material: product.material || '100% Virgin Pulp',
      stock: product.stock !== undefined ? product.stock : 50,
      specs: product.specs || ['100% Virgin Pulp', 'Ultra Soft'],
      variants: product.variants && product.variants.length > 0 ? product.variants : [
        { size: 'Pack of 2', mrp: product.mrp || 0, price: product.price, stock: 20, pulls: product.pullsCount || '' },
        { size: 'Pack of 4', mrp: product.mrp ? Math.round(product.mrp * 1.9) : 0, price: Math.round(product.price * 1.9), stock: 20, pulls: product.pullsCount || '' },
      ],
    });
    setIsAddModalOpen(true);
  };

  // Variant change helper
  const updateVariant = (index, field, value) => {
    const updated = [...productForm.variants];
    updated[index][field] = field === 'price' || field === 'mrp' || field === 'stock' ? Number(value) : value;
    setProductForm({ ...productForm, variants: updated });
  };

  // Add Variant Row
  const addVariantRow = () => {
    setProductForm({
      ...productForm,
      variants: [
        ...productForm.variants,
        { 
          size: `Pack of ${(productForm.variants.length + 1) * 2} (${(productForm.variants.length + 1) * 200} Pulls)`, 
          mrp: Math.round(productForm.mrp * (productForm.variants.length + 1) * 0.9) || 0,
          price: Math.round(productForm.price * (productForm.variants.length + 1) * 0.9), 
          pulls: productForm.pullsCount || '',
          stock: 20, 
          unitWeight: '100 Pulls / Box' 
        },
      ],
    });
  };

  // Remove Variant Row
  const removeVariantRow = (index) => {
    setProductForm({
      ...productForm,
      variants: productForm.variants.filter((_, i) => i !== index),
    });
  };

  // Calculate live discount percentage for badge preview
  const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || mrp <= price) return null;
    const saving = mrp - price;
    const percent = Math.round((saving / mrp) * 100);
    return { percent, saving };
  };

  const currentDiscount = calculateDiscount(productForm.mrp, productForm.price);

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate Real-Time Dynamic Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'paid' ? o.totalAmount : 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 20).length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  // ==========================================
  // VIEW: 1. ADMIN LOGIN SCREEN (If not authenticated)
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

        <div className="relative w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-white">
          
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>

          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              NexBloom Store Admin
            </h1>
            <p className="text-xs text-slate-400">
              Secure administrator access for inventory &amp; order management
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900/80 text-xs text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="admin@nexbloom.com"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900/80 text-xs text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: 2. LOGGED-IN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#1b4d3e] tracking-tight">NexBloom</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{adminUser?.name || 'Store Administrator'}</p>
              <p className="text-[10px] text-slate-400">{adminUser?.email || 'admin@nexbloom.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Products &amp; Inventory ({products.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Live Orders ({orders.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('queries')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'queries'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries ({queries.length})</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-[#1b4d3e] hover:bg-[#143c30] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Sales</p>
                  <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Real-time Razorpay orders</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Processed orders</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Stock</p>
                  <p className="text-2xl font-black text-slate-900">{totalStockUnits} <span className="text-xs font-normal text-slate-400">units</span></p>
                  <p className="text-[10px] text-amber-700 font-semibold mt-0.5">{lowStockCount} items in low stock</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Inquiries</p>
                  <p className="text-2xl font-black text-slate-900">{queries.length}</p>
                  <p className="text-[10px] text-purple-700 font-semibold mt-0.5">B2B &amp; Support queries</p>
                </div>
              </div>
            </div>

            {/* Quick Low Stock Alert Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inventory Status &amp; Quick Adjustments</h3>
                  <p className="text-xs text-slate-500">Monitor stock levels and restock items with one click</p>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-bold text-[#1b4d3e] hover:underline cursor-pointer"
                >
                  Manage All Products →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">MRP / Price</th>
                      <th className="py-3 px-4">Pulls / Sheets</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => {
                      const discount = calculateDiscount(p.mrp, p.price);
                      return (
                        <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={p.image || (p.images && p.images[0]) || '/redefine-tissue-box.webp'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-[10px] text-slate-400">{p.ply || '2-Ply'} • {p.material}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{p.category}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              {p.mrp > p.price && (
                                <span className="text-[10px] text-slate-400 line-through">₹{p.mrp}</span>
                              )}
                              <span className="font-bold text-emerald-800">₹{p.price}</span>
                              {discount && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                  {discount.percent}% OFF
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {p.pullsCount || 'Standard'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                p.stock <= 10
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.stock <= 25
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                              <button
                                onClick={() => handleStockDelta(p._id, -5)}
                                className="p-1 hover:bg-white rounded text-slate-600 hover:text-rose-600 cursor-pointer"
                                title="Reduce 5 units"
                              >
                                <MinusCircle className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[11px] font-bold px-1.5 text-slate-700">{p.stock}</span>
                              <button
                                onClick={() => handleStockDelta(p._id, 10)}
                                className="p-1 hover:bg-white rounded text-slate-600 hover:text-emerald-700 cursor-pointer"
                                title="Add 10 units"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS & INVENTORY MANAGER ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500">Filter:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Tissue Paper">Tissue Paper</option>
                  <option value="Kitchen Roll">Kitchen Roll</option>
                  <option value="Toilet Roll">Toilet Roll</option>
                  <option value="Face Tissue">Face Tissue</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const discount = calculateDiscount(product.mrp, product.price);
                const mediaCount = (product.images?.length || (product.image ? 1 : 0)) + (product.videos?.length || 0);

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100 group">
                        <img
                          src={product.image || (product.images && product.images[0]) || '/redefine-tissue-box.webp'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Category badge */}
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                          {product.category}
                        </span>

                        {/* Discount Badge */}
                        {discount && (
                          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                            {discount.percent}% OFF
                          </span>
                        )}

                        {/* Media count indicator */}
                        {mediaCount > 1 && (
                          <span className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>{product.images?.length || 1} img</span>
                            {product.videos?.length > 0 && <span>• {product.videos.length} vid</span>}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {product.name}
                        </h4>

                        {/* Pulls / Sheets & Ply */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          {product.pullsCount && (
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200/60">
                              {product.pullsCount}
                            </span>
                          )}
                          <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                            {product.ply || '2-Ply'}
                          </span>
                          <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                            {product.material || 'Virgin Pulp'}
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 pt-1">
                          {product.mrp > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                          <span className="text-lg font-black text-[#1b4d3e]">
                            ₹{product.price}
                          </span>
                          {discount && (
                            <span className="text-[10px] font-bold text-emerald-700">
                              (Save ₹{discount.saving})
                            </span>
                          )}
                        </div>

                        {/* Variants Preview */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 space-y-1">
                            <p className="font-bold text-slate-700">Pack Variants ({product.variants.length}):</p>
                            <div className="flex flex-wrap gap-1">
                              {product.variants.map((v, i) => (
                                <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                  {v.size}: ₹{v.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">
                        Stock: <span className="text-slate-900">{product.stock}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: LIVE ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Customer Orders (Razorpay Live)</h3>
              <p className="text-xs text-slate-500">Track paid orders, customer shipping addresses, and delivery status</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Order ID / Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Address / Phone</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                        No customer orders received yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <p className="font-bold text-slate-800">{o.razorpayOrderId || o._id.slice(-8)}</p>
                          <p className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          <p className="font-bold text-slate-900">{o.customer?.name}</p>
                          <p className="text-[10px] text-slate-400">{o.customer?.email}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          <p>{o.customer?.address}, {o.customer?.city}</p>
                          <p className="text-slate-400 font-mono text-[10px]">{o.customer?.phone} • {o.customer?.pincode}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-700">{o.items?.length || 1} items</span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-800 text-sm">
                          ₹{o.totalAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="created">Created</option>
                            <option value="paid">Paid (Confirmed)</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CUSTOMER INQUIRIES ================= */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Inquiries &amp; Bulk Order Requests</h3>
              <p className="text-xs text-slate-500">Manage contact form queries and hotel/restaurant supply quotes</p>
            </div>

            <div className="divide-y divide-slate-100">
              {queries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-medium text-xs">
                  No inquiries received yet.
                </div>
              ) : (
                queries.map((q) => (
                  <div key={q._id} className="p-5 space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{q.name}</span>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {q.inquiryType}
                        </span>
                      </div>

                      <select
                        value={q.status}
                        onChange={(e) => handleQueryStatusChange(q._id, e.target.value)}
                        className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {q.message}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                      <span>Email: <a href={`mailto:${q.email}`} className="text-emerald-700 hover:underline">{q.email}</a></span>
                      <span>Phone: <a href={`tel:${q.phone}`} className="text-emerald-700 hover:underline">{q.phone}</a></span>
                      <span>{new Date(q.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 🚀 COMPREHENSIVE ADD / EDIT PRODUCT MODAL (MULTIPLE IMAGES & VIDEOS & MRP) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl my-8 animate-scale-in border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProduct ? 'Edit Product Details' : 'Add New Tissue / Roll Product'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set multiple images, demo video, MRP discount, pulls count &amp; pack quantities
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1. Basic Product Info</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NexBloom SilkTouch Facial Tissue Box"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-slate-50 text-xs font-bold text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Tissue Paper">Tissue Paper</option>
                      <option value="Kitchen Roll">Kitchen Roll</option>
                      <option value="Toilet Roll">Toilet Roll</option>
                      <option value="Face Tissue">Face Tissue</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ply Cushion</label>
                    <select
                      value={productForm.ply}
                      onChange={(e) => setProductForm({ ...productForm, ply: e.target.value })}
                      className="w-full bg-slate-50 text-xs font-bold text-slate-700 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="1-Ply">1-Ply</option>
                      <option value="2-Ply">2-Ply (Standard)</option>
                      <option value="3-Ply">3-Ply (Ultra Luxury)</option>
                      <option value="4-Ply">4-Ply (Heavy Duty)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Material Fiber</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Virgin Pulp / Bamboo"
                      value={productForm.material}
                      onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                      className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pulls / Sheets Count</label>
                    <input
                      type="text"
                      placeholder="e.g. 100 Pulls / Box"
                      value={productForm.pullsCount}
                      onChange={(e) => setProductForm({ ...productForm, pullsCount: e.target.value })}
                      className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Short Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% natural virgin wood pulp, ultra absorbent & soft"
                    value={productForm.tagline}
                    onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe softness, absorbency, food contact safety, and packaging details..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* SECTION 2: PRICING & DISCOUNT (BEFORE/AFTER DISCOUNT) */}
              <div className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-emerald-700" />
                    <span>2. Pricing &amp; Discount (MRP vs Selling Price)</span>
                  </h4>

                  {currentDiscount && (
                    <span className="text-[11px] font-black bg-emerald-700 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      {currentDiscount.percent}% OFF • Save ₹{currentDiscount.saving}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* MRP (Original Price Before Discount) */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Original Price / MRP (₹) <span className="text-[10px] text-slate-400 font-normal">(Discount se pehle)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 249"
                      value={productForm.mrp}
                      onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>

                  {/* Selling Price (Discounted Price) */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Selling Price (₹) * <span className="text-[10px] text-emerald-700 font-normal">(Discount ke baad)</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 129"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-emerald-300 focus:outline-none focus:border-emerald-600 font-black text-emerald-900"
                    />
                  </div>

                  {/* Stock Units */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Total Stock Units *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MULTIPLE IMAGES & VIDEOS UPLOADER & GALLERY */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>3. Product Images &amp; Videos (Multiple)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {(productForm.images?.length || 0)} Images • {(productForm.videos?.length || 0)} Videos
                  </span>
                </div>

                {/* Upload Buttons Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Hidden inputs */}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'video')}
                  />

                  {/* Upload Images Button */}
                  <button
                    type="button"
                    disabled={uploadingMedia}
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>+ Upload Images from Local (Multiple)</span>
                  </button>

                  {/* Upload Videos Button */}
                  <button
                    type="button"
                    disabled={uploadingMedia}
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Video className="w-4 h-4 text-blue-700" />
                    <span>+ Upload Demo Videos (MP4/WebM)</span>
                  </button>
                </div>

                {/* Direct URL Input Row */}
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <select
                    value={mediaTypeInput}
                    onChange={(e) => setMediaTypeInput(e.target.value)}
                    className="bg-white text-[11px] font-bold text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200"
                  >
                    <option value="image">Image URL</option>
                    <option value="video">Video URL</option>
                  </select>
                  <input
                    type="url"
                    placeholder="Or paste Cloudinary / Web URL here..."
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    className="flex-1 bg-white text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMediaUrl}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Upload Status Alert */}
                {uploadingMedia && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-bold animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-700 shrink-0" />
                    <span>{uploadProgressText || 'Uploading to Cloudinary...'}</span>
                  </div>
                )}

                {/* ================= MEDIA PREVIEWS GALLERY ================= */}
                {((productForm.images && productForm.images.length > 0) || (productForm.videos && productForm.videos.length > 0)) && (
                  <div className="space-y-3 pt-2">
                    
                    {/* Images Gallery */}
                    {productForm.images && productForm.images.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-600 mb-2">Uploaded Images ({productForm.images.length}):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {productForm.images.map((imgUrl, idx) => {
                            const isMain = productForm.image === imgUrl || (!productForm.image && idx === 0);
                            return (
                              <div
                                key={idx}
                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-slate-100 group ${
                                  isMain ? 'border-emerald-500 shadow-sm' : 'border-slate-200'
                                }`}
                              >
                                <img src={imgUrl} alt={`Product media ${idx}`} className="w-full h-full object-cover" />

                                {/* Main Image Badge */}
                                {isMain && (
                                  <span className="absolute top-1.5 left-1.5 bg-emerald-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                                    ★ MAIN
                                  </span>
                                )}

                                {/* Set as Main Button */}
                                {!isMain && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(imgUrl)}
                                    className="absolute bottom-1.5 left-1.5 bg-white/90 hover:bg-white text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                                  >
                                    Set Main
                                  </button>
                                )}

                                {/* ✕ CUT / REMOVE BUTTON */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center font-bold text-xs shadow-md transition-transform hover:scale-110 cursor-pointer"
                                  title="Cut / Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Videos Gallery */}
                    {productForm.videos && productForm.videos.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-600 mb-2">Uploaded Videos ({productForm.videos.length}):</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {productForm.videos.map((vidUrl, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                              <video
                                src={vidUrl}
                                controls
                                className="w-full aspect-video object-contain"
                              />
                              <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs pointer-events-none">
                                <Film className="w-3 h-3" />
                                <span>VIDEO {idx + 1}</span>
                              </span>

                              {/* ✕ CUT / REMOVE VIDEO BUTTON */}
                              <button
                                type="button"
                                onClick={() => handleRemoveVideo(idx)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center font-bold text-xs shadow-md cursor-pointer z-10"
                                title="Cut / Remove video"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* SECTION 4: PRODUCT HIGHLIGHTS & SPECS */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>4. Key Product Highlights / Bullet Points</span>
                </h4>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Hypoallergenic & Dermatologically Safe"
                    value={specInput}
                    onChange={(e) => setSpecInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpec(); } }}
                    className="flex-1 bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 cursor-pointer"
                  >
                    + Add Point
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {productForm.specs?.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      <span>✓ {s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="text-slate-400 hover:text-rose-600 font-bold"
                        title="Remove highlight"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 5: PACK QUANTITY VARIANTS TABLE */}
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      <span>5. Pack Quantity Variants &amp; Pricing</span>
                    </h4>
                    <p className="text-[10px] text-slate-500">Add combo packs (Pack of 2, 4, 6, 8, 12) with custom MRP and discount price</p>
                  </div>

                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Pack Variant</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {productForm.variants.map((v, idx) => {
                    const varDiscount = calculateDiscount(v.mrp, v.price);
                    return (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Pack Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Pack of 4 (400 Sheets)"
                              value={v.size}
                              onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                              className="w-full bg-slate-50 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-0.5">MRP (₹)</label>
                            <input
                              type="number"
                              placeholder="MRP"
                              value={v.mrp || ''}
                              onChange={(e) => updateVariant(idx, 'mrp', e.target.value)}
                              className="w-full bg-slate-50 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-emerald-700 block mb-0.5">Price (₹) *</label>
                            <input
                              type="number"
                              required
                              placeholder="Selling Price"
                              value={v.price}
                              onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                              className="w-full bg-emerald-50 text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 font-black text-emerald-900"
                            />
                          </div>

                          <div className="flex items-end justify-between gap-1">
                            <div className="flex-1">
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Stock</label>
                              <input
                                type="number"
                                placeholder="Stock"
                                value={v.stock}
                                onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                                className="w-full bg-slate-50 text-xs px-2 py-1.5 rounded-lg border border-slate-200"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeVariantRow(idx)}
                              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="Delete this variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Variant details & discount badge */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Pulls count / Unit details (e.g. 100 Pulls / Box)"
                              value={v.pulls || v.unitWeight || ''}
                              onChange={(e) => updateVariant(idx, 'pulls', e.target.value)}
                              className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px] w-48"
                            />
                          </div>

                          {varDiscount && (
                            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              {varDiscount.percent}% OFF (Save ₹{varDiscount.saving})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4d3e] hover:bg-[#143c30] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product' : 'Save & Publish to Store'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
