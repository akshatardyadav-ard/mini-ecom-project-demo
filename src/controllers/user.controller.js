const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

//get users
const getRailwayUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");

    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("DB Error:", error.message);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userRole = role || "user";

    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    const [result] = await db.query(sql, [
      name,
      email,
      hashedPassword,
      userRole,
    ]);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Register Error:", err);
    next(err);
  }
};

// Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return next(new AppError("User not found", 404));
    }

    const user = users[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid password", 401));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    next(err);
  }
};

//Get Profile
const getProfile = (req, res) => {
  res.json({
    message: "Profile data accessed",
    user: req.user,
  });
};

//Update User
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;

    // Self or admin
    if (req.user.role !== "admin" && req.user.id != userId) {
      return res.status(403).json({
        message: "You are not allowed to update this user",
      });
    }

    // 🔹 Check user exists
    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);

    console.log("5️⃣ DB select executed");

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Only admin can update role
    if (role && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update user role",
      });
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (role) {
      fields.push("role = ?");
      values.push(role);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No valid fields provided",
      });
    }

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(userId);

    await db.query(sql, values);

    console.log("6️⃣ Update executed");

    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("❌ ERROR:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

//Delete User
// const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // 🛑 Only admin can delete users
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         message: "Access denied. Admin only",
//       });
//     }

//     // 🔍 Check if user exists
//     const [users] = await db.query("SELECT id FROM users WHERE id = ?", [
//       userId,
//     ]);

//     if (users.length === 0) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // 🗑 Delete user
//     await db.query("DELETE FROM users WHERE id = ?", [userId]);

//     res.json({
//       message: "User deleted successfully",
//     });
//   } catch (err) {
//     console.error("❌ Delete user error:", err);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

// ✅ Hard Delete User (Direct Delete)
const deleteUser = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.params.id;

    /* ------------------------------------------------
       1️⃣ Only admin can delete users
    ------------------------------------------------ */
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only",
      });
    }

    /* ------------------------------------------------
       2️⃣ Prevent admin deleting self
    ------------------------------------------------ */
    if (req.user.id == userId) {
      return res.status(400).json({
        message: "Admin cannot delete own account",
      });
    }

    /* ------------------------------------------------
       3️⃣ Check user exists
    ------------------------------------------------ */
    const [users] = await connection.query(
      "SELECT id FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* ------------------------------------------------
       4️⃣ START TRANSACTION
    ------------------------------------------------ */
    await connection.beginTransaction();

    /* ------------------------------------------------
       5️⃣ Delete dependent records FIRST
       (adjust table names to your schema)
    ------------------------------------------------ */

    // Example dependencies (COMMON)
    // await connection.query("DELETE FROM user_roles WHERE user_id = ?", [
    //   userId,
    // ]);
    await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);
    // await connection.query("DELETE FROM cart_items WHERE user_id = ?", [
    //   userId,
    // ]);
    await connection.query("DELETE FROM orders WHERE user_id = ?", [userId]);
    // await connection.query("DELETE FROM payments WHERE user_id = ?", [userId]);
    // await connection.query("DELETE FROM addresses WHERE user_id = ?", [userId]);

    /* ------------------------------------------------
       6️⃣ Delete user
    ------------------------------------------------ */
    await connection.query("DELETE FROM users WHERE id = ?", [userId]);

    /* ------------------------------------------------
       7️⃣ COMMIT
    ------------------------------------------------ */
    await connection.commit();

    res.status(200).json({
      message: "User permanently deleted",
    });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Hard delete user error:", err.sqlMessage || err);

    res.status(500).json({
      message: err.sqlMessage || "Server error",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  deleteUser,
};

//ADMIN ONLY
const adminDashboard = (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    role: req.user.role,
  });
};

module.exports = {
  getRailwayUsers,
  registerUser,
  loginUser,
  getProfile,
  adminDashboard,
  updateUser,
  deleteUser,
};
