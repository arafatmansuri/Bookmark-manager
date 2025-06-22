import { z } from "zod";
import CategoryModel from "../models/category.model";
import { Handler, ICategory, IUserDocument } from "../types";
const str = z
  .string()
  .min(3, { message: "Cateory name must contain atleast 3 char" });
const addCategory: Handler = async (req, res): Promise<void> => {
  try {
    const parsedData = str.safeParse(req.body.categoryName);
    if (!parsedData.success) {
      res.status(303).json({
        message:
          parsedData.error.errors[0].message ||
          "Category name must not be empty",
      });
      return;
    }
    const user: IUserDocument = req.user;
    const category: ICategory | null =
      await CategoryModel.findOne<ICategory>({
        $and: [{ category: parsedData.data, createdBy: user?._id }],
      });
    if (category) {
      res.status(302).json({ message: "Category already exists" });
      return;
    }
    const newCategory: ICategory = await CategoryModel.create({
      category: parsedData.data,
      createdBy: user?._id,
    });
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
  try {
    const user:IUserDocument = req.user;
    const categories: ICategory[] = await CategoryModel.find<ICategory>({ createdBy: user?._id });
    res.status(200).json({
      message: "Categories fetched successfully",
      username: user?.username,
      categories,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
};

const deleteCategory: Handler = async (req, res): Promise<void> => {
  try {
    const categoryId = req.params.id;
    const category: ICategory | null = await CategoryModel.findByIdAndDelete<ICategory>(
      categoryId
    );
    if (!category) {
      res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
      return;
    }
    res
      .status(200)
      .json({ message: "Category Deleted successfully", category });
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
    const categoryId = req.params.id;
    const user:IUserDocument = req.user;
    const parsedData = str.safeParse(req.body.newCategoryName);
    if (!parsedData.success) {
      res.status(303).json({
        message:
          parsedData.error.errors[0].message ||
          "Category name must not be empty",
      });
      return;
    }
    const category: ICategory | null = await CategoryModel.findOne<ICategory>({
      $and: [{ category: parsedData.data, createdBy: user?._id }],
    });
    if (category) {
      res.status(404).json({
        message: "given category already exist",
      });
      return;
    }
    const updatedCategory: ICategory | null =
      await CategoryModel.findByIdAndUpdate<ICategory>(
        categoryId,
        {
          $set: {
            category: parsedData.data,
          },
        },
        { new: true }
      );
    if (!updatedCategory) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    res.status(200).json({
      message: "Category updated successfully",
      category:updatedCategory,
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
