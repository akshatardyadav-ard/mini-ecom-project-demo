const cartService = require("../services/cart.service");

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    await cartService.addToCart(userId, product_id, quantity);

    res.status(201).json({
      status: "success",
      message: "Product added to cart",
    });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const data = await cartService.getCart(req.user.id);

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    await cartService.updateCartItem(req.params.id, req.body.quantity);

    res.json({
      status: "success",
      message: "Cart updated",
    });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    await cartService.removeCartItem(req.params.id);

    res.json({
      status: "success",
      message: "Item removed from cart",
    });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user.id);

    res.json({
      status: "success",
      message: "Cart cleared successfully",
    });
  } catch (err) {
    next(err);
  }
};
