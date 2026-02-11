const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");

exports.createProduct = async (req, res) => {
  const images = req.files.map((file) => file.path);

  const product = await Product.create({
    ...req.body,
    images,
    sellerId: req.user.userId,
  });

  res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
  const features = new APIFeatures(
    Product.find({ isActive: true }),
    req.query
  )
    .search()
    .paginate();

  const products = await features.query;
  res.json(products);
};

exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ sellerId: req.user.userId });
  res.json(products);
};

exports.getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "Product soft deleted" });
};
