const newsModel = require("../models/News");
const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const fs = require("fs");
const path = require("path");



exports.allArticle = async (req, res) => {
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
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.addArticlePage = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/articles/create", { role: req.role, categories });
};

exports.addArticle = async (req, res) => {
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
    res.status(500).send("Article not saved ");
  }
};

exports.updateArticlePage = async (req, res) => {
  try {
    const article = await newsModel
      .findById(req.params.id)
      .populate("category", "name")
      .populate("author", "fullname");

    if (!article) {
      return res.status(404).send("Article not found");
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return res
          .status(403)
          .send("You are not authorized to update this article");
      }
    }
    const categories = await categoryModel.find();
    res.render("admin/articles/update", {
      role: req.role,
      article,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.updateArticle = async (req, res) => {
  const id = req.params.id;
  try {
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      return res.status(400).send("Article not found");
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return res
          .status(403)
          .send("You are not authorized to update this article");
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
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteArticle = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return res.status(400).send("Article not found");
    }
    if (req.role == "author") {
      if (req.id != article.author._id) {
        return res
          .status(403)
          .send("You are not authorized to update this article");
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
    console.error(error);
    res.status(500).send("Server Error");
  }
};
