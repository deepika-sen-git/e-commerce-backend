const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");


// Seller-wise revenue
exports.sellerRevenue = async (req, res) => {
  const result = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.sellerId",
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.price"] }
        },
        totalOrders: { $addToSet: "$_id" }
      }
    },
    {
      $project: {
        totalRevenue: 1,
        orderCount: { $size: "$totalOrders" }
      }
    }
  ]);

  res.json(result);
};


// Top 5 products
exports.topProducts = async (req, res) => {
  const result = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  res.json(result);
};


// Monthly revenue
exports.monthlyRevenue = async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        revenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  res.json(result);
};


// Admin dashboard summary
exports.adminDashboard = async (req, res) => {
  const [users, orders, products] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments({ isActive: true })
  ]);

  const revenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  ]);

  res.json({
    totalUsers: users,
    totalOrders: orders,
    activeProducts: products,
    totalRevenue: revenue[0]?.totalRevenue || 0
  });
};


// Low stock report
exports.lowStockReport = async (req, res) => {
  const products = await Product.find({ stock: { $lt: 5 } });

  res.json(products);
};
