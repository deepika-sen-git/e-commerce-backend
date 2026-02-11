const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const io = req.app.get("io");
    const { items } = req.body;
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.stock < item.quantity)
        throw new Error("Insufficient stock");

      product.stock -= item.quantity;
      await product.save({ session });

      totalAmount += product.price * item.quantity;
      item.price = product.price;

      if (product.stock < 5) {
        io.to(product.sellerId.toString()).emit("low-stock", product);
      }
    }

    const order = await Order.create(
      [
        {
          userId: req.user.userId,
          items,
          totalAmount,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const io = req.app.get("io");

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  io.to(order.userId.toString()).emit("order-updated", order);

  res.json(order);
};
