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
  const users = await userModel.find();
  res.render("admin/users", { users });
};

exports.addUserPage = async (req, res) => {
  res.render("admin/users/create");
};

exports.addUser = async (req, res) => {
  // res.render("index")
  // const { fullname, username, password, role } = req.body;
  try {
    await userModel.create(req.body);
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateUserPage = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("admin/users/update", { user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateUser = async (req, res) => {
  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.fullname = fullname || user.fullname;

    if (password) {
      user.password = password;
    }

    user.role = role || user.role;

    await user.save();
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
};
