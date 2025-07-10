// Frontend route Controller

const mongoose = require("mongoose");

const CategoryModel = require("../models/Category");
const NewsModel = require("../models/News");
const CommentModel = require("../models/Comment");
const UserModel = require("../models/User");

const index = async (req, res) => {
  // Fetch  news articles
  const news = await NewsModel.find()
    .populate("category", { name: 1, slug: 1 })
    .populate("author", "fullname")
    .sort({ createdAt: -1 });

  // Fetch categories
  const categoriesInUse = await NewsModel.distinct("category");

  const categories = await CategoryModel.find({
    _id: { $in: categoriesInUse },
  });


  const recentPosts = await NewsModel.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("category", "name slug");
  res.render("index", { news, categories, recentPosts });
};

const articalByCategory = async (req, res) => {
  const category = await CategoryModel.findOne({ slug: req.params.name });
  if (!category) {
    return res.status(404).send("Category not found");
  }
  const news = await NewsModel.find({ category: category._id })
    .populate("category", { name: 1, slug: 1 })
    .populate("author", "fullname")
    .sort({ createdAt: -1 });

  // Fetch categories
  const categoriesInUse = await NewsModel.distinct("category");

  const categories = await CategoryModel.find({
    _id: { $in: categoriesInUse },
  });
    const recentPosts = await NewsModel.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .populate("category", "name slug");
  res.render("category", { news, categories, categoryName: category.name, recentPosts });
};

const singleArticle = async (req, res) => {
  // Fetch  news articles
  const singleNews = await NewsModel.findById(req.params.id)
    .populate("category", { name: 1, slug: 1 })
    .populate("author", "fullname")
    .sort({ createdAt: -1 });

  // Fetch categories
  const categoriesInUse = await NewsModel.distinct("category");

  const categories = await CategoryModel.find({
    _id: { $in: categoriesInUse },
  });
  const recentPosts = await NewsModel.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .populate("category", "name slug");
  res.render("single", { singleNews, categories, recentPosts });
};

const search = async (req, res) => {
  // Fetch  news articles
  const news = await NewsModel.find()
    .populate("category", { name: 1, slug: 1 })
    .populate("author", "fullname")
    .sort({ createdAt: -1 });

  // Fetch categories
  const categoriesInUse = await NewsModel.distinct("category");

  const categories = await CategoryModel.find({
    _id: { $in: categoriesInUse },
  });
  res.render("search", { news, categories });
};

const author = async (req, res) => {
  // Fetch  news articles
  const news = await NewsModel.find({ author: req.params.id })
    .populate("category", { name: 1, slug: 1 })
    .populate("author", "fullname")
    .sort({ createdAt: -1 });

  // Fetch categories
  const categoriesInUse = await NewsModel.distinct("category");

  const categories = await CategoryModel.find({
    _id: { $in: categoriesInUse },
  });
    const recentPosts = await NewsModel.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .populate("category", "name slug");
  res.render("author", { news, categories, recentPosts });
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
