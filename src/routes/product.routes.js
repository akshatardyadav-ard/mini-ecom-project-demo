const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
  createProductImg,
} = require("../controllers/product.controller");

router.post("/products", auth, role("admin"), createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductsById);

router.put("/products/:id", auth, updateProduct);
router.delete("/products/:id", auth, deleteProduct);

router.post(
  "/productsImg",
  auth,
  role("admin"),
  upload.array("images", 5), // max 5 images
  createProductImg
);

module.exports = router;
