const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URL;

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
