const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const userModel = require("../models/User");
const { createError } = require("../utils/errorMessage");
const { validationResult } = require("express-validator");


exports.allCategory = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/categories", { role: req.role, categories });
};

exports.addCategoryPage = async (req, res) => {
  res.render("admin/categories/create", { role: req.role, errors: 0 });
};

exports.addCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/categories/create", {
      role: req.role,
      errors: errors.array(),
    });
  }

  try {
    await categoryModel.create(req.body);
    res.redirect("/admin/category");
  } catch (error) {
    res.status(400).send("Internal Server Error in addCategory", error);
  }
};

exports.updateCategoryPage = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return next(createError("Category not found", 404));
    }

    res.render("admin/categories/update", { role: req.role, category, errors: 0 });
  } catch (error) {
    res.status(400).send("Internal Server Error in getCategory", error);
  }
};

exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    category = await categoryModel.findById(req.params.id);
    return res.render("admin/categories/update", {
      category,
      role: req.role,
      errors: errors.array(),
    });
  }

  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!category) {
      // return res.status(404).send("Category not found");
      return next(createError("Category not found", 404));
    }
    res.redirect("/admin/category");
  } catch (error) {
    res.status(400).send("Internal Server Error in updateCategory", error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      // return res.status(404).send("Category not found");
      return next(createError("Category not found", 404));
    }

    // res.json({
    //   success: true,
    //   message: "Category deleted successfully",
    // });
    res.redirect("/admin/category");
  } catch (error) {
    res.status(400).send("Internal Server Error in deleteCategory", error);
  }
};
