require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: [
      "https://mini-ecom-project-demo.onrender.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 👇 IMPORTANT: handle preflight explicitly
app.options("*", cors());

app.use(express.json());
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

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

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.DB_PORT || 3000;

// Global error handler (LAST middleware)
const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Swagger Docs working: http://localhost:${PORT}/api-docs`);
});
