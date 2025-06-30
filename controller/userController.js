// controller/userController.js
const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Login route controllers
exports.loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
  });
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
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

exports.dashboard = async (req, res) => {
  res.render("admin/dashboard", { role: req.role, fullname: req.fullname });
};
exports.settings = async (req, res) => {
  res.render("admin/settings", { role: req.role });
};

// User CRUD controllers
exports.allUser = async (req, res) => {
  const users = await userModel.find();
  res.render("admin/users", { users, role: req.role });
};

exports.addUserPage = async (req, res) => {
  res.render("admin/users/create", { role: req.role });
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
    res.render("admin/users/update", { user, role: req.role });
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
