// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// app.use(
//   cors({
//     origin: [
//       "https://mini-ecom-project-demo.onrender.com", // Swagger / frontend
//       "http://localhost:3000", // local dev
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// app.use(express.json());
// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./swagger");

// //Import user routes
// const userRoutes = require("./routes/user.routes");
// const categoryRoutes = require("./routes/category.routes");
// const productRoutes = require("./routes/product.routes");
// const cartRoutes = require("./routes/cart.routes");
// const orderRoutes = require("./routes/order.routes");
// // use route
// app.use("/api", userRoutes);
// app.use("/api", categoryRoutes);
// app.use("/api", productRoutes);
// app.use("/api", cartRoutes);
// app.use("/api", orderRoutes);

// // Swagger Docs
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.get("/", (req, res) => {
//   res.send("Backend server is running!");
// });

// const PORT = process.env.DB_PORT || 3000;

// // Global error handler (LAST middleware)
// const errorHandler = require("./middlewares/error.middleware");
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
//   console.log(`Swagger Docs working: http://localhost:${PORT}/api-docs`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// 🔥 FIX 1: Handle preflight OPTIONS requests FIRST
app.options("*", cors());

app.use(
  cors({
    origin: [
      "https://mini-ecom-project-demo.onrender.com",
      "http://localhost:3000",
      "http://localhost:4200",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔥 FIX 2: Debug logging for Railway
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} from ${req.get(
      "origin"
    )}`
  );
  next();
});

app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { persistAuthorization: true },
  })
);

// 🔥 FIX 3: SPECIFIC route prefixes (NO CONFLICTS)
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

app.use("/api/users", userRoutes); // ✅ /api/users/*
app.use("/api/categories", categoryRoutes); // ✅ /api/categories/*
app.use("/api/products", productRoutes); // ✅ /api/products/*
app.use("/api/cart", cartRoutes); // ✅ /api/cart/*
app.use("/api/orders", orderRoutes); // ✅ /api/orders/*

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API Running!",
    docs: "/api-docs",
    endpoints: ["/api/users", "/api/products", "/api/cart", "/api/orders"],
  });
});

// 🔥 FIX 4: CORRECT PORT for Railway
const PORT = process.env.PORT || 5000;

const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
