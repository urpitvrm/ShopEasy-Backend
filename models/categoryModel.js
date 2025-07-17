
// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   slug: {
//     type: String,
//     lowercase: true,
    
//   },
// });

// module.exports = mongoose.model("Category", categorySchema);

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true, // Added for faster lookups
    },
    slug: {
      type: String,
      lowercase: true,
      index: true, // Optional: helps in lookups/search
    },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Category", categorySchema);
