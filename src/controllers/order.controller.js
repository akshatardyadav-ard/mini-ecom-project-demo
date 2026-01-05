const orderService = require("../services/order.service");

exports.placeOrder = async (req, res, next) => {
  try {
    const result = await orderService.placeOrder(req.user.id);

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      orderId: result.orderId,
      total: result.total,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const data = await orderService.getOrderDetails(req.params.id, req.user.id);

    res.json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    await orderService.updateOrderStatus(req.params.id, req.body.status);

    res.json({
      status: "success",
      message: "Order status updated",
    });
  } catch (err) {
    next(err);
  }
};
