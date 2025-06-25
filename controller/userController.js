// controller/userController.js
const userModel = require("../models/User");

// Login route controllers
exports.loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
  });
};

exports.adminLogin = async (req, res) => {};

exports.logout = async (req, res) => {};

exports.dashboard = async (req, res) => {
  res.render("admin/dashboard");
};
exports.settings = async (req, res) => {
  res.render("admin/settings");
};

// User CRUD controllers
exports.allUser = async (req, res) => {
  res.render("admin/users");
};

exports.addUserPage = async (req, res) => {
  res.render("admin/users/create");
};

exports.addUser = async (req, res) => {};

exports.updateUserPage = async (req, res) => {
  res.render("admin/users/update");
};

exports.updateUser = async (req, res) => {
};

exports.deleteUser = async (req, res) => {
};
