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
    return res
      .status(500)
      .json({
        message: err.message || "Something went wrong while creating bookmark",
      });
  }
}
module.exports = { addBookmark };
