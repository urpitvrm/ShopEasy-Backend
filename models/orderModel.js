const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product", // ✅ Should match model name used in productModel
      },
    ],
    buyer: {
      type: mongoose.ObjectId,
      ref: "User", // ✅ Should match model name used in userModel
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema); // ✅ Singular
