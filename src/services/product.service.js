const db = require("../config/db");

// ✅ Create product
exports.createProduct = async (data) => {
  const { category_id, name, description, price, stock } = data;

  const [result] = await db.query(
    `INSERT INTO products 
     (category_id, name, description, price, stock)
     VALUES (?, ?, ?, ?, ?)`,
    [category_id, name, description, price, stock],
  );

  return result;
};

// ✅ Get all active products without img
// exports.getProducts = async () => {
//   const [products] = await db.query(
//     `SELECT p.*, c.name AS category
//      FROM products p
//      JOIN categories c ON c.id = p.category_id
//      WHERE p.status = 1`
//   );

//   return products;
// };

// ✅ Get all active products with imgs
exports.getProducts = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      c.name AS category,
      pi.image_url
    FROM products p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE p.status = 1
  `);

  // 🔄 Group images by product
  const productsMap = {};

  rows.forEach((row) => {
    if (!productsMap[row.id]) {
      productsMap[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
        category: row.category,
        images: [],
      };
    }

    if (row.image_url) {
      productsMap[row.id].images.push(row.image_url);
    }
  });

  return Object.values(productsMap);
};

// ✅ Get single product
exports.getProductById = async (id) => {
  const [products] = await db.query(
    `SELECT p.*, c.name AS category
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? AND p.status = 1`,
    [id],
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
    [category_id, name, description, price, stock, id],
  );

  return result;
};

// ✅ Soft delete product
exports.deleteProduct = async (id) => {
  const [result] = await db.query(
    `UPDATE products SET status = 0 WHERE id = ?`,
    [id],
  );

  return result;
};

// ✅ Create product
exports.createProductImg = async (data) => {
  const { category_id, name, description, price, stock } = data;

  const [result] = await db.query(
    `INSERT INTO products 
     (category_id, name, description, price, stock)
     VALUES (?, ?, ?, ?, ?)`,
    [category_id, name, description, price, stock],
  );

  return result.insertId;
};

// ✅ SAVE PRODUCT IMAGES IN LOCAL SERVER
// exports.saveProductImages = async (productId, imagePaths) => {
//   const values = imagePaths.map((path) => [productId, path]);

//   await db.query(
//     "INSERT INTO product_images (product_id, image_url) VALUES ?",
//     [values]
//   );
// };

// ✅ SAVE PRODUCT IMAGES (EXPORT PROPERLY) CLOUDINARY
exports.saveProductImages = async (productId, files) => {
  const values = files.map((file) => [
    productId,
    file.path, // Cloudinary URL
  ]);

  if (!values.length) return;

  await db.query(
    "INSERT INTO product_images (product_id, image_url) VALUES ?",
    [values],
  );
};
