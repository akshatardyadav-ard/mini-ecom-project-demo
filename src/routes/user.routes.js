const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
  updateUser,
  deleteUser,
  getRailwayUsers,
} = require("../controllers/user.controller");

const validate = require("../middlewares/validate.middleware");
const {
  registerValidation,
  loginValidation,
  updateUserValidation,
} = require("../validators/user.validator");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and management APIs
 */

/**
 * @swagger
 * /railwayUsers:
 *   get:
 *     summary: Get users from Railway database
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Railway users fetched successfully
 */
router.get("/railwayUsers", getRailwayUsers);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: John Doe
 *             email: john@gmail.com
 *             password: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", registerValidation, validate, registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: john@gmail.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: JWT_TOKEN
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidation, validate, loginUser);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
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
 *             name: John Updated
 *             email: john_updated@gmail.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/update/:id",
  authMiddleware,
  updateUserValidation,
  validate,
  updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/users/:id", authMiddleware, deleteUser);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Admin dashboard data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard accessed
 *       403:
 *         description: Admin access required
 */
router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  adminDashboard
);

module.exports = router;
