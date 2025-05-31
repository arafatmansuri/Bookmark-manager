import mongoose, { Document, Schema } from "mongoose";

interface IBookmark extends Document {
  url: string;
  category: Schema.Types.ObjectId;
  fav: boolean;
  createdAt: Date;
}

const bookmarkSchema: Schema<IBookmark> = new Schema<IBookmark>({
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const BookmarkModel = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
export default BookmarkModel;
