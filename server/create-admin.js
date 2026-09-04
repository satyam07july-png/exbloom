require("dotenv").config();
const readline = require("readline");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function createAdmin() {
  try {
    await connectDB();

    // Command line args: node server/create-admin.js <email> <password> <name>
    const args = process.argv.slice(2);
    let email = args[0];
    let password = args[1];
    let name = args[2] || "Store Administrator";

    if (!email) {
      email = await askQuestion("📧 Enter Admin Email: ");
    }
    if (!password) {
      password = await askQuestion("🔑 Enter Admin Password: ");
    }
    if (!args[2] && (!name || name === "Store Administrator")) {
      const inputName = await askQuestion("👤 Enter Admin Name (Press Enter for default): ");
      if (inputName.trim()) name = inputName.trim();
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    if (!email || !password) {
      console.error("❌ Email aur Password dono zaroori hain!");
      process.exit(1);
    }

    if (password.length < 6) {
      console.error("❌ Password kam se kam 6 characters ka hona chahiye!");
      process.exit(1);
    }

    // Check if admin already exists
    let admin = await Admin.findOne({ email });

    if (admin) {
      // Update existing admin password & name
      admin.name = name;
      admin.password = password; // Pre-save hook will bcrypt hash it automatically
      await admin.save();
      console.log("\n==========================================");
      console.log("✅ Admin Details Successfully Updated in Database!");
      console.log("==========================================");
    } else {
      // Create new admin
      admin = new Admin({
        name,
        email,
        password, // Pre-save hook will bcrypt hash it
        role: "superadmin",
      });
      await admin.save();
      console.log("\n==========================================");
      console.log("✅ New Admin Successfully Created in Database!");
      console.log("==========================================");
    }

    console.log(`👤 Name:     ${admin.name}`);
    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("------------------------------------------");
    console.log("🚀 Ab aap is Email & Password se Admin Portal / Login Modal mein login kar sakte hain!\n");

  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  } finally {
    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
