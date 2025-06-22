import { z } from "zod";
import BookmarkModel from "../models/bookmark.model";
import CategoryModel from "../models/category.model";
import { Handler, IBookmark, ICategory, IUserDocument } from "../types";
const bookmarkSchema = z.object({
  bookmarkTitle: z.string(),
  bookmarkUrl: z.string().min(8, { message: "url must be of atleast 8 chars" }),
  category: z.string(),
});
type BookmarkInput = z.infer<typeof bookmarkSchema>;
const addBookmark: Handler = async (req, res): Promise<void> => {
  try {
    const user: IUserDocument = req.user;
    const bookmarkInput = bookmarkSchema.safeParse(req.body);
    if (!bookmarkInput.success) {
      res.status(413).json({
        message:
          bookmarkInput.error.errors[0].message ||
          "Bookmark url must not be empty",
      });
      return;
    }
    const category: ICategory | null = await CategoryModel.findOne<ICategory>({
      $and: [{ _id: bookmarkInput.data.category, createdBy: user?._id }],
    });
    if (!category) {
      res.status(500).json({ message: "Category not found" });
      return;
    }
    const newBookmark: IBookmark = await BookmarkModel.create({
      title: bookmarkInput.data.bookmarkTitle,
      url: bookmarkInput.data.bookmarkUrl,
      category: category._id,
      createdBy: user?._id,
    });
    res
      .status(200)
      .json({ message: "Bookmark created successfully", bookmark:newBookmark });
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
    const user: IUserDocument = req.user;
    const bookmarks: IBookmark[] = await BookmarkModel.find<IBookmark>({
      createdBy: user?._id,
    });
    res.status(200).json({
      message: "Bookmarks fetched successfully",
      user: user?.username,
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
    const bookmark: IBookmark | null =
      await BookmarkModel.findByIdAndDelete<IBookmark>(bookmarkId);
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
    const user: IUserDocument = req.user;
    const bookmarkId = req.params.id;
    const bookmarkInput = bookmarkSchema.safeParse(req.body);
    if (!bookmarkInput.success) {
      res.status(304).json({
        message:
          bookmarkInput.error.errors[0].message ||
          "Bookmark url must not be empty",
      });
      return;
    }
    const category: ICategory | null = await CategoryModel.findOne<ICategory>({
      $and: [{ category: bookmarkInput.data.category, createdBy: user?._id }],
    });
    if (!category) {
      res.status(500).json({ message: "Category not found" });
      return;
    }
    const updatedBookmark: IBookmark | null =
      await BookmarkModel.findByIdAndUpdate<IBookmark>(bookmarkId, {
        $set: {
          title: bookmarkInput.data.bookmarkTitle,
          url: bookmarkInput.data.bookmarkUrl,
          category: category._id,
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
      bookmark:updatedBookmark,
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
    const bookmark: IBookmark | null = await BookmarkModel.findById<IBookmark>(
      bookmarkId
    );
    if (!bookmark) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    bookmark.fav = !bookmark.fav;
    await bookmark.save({ validateBeforeSave: false });
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
    const user: IUserDocument = req.user;
    const bookmarks: IBookmark[] = await BookmarkModel.find<IBookmark>({
      $and: [
        {
          fav: true,
          createdBy: user?._id,
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
