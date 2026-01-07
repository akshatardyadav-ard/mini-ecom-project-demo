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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Order placed successfully
 *               orderId: 101
 *       401:
 *         description: Unauthorized
 */
router.post("/orders", auth, placeOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders fetched
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 101
 *                   status: PENDING
 *                   totalAmount: 2500
 */
router.get("/orders", auth, getUserOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 101
 *     responses:
 *       200:
 *         description: Order details fetched
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get("/orders/:id", auth, getOrderDetails);

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders fetched
 *       403:
 *         description: Admin access required
 */
router.get("/admin/orders", auth, role("admin"), getAllOrders);

/**
 * @swagger
 * /admin/orders/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 101
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: SHIPPED
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */
router.put("/admin/orders/:id", auth, role("admin"), updateOrderStatus);

module.exports = router;
