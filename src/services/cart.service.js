const db = require("../config/db");

// ✅ Add or update cart item
exports.addToCart = async (userId, productId, quantity) => {
  // 1️⃣ Check product stock
  const [products] = await db.query(
    "SELECT stock FROM products WHERE id = ? AND status = 1",
    [productId]
  );

  if (products.length === 0) {
    throw new Error("Product not found");
  }

  const stock = products[0].stock;

  if (stock <= 0) {
    throw new Error("Product is out of stock");
  }

  if (quantity > stock) {
    throw new Error("Requested quantity exceeds stock");
  }

  // 2️⃣ Add / update cart
  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?
  `;

  await db.query(sql, [userId, productId, quantity, quantity]);

  return true;
};

// ✅ Get user cart + total
exports.getCart = async (userId) => {
  const sql = `
    SELECT c.id, p.name, p.price, c.quantity,
           (p.price * c.quantity) AS itemTotal
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `;

  const [items] = await db.query(sql, [userId]);

  const cartTotal = Number(
    items.reduce((sum, item) => sum + Number(item.itemTotal), 0).toFixed(2)
  );

  return {
    items,
    cartTotal,
  };
};

// ✅ Update quantity
exports.updateCartItem = async (cartId, quantity) => {
  // 🗑 Auto remove if quantity <= 0
  if (quantity <= 0) {
    await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
    return { removed: true };
  }

  // ✏️ Update quantity
  await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
    quantity,
    cartId,
  ]);

  return { updated: true };
};

// ✅ Remove item
exports.removeCartItem = async (cartId) => {
  await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
  return true;
};

// ✅ Clear cart
exports.clearCart = async (userId) => {
  await db.query("DELETE FROM cart WHERE user_id = ?", [userId]);
  return true;
};
