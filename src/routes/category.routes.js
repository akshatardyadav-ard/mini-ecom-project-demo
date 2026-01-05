const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createCategory } = require("../controllers/category.controller");

const {
  createCategoryValidation,
} = require("../validators/category.validator");

router.post(
  "/categories",
  auth,
  role("admin"),
  createCategoryValidation,
  validate,
  createCategory
);

router.get(
  "/categories",
  require("../controllers/category.controller").getCategories
);

module.exports = router;
