// controller/userController.js
const userModel = require("../models/User");
const newsModel = require("../models/News");
const { validationResult } = require("express-validator");
const categoryModel = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
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
exports.adminLogin = async (req, res,next) => {
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
    var settings = await SettingModel.findOne({});
    if (!settings) {
      settings = new SettingModel();
    }

    settings.website_title = website_title;
    settings.footer_description = footer_description;

    if (website_logo) {
      if (settings.website_logo) {
        const logoPath = `./public/uploads/${settings.website_logo}`;
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath); // Delete the old logo file
        }
      }
      settings.website_logo = website_logo;
    }

    await settings.save();
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
    res.render("admin/users/update", { user, role: req.role, errors: [] });
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
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return next(createError("User not found", 404));
    }
    // Check if the user is associated with any news articles
    const articles = await newsModel.find({ author: id });
    if (articles.length > 0) {
      return res
        .status(400)
        .send("User cannot be deleted as it is associated with news articles.");
    }
    await user.deleteOne();

    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};
