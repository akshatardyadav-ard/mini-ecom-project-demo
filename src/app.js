require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

/* CORS */
app.use(
  cors({
    origin: [
      "https://mini-ecom-project-demo.onrender.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* Routes */
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/category.routes"));
app.use("/api", require("./routes/product.routes"));
app.use("/api", require("./routes/cart.routes"));
app.use("/api", require("./routes/order.routes"));

/* Swagger */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
