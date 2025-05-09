const mongoose = require("mongoose");
const OrderModel = require("../models/order");
const ProductModel = require("../models/product");

class OrderController {
  async getAllOrders(req, res) {
    try {
      const orders = await OrderModel.find()
        .select("productId quantity _id")
        .populate("productId", "name price")
        .exec();

      res.status(200).json({
        message: "Orders were fetched",
        count: orders.length,
        data: orders.map((order) => ({
          _id: order._id,
          product: order.productId,
          quantity: order.quantity,
          request: {
            type: "GET",
            url: `${req.protocol}://${req.get("host")}/orders/${order._id}`,
          },
        })),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching orders", error: error.message });
    }
  }

  async createOrder(req, res) {
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const order = new OrderModel({ productId, quantity });
      const result = await order.save();
      await result.populate("productId", "name price");

      res.status(201).json({
        message: "Order was created",
        createdOrder: {
          _id: result._id,
          product: result.productId,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: `${req.protocol}://${req.get("host")}/orders/${result._id}`,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  }

  async getOrderById(req, res) {
    const id = req.params.orderId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    try {
      const order = await OrderModel.findById(id)
        .select("productId quantity _id")
        .populate("productId", "name price")
        .exec();

      if (order) {
        res.status(200).json({
          message: "Order found",
          order: {
            _id: order._id,
            product: order.productId,
            quantity: order.quantity,
          },
          request: {
            type: "GET",
            description: "Get all orders",
            url: `${req.protocol}://${req.get("host")}/orders/`,
          },
        });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching order", error: error.message });
    }
  }

  async deleteOrder(req, res) {
    const id = req.params.orderId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    try {
      const deletedOrder = await OrderModel.findByIdAndDelete(id).exec();

      if (deletedOrder) {
        res.status(200).json({
          message: "Deleted order!",
          deletedOrder: {
            _id: deletedOrder._id,
            product: deletedOrder.productId,
            quantity: deletedOrder.quantity,
          },
          request: {
            type: "POST",
            description: "Create new order",
            url: `${req.protocol}://${req.get("host")}/orders/`,
            body: { productId: "ID", quantity: "Number" },
          },
        });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting order", error: error.message });
    }
  }
}

module.exports = new OrderController();
