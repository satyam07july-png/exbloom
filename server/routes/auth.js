const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const User = require("../models/user");
const { JWT_SECRET } = require("../middleware/auth");

// Helper to ensure default admin exists
const ensureDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        name: "Nexbloom Store Admin",
        email: "admin@nexbloom.com",
        password: "admin123",
        role: "superadmin",
      });
      await defaultAdmin.save();
    }
  } catch (e) {}
};

ensureDefaultAdmin();

// UNIFIED LOGIN: Admin & Customer in one endpoint
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter your email and password" });
    }

    await ensureDefaultAdmin();

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if the user is an Admin
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (admin) {
      const isMatch = await admin.matchPassword(password);
      if (isMatch) {
        const token = jwt.sign(
          {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            role: "admin",
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.json({
          success: true,
          role: "admin",
          token,
          user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: "admin",
          },
          message: "Welcome back, Store Administrator!",
        });
      } else {
        return res.status(401).json({ error: "Invalid password for Admin account" });
      }
    }

    // 2. Check if the user is a Customer
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
            role: "customer",
          },
          JWT_SECRET,
          { expiresIn: "30d" }
        );

        return res.json({
          success: true,
          role: "customer",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: "customer",
          },
          message: `Welcome back, ${user.name}!`,
        });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    return res.status(404).json({ error: "No account found with this email. Please sign up." });
  } catch (err) {
    console.error("Auth login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// CUSTOMER REGISTRATION
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email belongs to admin
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({ error: "This email is reserved for administration" });
    }

    // Check if customer already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists. Please log in." });
    }

    const newUser = new User({
      name,
      email: normalizedEmail,
      password,
      phone: phone || "",
      role: "customer",
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: "customer",
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      role: "customer",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: "customer",
      },
      message: `Account created successfully! Welcome, ${newUser.name}!`,
    });
  } catch (err) {
    console.error("Auth register error:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
});

module.exports = router;
