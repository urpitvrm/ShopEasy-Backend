const orderModel = require("../models/orderModel");

 const createOrderController = async (req, res) => {
  try {
    const { products } = req.body;
    const order = new orderModel({
      products,
    //   payment,
      buyer: req.user._id,
    });
    await order.save();
    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Order failed", error });
  }
};

 const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch orders", error });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({ success: true, orders });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch all orders", error });
  }
}
const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update order status",
      error,
    });
  }
};
  

module.exports = {
  createOrderController,
  getOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
};