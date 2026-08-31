const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const JWT_SECRET = process.env.JWT_SECRET || "nexbloom_jwt_super_secret_key_2026";

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ error: "Not authorized, invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

module.exports = { protectAdmin, JWT_SECRET };
