const newsModel = require("../models/News");
const userModel = require("../models/User");
const categoryModel = require("../models/Category");

exports.allArticle = async (req, res) => {
  res.render("admin/articles", { role: req.role });
};

exports.addArticlePage = async (req, res) => {
  res.render("admin/articles/create", { role: req.role });
};

exports.addArticle = async (req, res) => {};

exports.updateArticlePage = async (req, res) => {
  res.render("admin/articles/update", { role: req.role });
};

exports.updateArticle = async (req, res) => {};

exports.deleteArticle = async (req, res) => {};
