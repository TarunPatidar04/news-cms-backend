const { body } = require("express-validator");

const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^\S+$/)
    .withMessage("Username must not contain spaces")
    .isLength({ min: 5, max: 20 })
    .withMessage("Username must be between 5 and 20 characters long"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be between 5 and 20 characters long"),
];

const UserValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .matches(/^\S+$/)
    .withMessage("Full name must not contain spaces")
    .isLength({ min: 5, max: 20 })
    .withMessage("Full name must be between 5 and 20 characters long"),

 body("username")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email address")
  .isLength({ min: 5, max: 50 })
  .withMessage("Email must be between 5 and 50 characters long")
  .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be between 5 and 20 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "author"])
    .withMessage("Role must be either 'admin' or 'author'"),
];

const UserUpdateValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .matches(/^\S+$/)
    .withMessage("Full name must not contain spaces")
    .isLength({ min: 5, max: 20 })
    .withMessage("Full name must be between 5 and 20 characters long"),

  body("password")
    .optional({ checkFalsy:true})
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be between 5 and 20 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "author"])
    .withMessage("Role must be either 'admin' or 'author'"),
];

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 25 })
    .withMessage("Category name must be between 3 and 25 characters long"),

  body("description")
    .optional({ nullable: true })
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
];

const articleValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 30 })
    .withMessage("Title must be between 5 and 30 characters long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),

  body("category").trim().notEmpty().withMessage("Category is required"),
];

module.exports = {
  loginValidation,
  UserValidation,
  UserUpdateValidation,
  categoryValidation,
  articleValidation,
};
