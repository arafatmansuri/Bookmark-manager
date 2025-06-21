import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../types";

const bookmarkSchema: Schema<IBookmark> = new Schema<IBookmark>(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    fav: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const BookmarkModel = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
export default BookmarkModel;
