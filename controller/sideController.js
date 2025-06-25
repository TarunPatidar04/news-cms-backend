// Frontend route Controller

const mongoose = require("mongoose");

const CategoryModel = require("../models/Category");
const NewsModel = require("../models/News");
const CommentModel = require("../models/Comment");
const UserModel = require("../models/User");

const index = async (req, res) => {
  res.render("index");
};
const articalByCategory = async (req, res) => {
  res.render("category");
};
const singleArticle = async (req, res) => {
  res.render("single");
};
const search = async (req, res) => {
  res.render("search");
};
const author = async (req, res) => {
  res.render("author");
};
const addComment = async (req, res) => {
  res.render("index");
};

module.exports = {
  index,
  articalByCategory,
  singleArticle,
  search,
  author,
  addComment,
};
