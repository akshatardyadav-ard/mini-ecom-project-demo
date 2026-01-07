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
      { expiresIn: "1h" }
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
const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;

  // 1️⃣ Check if user exists
  db.query(
    "SELECT id, role FROM users WHERE id = ?",
    [userId],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (users.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // 2️⃣ Only admin can update role
      if (role && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Only admin can update user role",
        });
      }

      // 3️⃣ Build update fields dynamically
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
        const hashedPassword = bcrypt.hashSync(password, 10);
        fields.push("password = ?");
        values.push(hashedPassword);
      }

      if (role) {
        fields.push("role = ?");
        values.push(role);
      }

      if (fields.length === 0) {
        return res.status(400).json({
          message: "No valid fields provided for update",
        });
      }

      // 4️⃣ Final query
      const sql = `UPDATE users SET ${fields.join(",")} WHERE id = ?`;
      values.push(userId);

      db.query(sql, values, (err) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.json({
          message: "User updated successfully",
          updatedFields: fields.map((f) => f.split(" ")[0]),
        });
      });
    }
  );
};

//Delete User
const deleteUser = (req, res) => {
  const userId = req.params.id;

  // 🛑 Only admin can delete users
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only",
    });
  }

  // 🔍 Check if user exists
  db.query("SELECT id FROM users WHERE id = ?", [userId], (err, users) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🗑 Delete user
    db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        message: "User deleted successfully",
      });
    });
  });
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
