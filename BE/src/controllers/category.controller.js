const { readFile, writeFile } = require("../db/fileHandler.js");
async function addCategory(req, res) {
  try {
    const { categoryName } = req.body;
    if (categoryName === "") {
      return res
        .status(303)
        .json({ message: "Category name must not be empty" });
    }
    const userIndex = req.userIndex;
    const users = req.users;
    if (
      users[userIndex].categories.find((cat) => cat.category == categoryName)
    ) {
      return res.status(302).json({ message: "Category already exists" });
    }
    const newCategory = {
      id: new Date(),
      category: categoryName,
    };
    users[userIndex].categories.push(newCategory);
    await writeFile(users);
    return res.status(200).json({
      message: "New category added sucessfully",
      category: newCategory,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
  }
}

async function getAllCategories(req, res) {
  const user = req.user;
  const categories = user.categories;
  return res.status(200).json({
    message: "Categories fetched successfully",
    username: user.username,
    categories,
  });
}

module.exports = { addCategory, getAllCategories };
