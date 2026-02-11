const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");

const {
  createProduct,
  getProducts,
  deleteProduct,
  getSingleProduct,
  getMyProducts
} = require("../controllers/product.controller");

const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");

router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post(
  "/",
  protect,
  restrictTo("seller", "admin"),
  upload.array("images", 5),
  createProduct
);
router.get("/my-products", protect, restrictTo("seller"), getMyProducts);

router.delete(
  "/:id",
  protect,
  restrictTo("seller", "admin"),
  deleteProduct
);

module.exports = router;
