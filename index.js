

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./Routes/authRoute");
const categoryRoute = require("./Routes/categoryRoute");
const orderRoutes = require("./Routes/order");
// const productRoutes = require("./Routes/productRoutes");
const productRoutes =require("./Routes/productRoutes")
dotenv.config();
const app = express();

// Middleware
app.use(cors()); // Allow CORS from any origin
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/product",productRoutes);
// Default route
app.get("/", (req, res) => {
  res.send("API is working...");
});
app.use("/api/v1", orderRoutes);


// MongoDB connection
connectDB();

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
