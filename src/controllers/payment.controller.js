const crypto = require("crypto");
const paymentService = require("../services/payment.service");
const db = require("../config/db");

exports.createPayment = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    const razorpayOrder = await paymentService.createPaymentOrder(
      orderId,
      amount
    );

    // Save razorpay order id
    db.query("UPDATE orders SET razorpay_order_id = ? WHERE id = ?", [
      razorpayOrder.id,
      orderId,
    ]);

    res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: "fail",
        message: "Payment verification failed",
      });
    }

    // Update order
    db.query(
      `UPDATE orders 
       SET razorpay_payment_id = ?, payment_status = 'PAID', status = 'CONFIRMED'
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_order_id]
    );

    res.json({
      status: "success",
      message: "Payment verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
