const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
} = require("../controllers/order.controller");

// User
router.post("/orders", auth, placeOrder);
router.get("/orders", auth, getUserOrders);
router.get("/orders/:id", auth, getOrderDetails);

// Admin
router.get("/admin/orders", auth, role("admin"), getAllOrders);
router.put("/admin/orders/:id", auth, role("admin"), updateOrderStatus);

module.exports = router;
