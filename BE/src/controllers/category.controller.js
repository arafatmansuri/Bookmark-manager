const { writeFile } = require("../db/fileHandler.js");
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
      id: Date.now(),
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

async function deleteCategory(req, res) {
  try {
    const categoryId = parseInt(req.params.id);
    const users = req.users;
    const userIndex = req.userIndex;
    const categoryIndex = users[userIndex].categories.findIndex(
      (cat) => cat.id == categoryId
    );
    if (categoryIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
    }
    const deletedCategory = users[userIndex].categories[categoryIndex];
    users[userIndex].categories.splice(categoryIndex, 1);
    await writeFile(users);
    return res
      .status(200)
      .json({ message: "Category Deleted successfully", deletedCategory });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong from our side while deleting category",
    });
  }
}

async function updateCategory(req, res) {
  try {
    const newCategoryName = req.body.categoryName;
    const categoryId = req.params.id;
    const users = req.users;
    const userIndex = req.userIndex;
    if (newCategoryName === "") {
      return res
        .status(303)
        .json({ message: "Category name must not be empty" });
    }
    if (
      users[userIndex].categories.find((cat) => cat.category == newCategoryName)
    ) {
      return res.status(302).json({ message: "Category already exists" });
    }
    const categoryIndex = users[userIndex].categories.findIndex(
      (cat) => cat.id == categoryId
    );
    if (categoryIndex == -1) {
      return res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
    }
    users[userIndex].categories[categoryIndex].category = newCategoryName;
    await writeFile(users);
    return res.status(200).json({
      message: "Category updated successfully",
      category: users[userIndex].categories[categoryIndex],
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
  }
}
module.exports = {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
