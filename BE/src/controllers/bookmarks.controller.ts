import { writeFile } from "../db/fileHandler";
import { BookmarkType, CategoryType, Handler, Schema } from "../types";
const addBookmark: Handler = async (req, res) => {
  try {
    const { bookmarkUrl, category }: { bookmarkUrl: string; category: string } =
      req.body;
    if ([bookmarkUrl, category].some((feild) => feild === "")) {
      return res
        .status(304)
        .json({ message: "Bookmark url must not be empty" });
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    if (
      !users[userIndex].categories.find(
        (cat: CategoryType) => cat.category === category
      )
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    const newBookmark: BookmarkType = {
      id: Date.now(),
      url: bookmarkUrl,
      category: category,
      fav: false,
      createdAt: new Date(),
    };
    users[userIndex].bookmarks.push(newBookmark);
    await writeFile(users);
    return res
      .status(200)
      .json({ message: "Bookmark created successfully", newBookmark });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
  }
};
const displayAllBookmarks: Handler = (req, res) => {
  const user: Schema = req.user;
  const bookmarks: BookmarkType[] = user.bookmarks;
  return res.status(200).json({
    message: "Bookmarks fetched successfully",
    user: user.username,
    bookmarks,
  });
};
const deleteBookmark: Handler = async (req, res) => {
  try {
    const bookmarkId: number = Number(req.params.id);
    if ([bookmarkId].some((feild) => feild === null)) {
      return res
        .status(304)
        .json({ message: "Bookmark url must not be empty" });
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    const bookmarkIndex: number = users[userIndex].bookmarks.findIndex(
      (bm: BookmarkType) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
    }
    const deletedBookmark: BookmarkType =
      users[userIndex].bookmarks[bookmarkIndex];
    users[userIndex].bookmarks.splice(bookmarkIndex, 1);
    await writeFile(users);
    return res
      .status(200)
      .json({ message: "Bookmark deleted successfully", deletedBookmark });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
  }
};
const updateBookmark: Handler = async (req, res) => {
  try {
    const bookmarkId: number = Number(req.params.id);
    const { newUrl, newCategory }: { newUrl: string; newCategory: string } =
      req.body;
    if ([bookmarkId, newUrl, newCategory].some((feild) => feild === "")) {
      return res.status(304).json({ message: "All fields are required" });
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    if (
      !users[userIndex].categories.find(
        (cat: CategoryType) => cat.category === newCategory
      )
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    const bookmarkIndex: number = users[userIndex].bookmarks.findIndex(
      (bm: BookmarkType) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
    }
    users[userIndex].bookmarks[bookmarkIndex].url = newUrl;
    users[userIndex].bookmarks[bookmarkIndex].category = newCategory;
    await writeFile(users);
    return res.status(200).json({
      message: "Bookmark updated successfully",
      updatedBookmark: users[userIndex].bookmarks[bookmarkIndex],
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
  }
};
const getBookmarksByCategory: Handler = async (req, res) => {
  try {
    const category: string = req.params.category;
    if ([category].some((feild) => feild === "")) {
      return res.status(304).json({ message: "All fields are required" });
    }
    const user: Schema = req.user;
    if (
      !user.categories.find((cat: CategoryType) => cat.category === category) &&
      category !== "All"
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    let bookmarks: BookmarkType[] = [];
    if (category === "All") {
      bookmarks = user.bookmarks;
    } else {
      bookmarks = user.bookmarks.filter(
        (bm: BookmarkType) => bm.category === category
      );
    }
    return res.status(200).json({
      message: `Bookmarks fetched for ${category} category`,
      bookmarks,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
  }
};
const changeFavourites: Handler = async (req, res) => {
  try {
    const bookmarkId: number = Number(req.params.id);
    if ([bookmarkId].some((feild) => feild === null || undefined)) {
      return res.status(304).json({ message: "All fields are required" });
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    const bookmarkIndex: number = users[userIndex].bookmarks.findIndex(
      (bm: BookmarkType) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
    }
    users[userIndex].bookmarks[bookmarkIndex].fav =
      !users[userIndex].bookmarks[bookmarkIndex].fav;
    await writeFile(users);
    return res.status(200).json({
      message: `Favourite status changed to ${users[userIndex].bookmarks[bookmarkIndex].fav}`,
      bookmark: users[userIndex].bookmarks[bookmarkIndex],
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
  }
};
const displayFavourite: Handler = async (req, res) => {
  const user: Schema = req.user;
  const bookmarks = user.bookmarks.filter(
    (bm: BookmarkType) => bm.fav === true
  );
  return res
    .status(200)
    .json({ message: "Favourites fetched successfully", bookmarks });
};
export {
  addBookmark,
  changeFavourites,
  deleteBookmark,
  displayAllBookmarks,
  displayFavourite,
  getBookmarksByCategory,
  updateBookmark,
};
