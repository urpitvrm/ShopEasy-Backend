const express = require("express");
const {
  createOrderController,
  getOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
} = require("../controllers/orderController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/order", requireSignIn, createOrderController);
router.get("/orders", requireSignIn, getOrdersController);
router.get("/all-orders", requireSignIn, getAllOrdersController); // Assuming you want to fetch all orders for admin
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatusController
);


module.exports = router;
