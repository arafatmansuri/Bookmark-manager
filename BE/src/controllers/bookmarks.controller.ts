import { z } from "zod";
import { writeFile } from "../db/fileHandler";
import { BookmarkType, CategoryType, Handler, Schema } from "../types";
const bookmarkSchema = z.object({
  bookmarkUrl: z.string().min(8, { message: "url must be of atleast 8 chars" }),
  category: z.string(),
});
type BookmarkInput = z.infer<typeof bookmarkSchema>;
const addBookmark: Handler = async (req, res): Promise<void> => {
  try {
    const bookmarkInput = bookmarkSchema.safeParse(req.body);
    if (bookmarkInput.error) {
      res.status(304).json({
        message:
          bookmarkInput.error.message || "Bookmark url must not be empty",
      });
      return;
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    if (
      !users[userIndex].categories.find(
        (cat: CategoryType) => cat.category === bookmarkInput.data.category
      )
    ) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    const newBookmark: BookmarkType = {
      id: Date.now(),
      url: bookmarkInput.data.bookmarkUrl,
      category: bookmarkInput.data.category,
      fav: false,
      createdAt: new Date(),
    };
    users[userIndex].bookmarks.push(newBookmark);
    await writeFile(users);
    res
      .status(200)
      .json({ message: "Bookmark created successfully", newBookmark });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating bookmark",
    });
    return;
  }
};
const displayAllBookmarks: Handler = (req, res): void => {
  const user: Schema = req.user;
  const bookmarks: BookmarkType[] = user.bookmarks;
  res.status(200).json({
    message: "Bookmarks fetched successfully",
    user: user.username,
    bookmarks,
  });
  return;
};
const deleteBookmark: Handler = async (req, res): Promise<void> => {
  try {
    const bookmarkId: number = Number(req.params.id);
    if ([bookmarkId].some((feild) => feild === null)) {
      res.status(304).json({ message: "Bookmark url must not be empty" });
      return;
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    const bookmarkIndex: number = users[userIndex].bookmarks.findIndex(
      (bm: BookmarkType) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      res.status(500).json({
        message:
          "Something went wrong from our side while deleting category,Id not found",
      });
      return;
    }
    const deletedBookmark: BookmarkType =
      users[userIndex].bookmarks[bookmarkIndex];
    users[userIndex].bookmarks.splice(bookmarkIndex, 1);
    await writeFile(users);
    res
      .status(200)
      .json({ message: "Bookmark deleted successfully", deletedBookmark });
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
    const bookmarkId: number = Number(req.params.id);
    const bookmarkInput = bookmarkSchema.safeParse(req.body);
    if (bookmarkInput.error) {
      res.status(304).json({
        message:
          bookmarkInput.error.message || "Bookmark url must not be empty",
      });
      return;
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    if (
      !users[userIndex].categories.find(
        (cat: CategoryType) => cat.category === bookmarkInput.data.category
      )
    ) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    const bookmarkIndex: number = users[userIndex].bookmarks.findIndex(
      (bm: BookmarkType) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    users[userIndex].bookmarks[bookmarkIndex].url =
      bookmarkInput.data.bookmarkUrl;
    users[userIndex].bookmarks[bookmarkIndex].category =
      bookmarkInput.data.category;
    await writeFile(users);
    res.status(200).json({
      message: "Bookmark updated successfully",
      updatedBookmark: users[userIndex].bookmarks[bookmarkIndex],
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
    const category: string = req.params.category;
    if ([category].some((feild) => feild === "")) {
      res.status(304).json({ message: "All fields are required" });
      return;
    }
    const user: Schema = req.user;
    if (
      !user.categories.find((cat: CategoryType) => cat.category === category) &&
      category !== "All"
    ) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    let bookmarks: BookmarkType[] = [];
    if (category === "All") {
      bookmarks = user.bookmarks;
    } else {
      bookmarks = user.bookmarks.filter(
        (bm: BookmarkType) => bm.category === category
      );
    }
    res.status(200).json({
      message: `Bookmarks fetched for ${category} category`,
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
    const bookmarkId: number = Number(req.params.id);
    if ([bookmarkId].some((feild) => feild === null || undefined)) {
      res.status(304).json({ message: "All fields are required" });
      return;
    }
    const users: Schema[] = req.users;
    const userIndex: number = req.userIndex;
    const bookmarkIndex: number = users[userIndex].bookmarks.findIndex(
      (bm: BookmarkType) => bm.id === bookmarkId
    );
    if (bookmarkIndex == -1) {
      res.status(500).json({
        message:
          "Something went wrong from our side while updating category,Id not found",
      });
      return;
    }
    users[userIndex].bookmarks[bookmarkIndex].fav =
      !users[userIndex].bookmarks[bookmarkIndex].fav;
    await writeFile(users);
    res.status(200).json({
      message: `Favourite status changed to ${users[userIndex].bookmarks[bookmarkIndex].fav}`,
      bookmark: users[userIndex].bookmarks[bookmarkIndex],
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
  const user: Schema = req.user;
  const bookmarks = user.bookmarks.filter(
    (bm: BookmarkType) => bm.fav === true
  );
  res
    .status(200)
    .json({ message: "Favourites fetched successfully", bookmarks });
  return;
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
