const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protectAdmin } = require('../middleware/auth');

// Multer — memory storage (file buffer ko seedha Cloudinary pe bhejo)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sirf image files allowed hain (jpg, png, webp, gif)'), false);
    }
  },
});

// POST /api/upload/image  → Cloudinary pe upload karo
// Protected: sirf logged-in admin hi upload kar sakta hai
router.post('/image', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Koi image file nahi mili.' });
    }

    // Buffer ko base64 string mein convert karo (Cloudinary upload ke liye)
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    // Cloudinary pe upload
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'nexbloom/products',
      resource_type: 'image',
      // Auto quality + format optimization
      quality: 'auto',
      fetch_format: 'auto',
    });

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    return res.status(500).json({ error: `Upload failed: ${err.message}` });
  }
});

module.exports = router;
