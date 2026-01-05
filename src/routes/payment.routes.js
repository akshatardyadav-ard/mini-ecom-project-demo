const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createPayment,
  verifyPayment,
} = require("../controllers/payment.controller");

router.post("/payment/create", auth, createPayment);
router.post("/payment/verify", auth, verifyPayment);

module.exports = router;
