const CategoryModel = require("../models/Category");
const NewsModel = require("../models/News");
const CommentModel = require("../models/Comment");
const UserModel = require("../models/User");

const allComments = async (req, res) => {
  res.render("admin/comments");
};

module.exports = { allComments };
