import { atom } from "recoil";
import type { BookmarkData } from "../queries/bookmarkQueries";

export const bookmarkAtom = atom<BookmarkData[]>({
  key: "bookmarkAtom",
  default: [],
});
