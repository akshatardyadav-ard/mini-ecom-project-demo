const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createPayment,
  verifyPayment,
} = require("../controllers/payment.controller");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and transaction APIs
 */

/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Create payment order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             orderId: 101
 *             amount: 2500
 *     responses:
 *       200:
 *         description: Payment order created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               paymentOrderId: pay_123456
 *       401:
 *         description: Unauthorized
 */
router.post("/payment/create", createPayment);
// router.post("/payment/create", auth, createPayment);

/**
 * @swagger
 * /payment/verify:
 *   post:
 *     summary: Verify payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             paymentId: pay_123456
 *             orderId: order_987654
 *             signature: abcdef123456
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Payment verified
 *       400:
 *         description: Payment verification failed
 *       401:
 *         description: Unauthorized
 */
// router.post("/payment/verify", auth, verifyPayment);
router.post("/payment/verify", verifyPayment);

module.exports = router;
