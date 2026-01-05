const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");

const { addToCartValidation } = require("../validators/cart.validator");

router.post("/cart", auth, addToCartValidation, validate, addToCart);

router.get("/cart", auth, getCart);

router.put("/cart/:id", auth, updateCartItem);

router.delete("/cart/:id", auth, removeCartItem);

router.delete("/cart", auth, clearCart);

module.exports = router;
