import { z } from "zod";
import { PrismaClient } from "../../generated/prisma";
import BookmarkModel from "../models/bookmark.model";
import CategoryModel from "../models/category.model";
import { Handler, IBookmark, ICategory } from "../types";
const prisma = new PrismaClient();
const bookmarkSchema = z.object({
  bookmarkTitle: z
    .string()
    .min(3, { message: "title must be atleast 3 chars" }),
  bookmarkUrl: z.string().min(8, { message: "url must be of atleast 8 chars" }),
  category: z.string(),
});
type BookmarkInput = z.infer<typeof bookmarkSchema>;
const addBookmark: Handler = async (req, res): Promise<void> => {
  try {
    const user = req.user;
    const bookmarkInput = bookmarkSchema.safeParse(req.body);
    if (!bookmarkInput.success) {
      res.status(413).json({
        message:
          bookmarkInput.error.errors[0].message ||
          "Bookmark url must not be empty",
      });
      return;
    }
    // const category: ICategory | null = await CategoryModel.findOne<ICategory>({
    //   $and: [{ _id: bookmarkInput.data.category, createdBy: user?._id }],
    // });
    const category = await prisma.category.findFirst({
      where: {
        AND: [{ id: bookmarkInput.data.category }, { authorId: user?.id }],
      },
    });
    if (!category) {
      res.status(500).json({ message: "Category not found" });
      return;
    }
    // const newBookmark: IBookmark = await BookmarkModel.create({
    //   title: bookmarkInput.data.bookmarkTitle,
    //   url: bookmarkInput.data.bookmarkUrl,
    //   category: category._id,
    //   createdBy: user?._id,
    // });
    const newBookmark = await prisma.bookmarks.create({
      data: {
        title: bookmarkInput.data.bookmarkTitle,
        url: bookmarkInput.data.bookmarkUrl,
        category: {
          connect: { id: category.id },
        },
        createdBy: {
          connect: { id: user?.id },
        },
      },
    });
    res.status(200).json({
      message: "Bookmark created successfully",
      bookmark: newBookmark,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
const displayAllBookmarks: Handler = async (req, res): Promise<void> => {
  try {
    const user = req.user;
    // const bookmarks: IBookmark[] = await BookmarkModel.find<IBookmark>({
    //   createdBy: user?.id,
    // });
    const bookmarks = await prisma.bookmarks.findMany({
      where: { authorId: user?.id },
    });
    res.status(200).json({
      message: "Bookmarks fetched successfully",
      bookmarks,
    });
    return;
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
};
const deleteBookmark: Handler = async (req, res): Promise<void> => {
  try {
    const bookmarkId = req.params.id;
    // const bookmark: IBookmark | null =
    //   await BookmarkModel.findByIdAndDelete<IBookmark>(bookmarkId);
    const bookmark = await prisma.bookmarks.delete({
      where: { id: bookmarkId },
    });
    if (!bookmark) {
      res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
      return;
    }
    res
      .status(200)
      .json({ message: "Bookmark deleted successfully", bookmark });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
const updateBookmark: Handler = async (req, res): Promise<void> => {
  try {
    const user = req.user;
    const bookmarkId = req.params.id;
    const bookmarkInput = bookmarkSchema.safeParse(req.body);
    if (!bookmarkInput.success) {
      res.status(400).json({
        message:
          bookmarkInput.error.issues[0].message ||
          "Bookmark url must not be empty",
      });
      return;
    }
    // const category: ICategory | null = await CategoryModel.findById<ICategory>(
    //   bookmarkInput.data.category
    // );
    const category = await prisma.category.findFirst({
      where: { id: bookmarkInput.data.category },
    });
    if (!category) {
      res.status(500).json({ message: "Category not found" });
      return;
    }
    // const updatedBookmark: IBookmark | null =
    //   await BookmarkModel.findByIdAndUpdate<IBookmark>(bookmarkId, {
    //     $set: {
    //       title: bookmarkInput.data.bookmarkTitle,
    //       url: bookmarkInput.data.bookmarkUrl,
    //       category: category._id,
    //     },
    //   });
    const updatedBookmark = await prisma.bookmarks.update({
      where: { id: bookmarkId },
      data: {
        title: bookmarkInput.data.bookmarkTitle,
        url: bookmarkInput.data.bookmarkUrl,
        category: { connect: { id: category.id } },
      },
    });
    if (!updatedBookmark) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    res.status(200).json({
      message: "Bookmark updated successfully",
      bookmark: updatedBookmark,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
const getBookmarksByCategory: Handler = async (req, res): Promise<void> => {
  try {
    const categoryId = req.params.id;
    const category: ICategory | null = await CategoryModel.findById<ICategory>(
      categoryId
    );
    if (!category) {
      res.status(500).json({ message: "Category not found" });
      return;
    }
    let bookmarks: IBookmark[] = await BookmarkModel.find<IBookmark>({
      category: category._id,
    });
    if (!bookmarks) {
      res.status(404).json({ message: "No bookmarks found for this category" });
      return;
    }
    res.status(200).json({
      message: `Bookmarks fetched for ${category.category} category`,
      bookmarks,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
const changeFavourites: Handler = async (req, res): Promise<void> => {
  try {
    const bookmarkId = req.params.id;
    if ([bookmarkId].some((feild) => feild === null || undefined)) {
      res.status(304).json({ message: "All fields are required" });
      return;
    }
    // const bookmark: IBookmark | null = await BookmarkModel.findById<IBookmark>(
    //   bookmarkId
    // );
    const bookmark = await prisma.bookmarks.findFirst({
      where: { id: bookmarkId },
      include: { category: true },
    });
    if (!bookmark) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    await prisma.bookmarks.update({
      where: { id: bookmarkId },
      data: { fav: !bookmark.fav },
    });
    res.status(200).json({
      message: `Favourite status changed success`,
      bookmark,
    });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
const displayFavourite: Handler = async (req, res): Promise<void> => {
  try {
    const user = req.user;
    const bookmarks: IBookmark[] = await BookmarkModel.find<IBookmark>({
      $and: [
        {
          fav: true,
          createdBy: user?.id,
        },
      ],
    });
    if (!bookmarks) {
      res.status(404).json({ message: "Favourites is empty" });
      return;
    }
    res
      .status(200)
      .json({ message: "Favourites fetched successfully", bookmarks });
    return;
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
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
