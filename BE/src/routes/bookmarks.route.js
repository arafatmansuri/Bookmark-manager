const { Router } = require("express");
const {
  addBookmark,
  displayAllBookmarks,
  deleteBookmark,
  updateBookmark,
  getBookmarksByCategory,
} = require("../controllers/bookmarks.controller.js");

bookmarkRouter = Router();

bookmarkRouter.route("/add").post(addBookmark);
bookmarkRouter.route("/display").get(displayAllBookmarks);
bookmarkRouter.route("/delete/:id").delete(deleteBookmark);
bookmarkRouter.route("/update/:id").put(updateBookmark);
bookmarkRouter.route("/display/:category").get(getBookmarksByCategory);

module.exports = bookmarkRouter;
