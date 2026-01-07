const db = require("../config/db");

// ✅ Create category
exports.createCategory = async (name) => {
  const [result] = await db.query("INSERT INTO categories (name) VALUES (?)", [
    name,
  ]);

  return result;
};

// ✅ Get active categories
exports.getCategories = async () => {
  const [categories] = await db.query(
    "SELECT * FROM categories WHERE status = 1"
  );

  return categories;
};
