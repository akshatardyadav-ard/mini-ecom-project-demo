require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const path = require("path");

const app = express();

/* CORS FOR RENDER  */
// app.use(
//   cors({
//     origin: [
//       "https://mini-ecom-project-demo.onrender.com",
//       "http://localhost:3000",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// ✅ Enable CORS
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* Routes */
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/category.routes"));
app.use("/api", require("./routes/product.routes"));
app.use("/api", require("./routes/cart.routes"));
app.use("/api", require("./routes/order.routes"));
app.use("/api", require("./routes/payment.routes"));

/* Swagger */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// THIS IS FOR IMG UPLOAD
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

/* Error Handler */
const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

/* START SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger: /api-docs`);
});
