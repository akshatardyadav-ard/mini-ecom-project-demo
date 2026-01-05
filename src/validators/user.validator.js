const { body } = require("express-validator");

exports.registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // body("confirmPassword").custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new Error("Password and confirm password do not match");
  //   }
  //   return true;
  // }),

  body("role")
    .optional()
    .isIn(["user", "manager", "admin"])
    .withMessage("Role must be user, manager or admin"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),

  body("password").notEmpty().withMessage("Password is required"),
];

exports.updateUserValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["user", "manager", "admin"])
    .withMessage("Invalid role value"),
];
