const db = require("../config/db");

exports.createProduct = (data) => {
  const { category_id, name, description, price, stock } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO products 
      (category_id, name, description, price, stock)
      VALUES (?, ?, ?, ?, ?)`,
      [category_id, name, description, price, stock],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.getProducts = () => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.*, c.name as category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.status = 1`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.*, c.name AS category
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ? AND p.status = 1`,
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // single product
      }
    );
  });
};

//2️⃣ Update Product (ADMIN ONLY)
exports.productUpdate = (id, data) => {
  const { category_id, name, description, price, stock } = data;
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE products SET category_id = ?, name=?, description=?, price=?, stock=?
      WHERE id=? AND status = 1 `,
      [category_id, name, description, price, stock, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// 3️⃣ Delete Product (SOFT DELETE – ADMIN ONLY)
exports.deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE products SET status = 0 WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// create product with imgs
exports.createProductImg = (data) => {
  const { category_id, name, description, price, stock } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO products (category_id, name, description, price, stock)
       VALUES (?, ?, ?, ?, ?)`,
      [category_id, name, description, price, stock],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

exports.saveProductImages = (productId, files) => {
  const values = files.map((file) => [
    productId,
    file.path, // Cloudinary URL
  ]);

  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO product_images (product_id, image_url) VALUES ?",
      [values],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};
