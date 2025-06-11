
const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  getProductPhotoController,
  deleteProductController,
  updateProductController,
  getSingleProductByIdController,
  filterProductController,
  getProductByCatController,
  getSearchProductController,
} = require("../controllers/productController");

const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);
router.get("/get-product-by-id/:id", getSingleProductByIdController);
router.get("/product-photo/:id", getProductPhotoController);
router.delete("/delete-product/:id", deleteProductController);
router.post("/filter-product", filterProductController);
router.get("/get-product/cat/:id", getProductByCatController);
router.get("/search/:keyword", getSearchProductController);

module.exports = router;
