const categoryService = require("../services/category.service");

exports.createCategory = async (req, res, next) => {
  try {
    await categoryService.createCategory(req.body.name);
    res.status(201).json({
      status: "success",
      message: "Category created",
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const data = await categoryService.getCategories();
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};
