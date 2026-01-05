const db = require("../config/db");

// Add or update cart item
exports.addToCart = (userId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    // 1️⃣ Check product stock
    db.query(
      "SELECT stock FROM products WHERE id = ? AND status = 1",
      [productId],
      (err, products) => {
        if (err) return reject(err);

        if (products.length === 0) {
          return reject(new Error("Product not found"));
        }

        const stock = products[0].stock;

        if (stock <= 0) {
          return reject(new Error("Product is out of stock"));
        }

        if (quantity > stock) {
          return reject(new Error("Requested quantity exceeds stock"));
        }

        // 2️⃣ Add to cart if stock is valid
        const sql = `
          INSERT INTO cart (user_id, product_id, quantity)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `;

        db.query(
          sql,
          [userId, productId, quantity, quantity],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      }
    );
  });
};

// Get user cart with Add cart total sum
exports.getCart = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.id, p.name, p.price, c.quantity,
             (p.price * c.quantity) AS itemTotal
      FROM cart c
      JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?
    `;

    db.query(sql, [userId], (err, items) => {
      if (err) return reject(err);

      // 🧮 Calculate cart total
      const cartTotal = Number(
        items.reduce((sum, item) => sum + Number(item.itemTotal), 0).toFixed(2)
      );

      resolve({
        items,
        cartTotal,
      });
    });
  });
};

// Update quantity
exports.updateCartItem = (cartId, quantity) => {
  return new Promise((resolve, reject) => {
    // 🗑 Auto remove if quantity is 0
    if (quantity <= 0) {
      return db.query(
        "DELETE FROM cart WHERE id = ?",
        [cartId],
        (err, result) => {
          if (err) return reject(err);
          resolve({ removed: true });
        }
      );
    }

    // ✏️ Otherwise update quantity
    db.query(
      "UPDATE cart SET quantity = ? WHERE id = ?",
      [quantity, cartId],
      (err, result) => {
        if (err) return reject(err);
        resolve({ updated: true });
      }
    );
  });
};

// Remove item
exports.removeCartItem = (cartId) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM cart WHERE id = ?", [cartId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Clear Cart API
exports.clearCart = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM cart WHERE user_id = ?", [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
