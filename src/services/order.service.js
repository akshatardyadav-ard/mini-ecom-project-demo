const db = require("../config/db");

// Place order
exports.placeOrder = (userId) => {
  return new Promise((resolve, reject) => {
    // 1️⃣ Get cart items + stock
    db.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock
       FROM cart c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`,
      [userId],
      (err, cartItems) => {
        if (err) return reject(err);
        if (cartItems.length === 0) return reject(new Error("Cart is empty"));

        // 2️⃣ Stock validation
        for (const item of cartItems) {
          if (item.quantity > item.stock) {
            return reject(
              new Error(`Insufficient stock for product ID ${item.product_id}`)
            );
          }
        }

        // 3️⃣ Calculate total
        const total = cartItems.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        );

        // 4️⃣ Create order
        db.query(
          "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PENDING')",
          [userId, total],
          (err, orderResult) => {
            if (err) return reject(err);

            const orderId = orderResult.insertId;

            // 5️⃣ Insert order items
            const values = cartItems.map((item) => [
              orderId,
              item.product_id,
              item.quantity,
              item.price,
            ]);

            db.query(
              "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
              [values],
              (err) => {
                if (err) return reject(err);

                // 6️⃣ Reduce product stock
                const stockUpdates = cartItems.map((item) => {
                  return new Promise((resolve, reject) => {
                    db.query(
                      "UPDATE products SET stock = stock - ? WHERE id = ?",
                      [item.quantity, item.product_id],
                      (err) => {
                        if (err) return reject(err);
                        resolve();
                      }
                    );
                  });
                });

                Promise.all(stockUpdates)
                  .then(() => {
                    // 7️⃣ Clear cart
                    db.query(
                      "DELETE FROM cart WHERE user_id = ?",
                      [userId],
                      (err) => {
                        if (err) return reject(err);
                        resolve({ orderId, total });
                      }
                    );
                  })
                  .catch(reject);
              }
            );
          }
        );
      }
    );
  });
};

// Get user orders
exports.getUserOrders = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [userId],
      (err, orders) => {
        if (err) return reject(err);
        resolve(orders);
      }
    );
  });
};

exports.getOrderDetails = (orderId, userId) => {
  return new Promise((resolve, reject) => {
    // 1️⃣ Order info
    db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId],
      (err, orders) => {
        if (err) return reject(err);
        if (orders.length === 0) return reject(new Error("Order not found"));

        const order = orders[0];

        // 2️⃣ Order items
        db.query(
          `SELECT oi.product_id, p.name, oi.quantity, oi.price,
                  (oi.quantity * oi.price) AS itemTotal
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           WHERE oi.order_id = ?`,
          [orderId],
          (err, items) => {
            if (err) return reject(err);

            resolve({
              order,
              items,
            });
          }
        );
      }
    );
  });
};

// Admin: get all orders
exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM orders", (err, orders) => {
      if (err) return reject(err);
      resolve(orders);
    });
  });
};

// Admin: update order status
exports.updateOrderStatus = (orderId, status) => {
  const allowedStatus = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

  if (!allowedStatus.includes(status)) {
    return Promise.reject(new Error("Invalid order status"));
  }

  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};
