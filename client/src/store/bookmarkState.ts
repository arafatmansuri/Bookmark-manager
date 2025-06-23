import { atom, selector } from "recoil";
import type { BookmarkData } from "../queries/bookmarkQueries";
import { filterAtom } from "./filterState";

export const bookmarkAtom = atom<BookmarkData[]>({
  key: "bookmarkAtom",
  default: [],
});

export const bookmarkFavouriteSelector = selector({
  key: "bookmarkFavouriteSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter((b) => b.fav);
  },
});

export const bookmarkCategorySelector = selector({
  key: "bookmarkCategorySelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter((b) => b.category == get(filterAtom).category);
  },
});
