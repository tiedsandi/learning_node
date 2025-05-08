const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const checkAuth = require("../middleware/check-auth");

const uploadDir = path.join(__dirname, "../../uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const ProductModel = require("../models/product");

router.get("/", async (req, res, next) => {
  try {
    const products = await ProductModel.find()
      .select("name price _id createdAt productImage updatedAt")
      .exec();
    // console.log(products);

    if (products.length > 0) {
      res.status(200).json({
        message: "Handling GET request to /products",
        count: products.length,
        data: products.map((product) => {
          return {
            name: product.name,
            price: product.price,
            productImage: product.productImage,
            _id: product._id,
            created_at: product.createdAt,
            updated_at: product.updatedAt,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + product._id,
            },
          };
        }),
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

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  async (req, res, next) => {
    console.log(req.file);

    try {
      const relativeImagePath = req.file
        ? path.join("uploads/products", req.file.filename).replace(/\\/g, "/")
        : null;

      const product = new ProductModel({
        name: req.body.name,
        price: req.body.price,
        productImage: relativeImagePath,
      });

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
            url: "http://localhost:3000/products/" + result._id,
          },
        },
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
  }
);

router.get("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid Product ID format",
    });
  }

  try {
    const product = await ProductModel.findById(id)
      .select("name price _id productImage createdAt updatedAt")
      .exec();
    // console.log({ id: product });

    if (product) {
      res.status(200).json({
        message: "Product found",
        product: product,
        request: {
          type: "GET",
          description: "Get all products",
          url: `${baseUrl}/products/`,
        },
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
        product: updatedProduct,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
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

router.delete("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  try {
    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: id,
    }).exec();

    if (deletedProduct) {
      res.status(200).json({
        message: "Deleted product!",
        deletedProduct,
        request: {
          type: "POST",
          description: "Create new product",
          url: "http://localhost:3000/products/",
          body: { name: "String", price: "Number" },
        },
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
});

module.exports = router;
