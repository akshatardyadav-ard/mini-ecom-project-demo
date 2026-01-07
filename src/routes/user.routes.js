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

router.get("/railwayUsers", getRailwayUsers);

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);

// Protected route
router.get("/profile", authMiddleware, getProfile);

router.put(
  "/update/:id",
  authMiddleware,
  updateUserValidation,
  validate,
  updateUser
);

router.delete("/users/:id", authMiddleware, deleteUser);

router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  // roleMiddleware(["admin", "manager"]),
  adminDashboard
);
module.exports = router;
