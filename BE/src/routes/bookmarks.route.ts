import { Router } from "express";
import {
  addBookmark,
  changeFavourites,
  deleteBookmark,
  displayAllBookmarks,
  displayFavourite,
  getBookmarksByCategory,
  updateBookmark,
} from "../controllers/bookmarks.controller";

const bookmarkRouter = Router();

bookmarkRouter.route("/add").post(addBookmark);
bookmarkRouter.route("/display").get(displayAllBookmarks);
bookmarkRouter.route("/delete/:id").delete(deleteBookmark);
bookmarkRouter.route("/update/:id").put(updateBookmark);
bookmarkRouter.route("/display/:category").get(getBookmarksByCategory);
bookmarkRouter.route("/changefav/:id").put(changeFavourites);
bookmarkRouter.route("/displayfav").get(displayFavourite);

export default bookmarkRouter;
