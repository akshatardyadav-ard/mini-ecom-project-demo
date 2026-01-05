const productService = require("../services/product.service");

exports.createProduct = async (req, res, next) => {
  try {
    await productService.createProduct(req.body);
    res.status(201).json({
      status: "success",
      message: "Product added",
    });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.status(201).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductsById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    // 🔐 Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const result = await productService.productUpdate(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      message: "Product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // 🔐 Admin only
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const result = await productService.deleteProduct(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

//when creating product add the imgs

exports.createProductImg = async (req, res, next) => {
  try {
    const productId = await productService.createProductImg(req.body);

    if (req.files && req.files.length > 0) {
      await productService.saveProductImages(productId, req.files);
    }

    res.status(201).json({
      status: "success",
      message: "Product created with images",
    });
  } catch (err) {
    next(err);
  }
};
