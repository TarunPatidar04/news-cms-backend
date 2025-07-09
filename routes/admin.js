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
  saveSettings,
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
const upload = require("../middleware/multer");
const {
  loginValidation,
  UserValidation,
  UserUpdateValidation,
  categoryValidation,
  articleValidation,
} = require("../middleware/validation");
const router = express.Router();

//login route
router.get("/", loginPage);
router.post("/index", loginValidation, adminLogin);
router.get("/logout", logout);
router.get("/dashboard", isLoggedIn, dashboard);
router.get("/settings", isLoggedIn, isAdmin, settings);
router.post(
  "/save-settings",
  isLoggedIn,
  isAdmin,
  upload.single("website_logo"),
  saveSettings
);

//user CRUD route
router.get("/users", isLoggedIn, isAdmin, allUser);
router.get("/add-user", isLoggedIn, isAdmin, addUserPage);
router.post("/add-user", isLoggedIn, isAdmin, UserValidation, addUser);
router.get("/update-user/:id", isLoggedIn, isAdmin, updateUserPage);
router.post(
  "/update-user/:id",
  isLoggedIn,
  isAdmin,
  UserUpdateValidation,
  updateUser
);
router.get("/delete-user/:id", isLoggedIn, isAdmin, deleteUser);

//category CRUD route
router.get("/category", isLoggedIn, isAdmin, allCategory);
router.get("/add-category", isLoggedIn, isAdmin, addCategoryPage);
router.post(
  "/add-category",
  isLoggedIn,
  isAdmin,
  categoryValidation,
  addCategory
);
router.get("/update-category/:id", isLoggedIn, isAdmin, updateCategoryPage);
router.post(
  "/update-category/:id",
  isLoggedIn,
  isAdmin,
  categoryValidation,
  updateCategory
);
router.get("/delete-category/:id", isLoggedIn, isAdmin, deleteCategory);

//Article CRUD route
router.get("/article", isLoggedIn, allArticle);
router.get("/add-article", isLoggedIn, addArticlePage);
router.post(
  "/add-article",
  isLoggedIn,
  upload.single("image"),
  articleValidation,
  addArticle
);
router.get("/update-article/:id", isLoggedIn, updateArticlePage);
router.post(
  "/update-article/:id",
  isLoggedIn,
  upload.single("image"),
  articleValidation,
  updateArticle
);
router.get("/delete-article/:id", isLoggedIn, deleteArticle);

//Comment  route
router.get("/comments", isLoggedIn, allComments);

// 404 middleware
router.use(isLoggedIn, (req, res, next) => {
  res.status(404).render("admin/404", {
    message: "Page Not Found",
    role: req.role,
  });
});

//500 / 404 error handling middleware
router.use(isLoggedIn, (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  // const view = statusCode === 404 ? "admin/404" : "admin/500";
  switch (statusCode) {
    case 401:
      view = "admin/401";
      break;
    case 404:
      view = "admin/404";
      break;
    case 500:
      view = "admin/500";
      break;
    default:
      view = "admin/500";
  }
  res.status(statusCode).render(view, {
    message: err.message || "Something went wrong",
    role: req.role,
  });
});

// router.use(isLoggedIn, (err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).render("admin/500", {
//     message: err.message || "Internal Server Error",
//     role: req.role,
//   });
// });

module.exports = router;
