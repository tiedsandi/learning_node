const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ProductModel = require("../models/product");

router.get("/", async (req, res, next) => {
  try {
    const products = await ProductModel.find().exec();
    console.log(products);

    if (products.lengths >= 0) {
      res.status(200).json({
        message: "Handling GET request to /products",
        data: products,
      });
    } else {
      res.status(404).json({
        message: "No entries found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = new ProductModel({
      name: req.body.name,
      price: req.body.price,
    });

    const result = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      createdProduct: result,
    });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Product name must be unique",
      });
    }

    res.status(500).json({
      message: "Failed to create product",
      error: err.message,
    });
  }
});

router.get("/:productId", async (req, res, next) => {
  const id = req.params.productId;

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({
  //     message: "Invalid Product ID format",
  //   });
  // }

  try {
    const product = await ProductModel.findById(id).exec();
    // console.log({ id: product });

    if (product) {
      res.status(200).json({
        message: "Product found",
        product: product,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (err) {
    // console.error(err);
    res.status(500).json({
      message: "Error retrieving product",
      error: err.message,
    });
  }
});

router.patch("/:productId", async (req, res, next) => {
  const id = req.params.productId;

  try {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
        },
      },
      { new: true, runValidators: true }
    ).exec();

    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully",
        updatedProduct: updatedProduct,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  try {
    ProductModel.findOneAndDelete({ _id: id }).exec();
    res.status(200).json({
      message: "Deleted product!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

module.exports = router;
