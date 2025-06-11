const express = require("express");

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  getCategoryController,
  getCategoryByIdController,
  deleteCategoryController,
} = require("../controllers/categoryController");


const router = express.Router();

router.post("/create-category", requireSignIn, isAdmin,createCategoryController);

router.put("/update-category/:id", requireSignIn,updateCategoryController); 

router.get("/get-category", getCategoryController);

router.get("/get-category/:id", getCategoryByIdController);

router.delete("/delete-category/:id", requireSignIn, deleteCategoryController);
module.exports = router;