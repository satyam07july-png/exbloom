const mongoose = require("mongoose");

async function connectDB() {
  const primaryUri = process.env.MONGO_URI;
  const localUri = "mongodb://127.0.0.1:27017/Nexbloom";

  try {
    const uri = primaryUri || localUri;
    await mongoose.connect(uri);
    console.log("MongoDB connected:", uri.includes('@') ? 'MongoDB Atlas Cloud' : uri);
  } catch (err) {
    console.error("Primary MongoDB connection notice:", err.message);
    // If primary cloud connection failed, fallback to local MongoDB
    if (primaryUri && primaryUri !== localUri) {
      try {
        console.log("Connecting to Local MongoDB fallback...");
        await mongoose.connect(localUri);
        console.log("Local MongoDB connected:", localUri);
      } catch (localErr) {
        console.error("Local MongoDB also unreachable:", localErr.message);
      }
    }
  }
}

module.exports = connectDB;