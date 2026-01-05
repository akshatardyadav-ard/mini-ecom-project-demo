const { body } = require("express-validator");

exports.addToCartValidation = [
  body("product_id").isInt().withMessage("Valid product required"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];
