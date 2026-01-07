const db = require("../config/db");

// ✅ Place order (TRANSACTION SAFE)
exports.placeOrder = async (userId) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Get cart items + stock
    const [cartItems] = await conn.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock
       FROM cart c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2️⃣ Stock validation
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}`);
      }
    }

    // 3️⃣ Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    // 4️⃣ Create order
    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PENDING')",
      [userId, total]
    );

    const orderId = orderResult.insertId;

    // 5️⃣ Insert order items
    const orderItemsValues = cartItems.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    await conn.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
      [orderItemsValues]
    );

    // 6️⃣ Reduce product stock
    for (const item of cartItems) {
      await conn.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.quantity,
        item.product_id,
      ]);
    }

    // 7️⃣ Clear cart
    await conn.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    await conn.commit();

    return { orderId, total };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// ✅ Get user orders
exports.getUserOrders = async (userId) => {
  const [orders] = await db.query("SELECT * FROM orders WHERE user_id = ?", [
    userId,
  ]);

  return orders;
};

// ✅ Get order details
exports.getOrderDetails = async (orderId, userId) => {
  const [orders] = await db.query(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [orderId, userId]
  );

  if (orders.length === 0) {
    throw new Error("Order not found");
  }

  const order = orders[0];

  const [items] = await db.query(
    `SELECT oi.product_id, p.name, oi.quantity, oi.price,
            (oi.quantity * oi.price) AS itemTotal
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  return { order, items };
};

// ✅ Admin: get all orders
exports.getAllOrders = async () => {
  const [orders] = await db.query("SELECT * FROM orders");
  return orders;
};

// ✅ Admin: update order status
exports.updateOrderStatus = async (orderId, status) => {
  const allowedStatus = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid order status");
  }

  await db.query("UPDATE orders SET status = ? WHERE id = ?", [
    status,
    orderId,
  ]);

  return true;
};
