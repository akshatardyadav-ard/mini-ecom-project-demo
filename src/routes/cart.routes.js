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

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart APIs
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             product_id: 10
 *             quantity: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Item added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/cart", auth, addToCartValidation, validate, addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 items:
 *                   - id: 1
 *                     product_id: 10
 *                     name: iPhone 15
 *                     quantity: 2
 *                     price: 75000
 *                 totalAmount: 150000
 */
router.get("/cart", auth, getCart);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             quantity: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
router.put("/cart/:id", auth, updateCartItem);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart item not found
 */
router.delete("/cart/:id", auth, removeCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/cart", auth, clearCart);

module.exports = router;
