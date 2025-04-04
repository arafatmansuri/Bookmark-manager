const { Router } = require("express");
const {
  addBookmark,
  displayAllBookmarks,
  deleteBookmark,
} = require("../controllers/bookmarks.controller.js");

bookmarkRouter = Router();

bookmarkRouter.route("/add").post(addBookmark);
bookmarkRouter.route("/display").get(displayAllBookmarks);
bookmarkRouter.route("/delete/:id").delete(deleteBookmark);

module.exports = bookmarkRouter;
