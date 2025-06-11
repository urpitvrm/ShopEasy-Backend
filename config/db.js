const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connecteddddd: ${conn.connection.host}`);
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
};


module.exports = connectDB;
