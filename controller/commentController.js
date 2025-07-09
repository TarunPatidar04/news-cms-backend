const CategoryModel = require("../models/Category");
const NewsModel = require("../models/News");
const CommentModel = require("../models/Comment");
const UserModel = require("../models/User");
const { validationResult } = require("express-validator");

const allComments = async (req, res) => {
  res.render("admin/comments", { role: req.role });
};

module.exports = { allComments };
