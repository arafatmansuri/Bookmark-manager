import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
  url: string;
  category: Schema.Types.ObjectId;
  fav?: boolean;
  createdBy: Schema.Types.ObjectId;
}

const bookmarkSchema: Schema<IBookmark> = new Schema<IBookmark>(
  {
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
