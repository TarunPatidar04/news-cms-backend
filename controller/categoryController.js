const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const userModel = require("../models/User");

exports.allCategory = async (req, res) => {
  res.render("admin/categories");
};

exports.addCategoryPage = async (req, res) => {
  res.render("admin/categories/create");
};

exports.addCategory = async (req, res) => {
  // TODO: Implement logic to add a new category
};

exports.updateCategoryPage = async (req, res) => {
  res.render("admin/categories/update");
};

exports.updateCategory = async (req, res) => {
  // TODO: Implement logic to update a category
};

exports.deleteCategory = async (req, res) => {
  // TODO: Implement logic to delete a category
};
