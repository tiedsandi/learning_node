const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OrderModel = require("../models/order");
const ProductModel = require("../models/product");

router.get("/", async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const orders = await OrderModel.find()
    .select("productId quantity _id")
    .populate("productId", "name")
    .exec();

  res.status(200).json({
    message: "Orders were fetched",
    count: orders.length,
    data: orders.map((order) => {
      return {
        productId: order.productId,
        quantity: order.quantity,
        _id: order._id,
        request: {
          type: "GET",
          url: `${baseUrl}/orders/` + order._id,
        },
      };
    }),
  });
});

router.post("/", async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const product = await ProductModel.findById(req.body.productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const order = new OrderModel({
    productId: req.body.productId,
    quantity: req.body.quantity,
  });

  const result = await order.save();

  res.status(201).json({
    message: "Order was created",
    createdOrder: {
      productId: result.productId,
      quantity: result.quantity,
      _id: result._id,
    },
    request: {
      type: "GET",
      url: `${baseUrl}/orders/` + result._id,
    },
  });
});

router.get("/:orderId", async (req, res, next) => {
  const id = req.params.orderId;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const order = await OrderModel.findById(id)
    .select("productId quantity _id")
    .populate("productId")
    .exec();

  if (order) {
    res.status(200).json({
      message: "order found",
      product: order,
      request: {
        type: "GET",
        description: "Get all order",
        url: `${baseUrl}/orders/`,
      },
    });
  } else {
    res.status(404).json({
      message: "Order not found",
    });
  }
});

router.delete("/:orderId", async (req, res, next) => {
  const id = req.params.orderId;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const deletedOrder = await OrderModel.findOneAndDelete({
    _id: id,
  }).exec();

  if (deletedOrder) {
    res.status(200).json({
      message: "Deleted order!",
      deletedOrder,
      request: {
        type: "POST",
        description: "Create new Order",
        url: `${baseUrl}/orders/`,
        body: { productId: "ID", quantity: "Number" },
      },
    });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

module.exports = router;
