const { writeFile } = require("../db/fileHandler.js");
async function addBookmark(req, res) {
  try {
    const { bookmarkUrl, category } = req.body;
    if ([bookmarkUrl, category].some((feild) => feild === "")) {
      return res
        .status(304)
        .json({ message: "Bookmark url must not be empty" });
    }
    const users = req.users;
    const userIndex = req.userIndex;
    if (!users[userIndex].categories.find((cat) => cat.category === category)) {
      return res.status(404).json({ message: "Category not found" });
    }
    const newBookmark = {
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
}
async function displayAllBookmarks(req, res) {
  const user = req.user;
  const bookmarks = user.bookmarks;
  return res.status(200).json({
    message: "Bookmarks fetched successfully",
    user: user.username,
    bookmarks,
  });
}
async function deleteBookmark(req, res) {
  try {
    const bookmarkId = Number(req.params.id);
    if ([bookmarkId].some((feild) => feild === "")) {
      return res
        .status(304)
        .json({ message: "Bookmark url must not be empty" });
    }
    const users = req.users;
    const userIndex = req.userIndex;
    const bookmarkIndex = users[userIndex].bookmarks.findIndex(
      (bm) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
    }
    const deletedBookmark = users[userIndex].bookmarks[bookmarkIndex];
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
}
async function updateBookmark(req, res) {
  try {
    const bookmarkId = Number(req.params.id);
    const { newUrl, newCategory } = req.body;
    if ([bookmarkId, newUrl, newCategory].some((feild) => feild === "")) {
      return res.status(304).json({ message: "All fields are required" });
    }
    const users = req.users;
    const userIndex = req.userIndex;
    if (
      !users[userIndex].categories.find((cat) => cat.category === newCategory)
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    const bookmarkIndex = users[userIndex].bookmarks.findIndex(
      (bm) => bm.id === bookmarkId
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
}
async function getBookmarksByCategory(req, res) {
  try {
    const category = req.params.category;
    if ([category].some((feild) => feild === "")) {
      return res.status(304).json({ message: "All fields are required" });
    }
    const user = req.user;
    if (
      !user.categories.find((cat) => cat.category === category) &&
      !category === "All"
    ) {
      return res.status(404).json({ message: "Category not found" });
    }
    let bookmarks = [];
    if (category === "All") {
      bookmarks = user.bookmarks;
    } else {
      bookmarks = user.bookmarks.filter((bm) => bm.category === category);
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
}
async function changeFavourites(req, res) {
  try {
    const bookmarkId = Number(req.params.id);
    if ([bookmarkId].some((feild) => feild === "")) {
      return res.status(304).json({ message: "All fields are required" });
    }
    const users = req.users;
    const userIndex = req.userIndex;
    const bookmarkIndex = users[userIndex].bookmarks.findIndex(
      (bm) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
    }
    if (users[userIndex].bookmarks[bookmarkIndex].fav) {
      users[userIndex].bookmarks[bookmarkIndex].fav = false;
    } else {
      users[userIndex].bookmarks[bookmarkIndex].fav = true;
    }
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
}
module.exports = {
  addBookmark,
  displayAllBookmarks,
  deleteBookmark,
  updateBookmark,
  getBookmarksByCategory,
  changeFavourites,
};
