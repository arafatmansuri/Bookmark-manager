import { writeFile } from "../db/fileHandler";
import { CategoryType, Handler, Schema } from "../types";
const addCategory: Handler = async (req, res): Promise<void> => {
  try {
    const { categoryName } = req.body;
    if (categoryName === "") {
      res.status(303).json({ message: "Category name must not be empty" });
      return;
    }
    const userIndex: number = req.userIndex;
    const users: Schema[] = req.users;
    if (
      users[userIndex].categories.find(
        (cat: CategoryType) => cat.category == categoryName
      )
    ) {
      res.status(302).json({ message: "Category already exists" });
      return;
    }
    const newCategory: CategoryType = {
      id: Number(new Date()),
      category: categoryName,
    };
    users[userIndex].categories.push(newCategory);
    await writeFile(users);
    res.status(200).json({
      message: "New category added sucessfully",
      category: newCategory,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
};

const getAllCategories: Handler = async (req, res): Promise<void> => {
  const user: Schema = req.user;
  const categories: CategoryType[] = user.categories;
  res.status(200).json({
    message: "Categories fetched successfully",
    username: user.username,
    categories,
  });
};

const deleteCategory: Handler = async (req, res): Promise<void> => {
  try {
    const categoryId: number = parseInt(req.params.id);
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    const categoryIndex: number = users[userIndex].categories.findIndex(
      (cat: CategoryType) => cat.id == categoryId
    );
    if (categoryIndex == -1) {
      res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
      return;
    }
    const deletedCategory: CategoryType =
      users[userIndex].categories[categoryIndex];
    users[userIndex].categories.splice(categoryIndex, 1);
    await writeFile(users);
    res
      .status(200)
      .json({ message: "Category Deleted successfully", deletedCategory });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong from our side while deleting category",
    });
    return;
  }
};

const updateCategory: Handler = async (req, res): Promise<void> => {
  try {
    const newCategoryName: string = req.body.categoryName;
    const categoryId: number = Number(req.params.id);
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    if (newCategoryName === "") {
      res.status(303).json({ message: "Category name must not be empty" });
      return;
    }
    if (
      users[userIndex].categories.find(
        (cat: CategoryType) => cat.category == newCategoryName
      )
    ) {
      res.status(302).json({ message: "Category already exists" });
      return;
    }
    const categoryIndex: number = users[userIndex].categories.findIndex(
      (cat: CategoryType) => cat.id == categoryId
    );
    if (categoryIndex == -1) {
      res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
      return;
    }
    users[userIndex].categories[categoryIndex].category = newCategoryName;
    await writeFile(users);
    res.status(200).json({
      message: "Category updated successfully",
      category: users[userIndex].categories[categoryIndex],
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
export { addCategory, deleteCategory, getAllCategories, updateCategory };
