const newsModel = require("../models/News");
const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const fs = require("fs");
const path = require("path");
const { createError } = require("../utils/errorMessage");
const { validationResult } = require("express-validator");

exports.allArticle = async (req, res, next) => {
  try {
    let articles;
    if (req.role === "admin") {
      articles = await newsModel
        .find()
        .populate("author", "fullname")
        .populate("category", "name");
    } else {
      articles = await newsModel
        .find({ author: req.id })
        .populate("author", "fullname")
        .populate("category", "name");
    }
    res.render("admin/articles", { role: req.role, articles });
  } catch (error) {
    // console.error(error);
    next(error);
  }
};

exports.addArticlePage = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/articles/create", {
    role: req.role,
    categories,
    errors: [],
  });
};

exports.addArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await categoryModel.find();
    return res.render("admin/articles/create", {
      categories,
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    console.log("article", req.body);
    const { title, content, category } = req.body;

    const article = new newsModel({
      title,
      content,
      category,
      author: req.id,
      image: req.file.filename,
    });
    await article.save();
    res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};

exports.updateArticlePage = async (req, res, next) => {
  try {
    const article = await newsModel
      .findById(req.params.id)
      .populate("category", "name")
      .populate("author", "fullname");

    if (!article) {
      // return res.status(404).send("Article not found");
      // const error = new Error("Article not found");
      // error.status = 404;
      // return next(error);
      return next(createError("Article not found", 404));
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return next(
          createError("You are not authorized to update this article", 401)
        );
      }
    }
    const categories = await categoryModel.find();
    res.render("admin/articles/update", {
      role: req.role,
      article,
      categories,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const categories = await categoryModel.find();
    return res.render("admin/articles/update", {
      categories,
      article: req.body,
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError("Article not found", 404));
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return next(
          createError("You are not authorized to update this article", 401)
        );
      }
    }
    article.title = title;
    article.content = content;
    article.category = category;

    if (req.file) {
      // Delete the old image if it exists
      if (article.image) {
        const oldImagePath = path.join(
          __dirname,
          "../public/uploads",
          article.image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      article.image = req.file.filename;
    }

    await article.save();
    res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError("Article not found", 404));
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return next(
          createError("You are not authorized to update this article", 401)
        );
      }
    }
    // Delete the image file if it exists
    if (article.image) {
      const imagePath = path.join(
        __dirname,
        "../public/uploads",
        article.image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await article.deleteOne();
    res.redirect("/admin/article");
  } catch (error) {
    next(error);
  }
};
