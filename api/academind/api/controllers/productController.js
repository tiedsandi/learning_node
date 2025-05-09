// controllers/productController.js
const mongoose = require("mongoose");
const path = require("path");
const ProductModel = require("../models/product");
const asyncHandler = require("../utils/asyncHandler");
const deleteFile = require("../utils/deleteFile");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalProducts = await ProductModel.countDocuments().exec();
  const products = await ProductModel.find()
    .select("name price _id createdAt productImage updatedAt")
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  res.status(200).json({
    message: "Handling GET request to /products",
    page: page,
    limit: limit,
    totalProducts: totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    count: products.length,
    data: products.map((product) => ({
      name: product.name,
      price: product.price,
      productImage: product.productImage,
      _id: product._id,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
      request: {
        type: "GET",
        url: `${req.protocol}://${req.get("host")}/products/${product._id}`,
      },
    })),
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const relativeImagePath = req.file
    ? path.join("uploads/products", req.file.filename).replace(/\\/g, "/")
    : null;

  const product = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    productImage: relativeImagePath,
  });

  try {
    const result = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      createdProduct: {
        name: result.name,
        price: result.price,
        productImage: result.productImage,
        _id: result._id,
        request: {
          type: "GET",
          url: `${req.protocol}://${req.get("host")}/products/${result._id}`,
        },
      },
    });
  } catch (err) {
    if (relativeImagePath) {
      await deleteFile(relativeImagePath);
    }
    next(err);
  }
});

exports.getProductById = asyncHandler(async (req, res) => {
  const id = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID format" });
  }

  const product = await ProductModel.findById(id)
    .select("name price _id productImage createdAt updatedAt")
    .lean()
    .exec();

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    message: "Product found",
    product: product,
    request: {
      type: "GET",
      description: "Get all products",
      url: `${req.protocol}://${req.get("host")}/products/`,
    },
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.productId;

  const product = await ProductModel.findById(id).exec();

  if (!product) {
    if (req.file) {
      await deleteFile(
        path.join("uploads/products", req.file.filename).replace(/\\/g, "/")
      );
    }
    return res.status(404).json({ message: "Product not found" });
  }

  let relativeImagePath = product.productImage;
  let oldImagePath = product.productImage;
  let newImagePath = null;

  if (req.file) {
    newImagePath = path
      .join("uploads/products", req.file.filename)
      .replace(/\\/g, "/");
    relativeImagePath = newImagePath;
  }

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.productImage = relativeImagePath;

  try {
    const updatedProduct = await product.save();

    if (newImagePath && oldImagePath) {
      await deleteFile(oldImagePath);
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
      request: {
        type: "GET",
        url: `${req.protocol}://${req.get("host")}/products/${id}`,
      },
    });
  } catch (err) {
    // Kalau gagal dan ada file baru, hapus file baru supaya tidak nyangkut
    if (newImagePath) {
      await deleteFile(newImagePath);
    }
    next(err);
  }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.productId;

  const product = await ProductModel.findById(id).exec();

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Delete image if exists
  if (product.productImage) {
    await deleteFile(product.productImage);
  }

  await ProductModel.deleteOne({ _id: id }).exec();

  res.status(200).json({
    message: "Deleted product!",
    request: {
      type: "POST",
      description: "Create new product",
      url: `${req.protocol}://${req.get("host")}/products/`,
      body: { name: "String", price: "Number" },
    },
  });
});
