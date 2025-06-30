const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/admin");
    }

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.role = tokenData.role;
    req.fullname = tokenData.fullname;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.redirect("/admin");
  }
};

module.exports = isLoggedIn;   
 