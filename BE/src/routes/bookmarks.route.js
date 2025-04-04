const { Router } = require("express");
const { addBookmark } = require("../controllers/bookmarks.controller.js");

bookmarkRouter = Router();

bookmarkRouter.route("/add").post(addBookmark);

module.exports = bookmarkRouter;
