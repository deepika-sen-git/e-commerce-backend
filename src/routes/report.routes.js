const express = require("express");
const router = express.Router();

const {
  sellerRevenue,
  topProducts,
  monthlyRevenue,
  adminDashboard,
  lowStockReport
} = require("../controllers/report.controller");

const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");

router.get(
  "/seller-revenue",
  protect,
  restrictTo("admin", "seller"),
  sellerRevenue
);

router.get(
  "/top-products",
  protect,
  restrictTo("admin"),
  topProducts
);

router.get(
  "/monthly-revenue",
  protect,
  restrictTo("admin"),
  monthlyRevenue
);

router.get(
  "/admin-dashboard",
  protect,
  restrictTo("admin"),
  adminDashboard
);

router.get(
  "/low-stock",
  protect,
  restrictTo("admin", "seller"),
  lowStockReport
);

module.exports = router;
