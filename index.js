const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const frontend = require("./routes/frontend");
const admin = require("./routes/admin");
const flash = require("connect-flash");
dotenv.config();

// Middleware
app.use(express.static("public"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(cookieParser());
app.set("layout", "layout");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Set view engine
app.set("view engine", "ejs");

// // Basic route
// app.get("/", (req, res) => {
//   res.send("Express server is running!");
// });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/", frontend);
app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
})
app.use("/admin", admin);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});