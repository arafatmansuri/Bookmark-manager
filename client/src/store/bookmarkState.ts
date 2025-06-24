import { atom, selector } from "recoil";
import type { BookmarkData } from "../queries/bookmarkQueries";
import { favoriteAtom, filterAtom, searchFilterAtom } from "./filterState";

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
    return get(bookmarkAtom).filter(
      (b) => b.category == get(filterAtom).category
    );
  },
});

export const bookmarkSearchSelector = selector({
  key: "bookmarkSearchSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter((b) =>
      b.title.startsWith(get(searchFilterAtom))
    );
  },
});

export const bookmarkSearchAndCategorySelector = selector({
  key: "bookmarkSearchAndCategorySelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        b.title.startsWith(get(searchFilterAtom)) &&
        b.category == get(filterAtom).category
    );
  },
});

export const bookmarkCategoryWithFavFilterSelector = selector({
  key: "bookmarkCategoryWithFavFilterSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(favoriteAtom) &&
        get(searchFilterAtom) == "" &&
        b.fav &&
        b.category == get(filterAtom).category
    );
  },
});
