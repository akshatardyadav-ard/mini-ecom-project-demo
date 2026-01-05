const { body } = require("express-validator");

exports.createCategoryValidation = [
  body("name").notEmpty().withMessage("Category name required"),
];
