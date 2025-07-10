const express = require("express");
const {
  index,
  articalByCategory,
  singleArticle,
  search,
  author,
  addComment,
} = require("../controller/sideController");
const router = express.Router();

router.get("/", index);
router.get("/category/:name", articalByCategory);
router.get("/single/:id", singleArticle);
router.get("/search", search);
router.get("/author/:id", author);
router.post("/single/:id", addComment);

module.exports = router;
