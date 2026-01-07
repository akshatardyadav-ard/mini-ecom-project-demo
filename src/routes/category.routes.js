const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createCategory } = require("../controllers/category.controller");

const {
  createCategoryValidation,
} = require("../validators/category.validator");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post(
  "/categories",
  auth,
  role("admin"),
  createCategoryValidation,
  validate,
  createCategory
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   name: Electronics
 *                 - id: 2
 *                   name: Fashion
 */
router.get(
  "/categories",
  require("../controllers/category.controller").getCategories
);

module.exports = router;
