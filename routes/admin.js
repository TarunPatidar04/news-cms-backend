const express = require("express");
const {
  loginPage,
  adminLogin,
  logout,
  allUser,
  addUserPage,
  addUser,
  updateUserPage,
  updateUser,
  deleteUser,
  dashboard,
  settings,
} = require("../controller/userController");
const {
  allCategory,
  addCategoryPage,
  addCategory,
  updateCategoryPage,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle,
} = require("../controller/articleController");
const { allComments } = require("../controller/commentController");
const isLoggedIn = require("../middleware/isLoggedin");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

//login route
router.get("/", loginPage);
router.post("/index", adminLogin);
router.get("/logout", logout);
router.get("/dashboard", isLoggedIn, dashboard);
router.get("/settings", isLoggedIn, isAdmin, settings);

//user CRUD route
router.get("/users", isLoggedIn, isAdmin, allUser);
router.get("/add-user", isLoggedIn, isAdmin, addUserPage);
router.post("/add-user", isLoggedIn, isAdmin, addUser);
router.get("/update-user/:id", isLoggedIn, isAdmin, updateUserPage);
router.post("/update-user/:id", isLoggedIn, isAdmin, updateUser);
router.get("/delete-user/:id", isLoggedIn, isAdmin, deleteUser);

//category CRUD route
router.get("/category", isLoggedIn, isAdmin, allCategory);
router.get("/add-category", isLoggedIn, isAdmin, addCategoryPage);
router.post("/add-category", isLoggedIn, isAdmin, addCategory);
router.get("/update-category/:id", isLoggedIn, isAdmin, updateCategoryPage);
router.post("/update-category/:id", isLoggedIn, isAdmin, updateCategory);
router.get("/delete-category/:id", isLoggedIn, isAdmin, deleteCategory);

//Article CRUD route
router.get("/article", isLoggedIn, allArticle);
router.get("/add-article", isLoggedIn, addArticlePage);
router.post("/add-article", isLoggedIn, addArticle);
router.get("/update-article/:id", isLoggedIn, updateArticlePage);
router.post("/update-article/:id", isLoggedIn, updateArticle);
router.get("/delete-article/:id", isLoggedIn, deleteArticle);

//Comment  route
router.get("/comments", isLoggedIn, allComments);

module.exports = router;
