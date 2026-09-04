const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protectAdmin } = require('../middleware/auth');

// Multer — memory storage (file buffer ko seedha Cloudinary pe bhejo)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // max 100MB (for high-res images & product demo videos)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Sirf Image aur Video files allowed hain (jpg, png, webp, mp4, mov, webm)'), false);
    }
  },
});

// Helper function to upload buffer to Cloudinary using upload_stream
const uploadToCloudinary = (buffer, mimetype, folder = 'nexbloom/products') => {
  return new Promise((resolve, reject) => {
    const isVideo = mimetype.startsWith('video/');
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'image',
        quality: 'auto',
        ...(isVideo ? {} : { fetch_format: 'auto' }),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload/image → Single/Multi Image Upload
router.post('/image', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Koi image file nahi mili.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'nexbloom/products/images');

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: 'image',
    });
  } catch (err) {
    console.error('Cloudinary image upload error:', err.message);
    return res.status(500).json({ error: `Image upload failed: ${err.message}` });
  }
});

// POST /api/upload/video → Single Video Upload
router.post('/video', protectAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Koi video file nahi mili.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'nexbloom/products/videos');

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: 'video',
    });
  } catch (err) {
    console.error('Cloudinary video upload error:', err.message);
    return res.status(500).json({ error: `Video upload failed: ${err.message}` });
  }
});

// POST /api/upload/media → Universal Media Upload (Image or Video)
router.post('/media', protectAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Koi file select nahi ki gayi.' });
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const folder = isVideo ? 'nexbloom/products/videos' : 'nexbloom/products/images';
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, folder);

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: isVideo ? 'video' : 'image',
    });
  } catch (err) {
    console.error('Cloudinary media upload error:', err.message);
    return res.status(500).json({ error: `Media upload failed: ${err.message}` });
  }
});

module.exports = router;
