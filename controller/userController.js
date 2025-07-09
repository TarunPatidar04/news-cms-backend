// controller/userController.js
const userModel = require("../models/User");
const newsModel = require("../models/News");
const { validationResult } = require("express-validator");
const categoryModel = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const SettingModel = require("../models/Setting");
const { createError } = require("../utils/errorMessage");
dotenv.config();

// Login route controllers
exports.loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
    errors: [],
  });
};

// Admin login controller
exports.adminLogin = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/login", {
      layout: false,
      errors: errors.array(),
    });
  }
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await userModel.findOne({ username });
    if (!user) {
      return next(createError("User not Found", 404));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError("Invalid User and Password", 401));
    }

    const jwtData = {
      id: user._id,
      fullname: user.fullname,
      role: user.role,
    };
    // Create JWT token
    const token = jwt.sign(jwtData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Logout controller
exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token");
    res.redirect("/admin");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Dashboard controller
exports.dashboard = async (req, res, next) => {
  try {
    let articleCount;
    if (req.role == "author") {
      articleCount = await newsModel.countDocuments({ author: req.id });
    } else {
      articleCount = await newsModel.countDocuments();
    }
    // Fetch any necessary data for the dashboard
    const userCount = await userModel.countDocuments();
    const categoryCount = await categoryModel.countDocuments();

    // Render the dashboard with the fetched data
    res.render("admin/dashboard", {
      role: req.role,
      fullname: req.fullname,
      userCount,
      articleCount,
      categoryCount,
    });
  } catch (error) {
    next(error);
  }
};

// Settings controller
exports.settings = async (req, res, next) => {
  try {
    // Fetch settings from the database
    const settings = await SettingModel.findOne({});
    if (!settings) {
      return res.render("admin/settings", { role: req.role, settings: {} });
    }
    res.render("admin/settings", { role: req.role, settings });
  } catch (error) {
    next(error);
  }
};

// Save settings controller
exports.saveSettings = async (req, res, next) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file ? req.file.filename : null;

  try {
    // Update or create settings in the database
    await SettingModel.findOneAndUpdate(
      {},
      { website_title, footer_description, website_logo },
      { upsert: true, new: true }
    );
    res.redirect("/admin/settings");
  } catch (error) {
    next(error);
  }
};

// User CRUD controllers
exports.allUser = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.render("admin/users", { users, role: req.role });
  } catch (error) {
    next(error);
  }
};

// Add user controllers
exports.addUserPage = async (req, res) => {
  res.render("admin/users/create", { role: req.role, errors: [] });
};

// Add user controller
exports.addUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/users/create", {
      role: req.role,
      errors: errors.array(),
    });
  }
  try {
    await userModel.create(req.body);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

// Update user controllers
exports.updateUserPage = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(createError("User not found", 404));
    }
    res.render("admin/users/update", { user, role: req.role , errors: [] });
  } catch (error) {
    next(error);
  }
};

// Update user controller
exports.updateUser = async (req, res, next) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/users/update", {
      user: req.body,
      role: req.role,
      errors: errors.array(),
    });
  }
  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return next(createError("User not found", 404));
    }

    user.fullname = fullname || user.fullname;

    if (password) {
      user.password = password;
    }

    user.role = role || user.role;

    await user.save();
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

// Delete user controller
exports.deleteUser = async (req, res, next) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};
