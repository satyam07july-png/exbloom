const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const Product = require("../models/product");
const Order = require("../models/order");
const Query = require("../models/query");
const { protectAdmin, JWT_SECRET } = require("../middleware/auth");

// Helper to auto-seed default admin if database has no admin yet
const ensureDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        name: "Nexbloom Store Admin",
        email: "admin@nexbloom.com",
        password: "admin123", // Will be automatically hashed by Admin model pre-save hook
        role: "superadmin",
      });
      await defaultAdmin.save();
      console.log("✅ Default admin created in MongoDB: admin@nexbloom.com / admin123");
    }
  } catch (e) {
    console.warn("ensureDefaultAdmin notice:", e.message);
  }
};

ensureDefaultAdmin();

// ================= AUTH: ADMIN LOGIN =================
// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    await ensureDefaultAdmin();

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare bcrypt password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// GET /api/admin/verify -> Check if token is valid
router.get("/verify", protectAdmin, async (req, res) => {
  res.json({ success: true, admin: req.admin });
});


// ================= PROTECTED ADMIN ENDPOINTS =================

// 1. DASHBOARD OVERVIEW & ANALYTICS
router.get("/dashboard", protectAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ status: { $ne: "failed" } });
    
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const lowStockProducts = await Product.find({ stock: { $lte: 20 } });
    const pendingQueries = await Query.countDocuments({ status: "new" });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        pendingQueries,
      },
      lowStockProducts,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load dashboard metrics" });
  }
});

// 2. PRODUCTS & INVENTORY CRUD
router.get("/products", protectAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/products", protectAdmin, async (req, res) => {
  try {
    const { 
      name, 
      category, 
      price, 
      mrp, 
      image, 
      images, 
      videos, 
      pullsCount, 
      tagline, 
      description, 
      specs, 
      ply, 
      material, 
      stock, 
      variants 
    } = req.body;

    if (!name || !category || price === undefined || price === null || price === '') {
      return res.status(400).json({ error: "Name, category, and price are required" });
    }

    // Process images array
    let imageList = [];
    if (Array.isArray(images) && images.length > 0) {
      imageList = images.map((img) => (typeof img === 'string' ? img.trim() : img)).filter(Boolean);
    } else if (typeof images === 'string' && images.trim()) {
      try {
        const parsed = JSON.parse(images);
        imageList = Array.isArray(parsed) ? parsed : [images.trim()];
      } catch (e) {
        imageList = images.split(',').map((s) => s.trim()).filter(Boolean);
      }
    } else if (image) {
      imageList = [image.trim()];
    }

    if (image && typeof image === 'string' && image.trim() && !imageList.includes(image.trim())) {
      imageList.unshift(image.trim());
    }

    if (imageList.length === 0) {
      imageList = ["https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80"];
    }
    
    // Process videos array
    let videoList = [];
    if (Array.isArray(videos)) {
      videoList = videos.map((v) => (typeof v === 'string' ? v.trim() : v)).filter(Boolean);
    } else if (typeof videos === 'string' && videos.trim()) {
      try {
        const parsed = JSON.parse(videos);
        videoList = Array.isArray(parsed) ? parsed : [videos.trim()];
      } catch (e) {
        videoList = videos.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const newProduct = new Product({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      mrp: mrp ? Number(mrp) : 0,
      image: imageList[0] || (image ? image.trim() : "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80"),
      images: imageList,
      videos: videoList,
      pullsCount: pullsCount || "",
      tagline: tagline || "",
      description: description || "",
      specs: Array.isArray(specs) ? specs : (specs ? specs.split(",").map(s => s.trim()) : []),
      ply: ply || "2-Ply",
      material: material || "100% Virgin Pulp",
      stock: Number(stock) || 50,
      variants: variants && variants.length > 0 ? variants.map(v => ({
        size: v.size || "Standard Pack",
        price: Number(v.price) || Number(price),
        mrp: v.mrp ? Number(v.mrp) : 0,
        stock: v.stock !== undefined ? Number(v.stock) : 20,
        unitWeight: v.unitWeight || "",
        pulls: v.pulls || "",
      })) : [
        { size: "Pack of 2", price: Number(price), mrp: mrp ? Number(mrp) : 0, stock: Number(stock) || 50, pulls: pullsCount || "" },
        { size: "Pack of 4", price: Math.round(Number(price) * 1.9), mrp: mrp ? Math.round(Number(mrp) * 1.9) : 0, stock: 30, pulls: pullsCount || "" },
      ],
    });

    const saved = await newProduct.save();
    res.json({ success: true, product: saved });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: `Failed to create product: ${err.message}` });
  }
});

router.put("/products/:id", protectAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.mrp !== undefined) updateData.mrp = Number(updateData.mrp);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    // Process images array for update
    let imageList = [];
    if (Array.isArray(updateData.images) && updateData.images.length > 0) {
      imageList = updateData.images.map((img) => (typeof img === 'string' ? img.trim() : img)).filter(Boolean);
    } else if (typeof updateData.images === 'string' && updateData.images.trim()) {
      try {
        const parsed = JSON.parse(updateData.images);
        imageList = Array.isArray(parsed) ? parsed : [updateData.images.trim()];
      } catch (e) {
        imageList = updateData.images.split(',').map((s) => s.trim()).filter(Boolean);
      }
    } else if (updateData.image) {
      imageList = [updateData.image.trim()];
    }

    if (updateData.image && typeof updateData.image === 'string' && updateData.image.trim() && !imageList.includes(updateData.image.trim())) {
      imageList.unshift(updateData.image.trim());
    }

    if (imageList.length > 0) {
      updateData.images = imageList;
      if (!updateData.image) {
        updateData.image = imageList[0];
      }
    }

    // Process videos array for update
    if (updateData.videos !== undefined) {
      let videoList = [];
      if (Array.isArray(updateData.videos)) {
        videoList = updateData.videos.map((v) => (typeof v === 'string' ? v.trim() : v)).filter(Boolean);
      } else if (typeof updateData.videos === 'string' && updateData.videos.trim()) {
        try {
          const parsed = JSON.parse(updateData.videos);
          videoList = Array.isArray(parsed) ? parsed : [updateData.videos.trim()];
        } catch (e) {
          videoList = updateData.videos.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      updateData.videos = videoList;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: `Failed to update product: ${err.message}` });
  }
});

router.put("/products/:id/stock", protectAdmin, async (req, res) => {
  try {
    const { delta } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.stock = Math.max(0, product.stock + Number(delta));
    await product.save();
    res.json({ success: true, stock: product.stock, product });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stock" });
  }
});

router.delete("/products/:id", protectAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// 3. ORDERS MANAGEMENT
router.get("/orders", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/orders/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// 4. CUSTOMER QUERIES
router.get("/queries", protectAdmin, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

router.put("/queries/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const query = await Query.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!query) return res.status(404).json({ error: "Query not found" });
    res.json({ success: true, query });
  } catch (err) {
    res.status(500).json({ error: "Failed to update query status" });
  }
});

// PUBLIC ENDPOINT FOR CONTACT US PAGE SUBMISSION
router.post("/public/queries", async (req, res) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const newQuery = new Query({
      name,
      email,
      phone: phone || "",
      inquiryType: inquiryType || "Household / Personal Order",
      message,
    });

    await newQuery.save();
    res.json({ success: true, message: "Query received", query: newQuery });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit query" });
  }
});

module.exports = router;
