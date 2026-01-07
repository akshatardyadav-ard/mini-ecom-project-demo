const db = require("../config/db");

// ✅ Create product
exports.createProduct = async (data) => {
  const { category_id, name, description, price, stock } = data;

  const [result] = await db.query(
    `INSERT INTO products 
     (category_id, name, description, price, stock)
     VALUES (?, ?, ?, ?, ?)`,
    [category_id, name, description, price, stock]
  );

  return result;
};

// ✅ Get all active products
exports.getProducts = async () => {
  const [products] = await db.query(
    `SELECT p.*, c.name AS category
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.status = 1`
  );

  return products;
};

// ✅ Get single product
exports.getProductById = async (id) => {
  const [products] = await db.query(
    `SELECT p.*, c.name AS category
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? AND p.status = 1`,
    [id]
  );

  return products[0] || null;
};

// ✅ Update product (ADMIN)
exports.productUpdate = async (id, data) => {
  const { category_id, name, description, price, stock } = data;

  const [result] = await db.query(
    `UPDATE products 
     SET category_id = ?, name = ?, description = ?, price = ?, stock = ?
     WHERE id = ? AND status = 1`,
    [category_id, name, description, price, stock, id]
  );

  return result;
};

// ✅ Soft delete product
exports.deleteProduct = async (id) => {
  const [result] = await db.query(
    `UPDATE products SET status = 0 WHERE id = ?`,
    [id]
  );

  return result;
};

// ✅ Create product (used when images are included)
exports.createProductImg = async (data) => {
  const { category_id, name, description, price, stock } = data;

  const [result] = await db.query(
    `INSERT INTO products 
     (category_id, name, description, price, stock)
     VALUES (?, ?, ?, ?, ?)`,
    [category_id, name, description, price, stock]
  );

  return result.insertId;
};

// ✅ Save product images
exports.saveProductImages = async (productId, files) => {
  const values = files.map((file) => [
    productId,
    file.path, // Cloudinary URL
  ]);

  if (!values.length) return true;

  await db.query(
    "INSERT INTO product_images (product_id, image_url) VALUES ?",
    [values]
  );

  return true;
};
