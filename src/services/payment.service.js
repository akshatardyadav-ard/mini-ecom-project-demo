const razorpay = require("../config/razorpay");

exports.createPaymentOrder = async (orderId, amount) => {
  const options = {
    amount: amount * 100, // rupees → paise
    currency: "INR",
    receipt: `order_${orderId}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
};
