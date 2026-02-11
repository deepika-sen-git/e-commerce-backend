const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");

// Customer → Place order
router.post("/", protect, restrictTo("customer"), createOrder);

// Customer → View own orders
router.get("/my-orders", protect, restrictTo("customer"), getMyOrders);

// Admin → View all orders
router.get("/", protect, restrictTo("admin"), getAllOrders);

// Admin → Update order status
router.patch("/:id/status", protect, restrictTo("admin"), updateOrderStatus);

module.exports = router;
