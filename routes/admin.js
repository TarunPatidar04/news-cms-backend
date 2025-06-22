const express = require("express");
const { loginPage, adminLogin, logout, allUser, addUserPage, addUser, updateUserPage, updateUser, deleteUser } = require("../controller/userController");
const { allCategory, addCategoryPage, addCategory, updateCategoryPage, updateCategory, deleteCategory } = require("../controller/categoryController");
const { allArticle, addArticlePage, addArticle, updateArticlePage, updateArticle, deleteArticle } = require("../controller/articleController");
const { allComments } = require("../controller/commentController");
const router = express.Router();

//login route
router.get("/", loginPage);
router.post("/index", adminLogin);
router.post("/logout", logout);

//user CRUD route
router.get("/users", allUser);
router.get("/add-user", addUserPage);
router.post("/add-user", addUser);
router.get("/update-user/:id", updateUserPage);
router.post("/update-user/:id", updateUser);
router.get("/delete-user/:id", deleteUser);

//category CRUD route
router.get("/category", allCategory);
router.get("/add-category", addCategoryPage);
router.post("/add-category", addCategory);
router.get("/update-category/:id", updateCategoryPage);
router.post("/update-category/:id", updateCategory);
router.get("/delete-category/:id", deleteCategory);

//Article CRUD route
router.get("/article", allArticle);
router.get("/add-article", addArticlePage);
router.post("/add-article", addArticle);
router.get("/update-article/:id", updateArticlePage);
router.post("/update-article/:id", updateArticle);
router.get("/delete-article/:id", deleteArticle);

//Comment  route
router.get("/comments", allComments);

module.exports = router;
