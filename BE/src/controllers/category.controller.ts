import { z } from "zod";
import { PrismaClient } from "../../generated/prisma";
import { Handler } from "../types";
const prisma = new PrismaClient();
const str = z
  .string()
  .min(3, { message: "Cateory name must contain atleast 3 char" });
const addCategory: Handler = async (req, res): Promise<void> => {
  try {
    const parsedData = str.safeParse(req.body.categoryName);
    if (!parsedData.success) {
      res.status(403).json({
        message:
          parsedData.error.issues[0].message ||
          "Category name must not be empty",
      });
      return;
    }
    const user = req.user;
    const category = await prisma.category.findFirst({
      where: { AND: [{ category: parsedData.data }, { authorId: user?.id }] },
    });
    if (category) {
      res.status(402).json({ message: "Category already exists" });
      return;
    }
    const newCategory = await prisma.category.create({
      data: {
        category: parsedData.data,
        createdBy: {
          connect: { id: user?.id },
        },
      },
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
    const user = req.user;
    const categories = await prisma.category.findMany({
      where: { authorId: user?.id },
    });
    res.status(200).json({
      message: "Categories fetched successfully",
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
    const category = await prisma.category.delete({
      where: { id: categoryId },
    });
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
    const user = req.user;
    const parsedData = str.safeParse(req.body.newCategoryName);
    if (!parsedData.success) {
      res.status(303).json({
        message:
          parsedData.error.errors[0].message ||
          "Category name must not be empty",
      });
      return;
    }
    const category = await prisma.category.findFirst({
      where: { AND: [{ category: parsedData.data }, { authorId: user?.id }] },
    });
    if (category) {
      res.status(404).json({
        message: "given category already exist",
      });
      return;
    }
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { category: parsedData.data },
    });
    if (!updatedCategory) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
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
