require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

//Import user routes
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
// use route
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

const PORT = process.env.PORT || 3306;

// Global error handler (LAST middleware)
const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
