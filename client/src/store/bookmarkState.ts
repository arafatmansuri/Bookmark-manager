import { atom, selector } from "recoil";
import type { BookmarkData } from "../queries/bookmarkQueries";
import { favoriteAtom, filterAtom, searchFilterAtom } from "./filterState";

export const bookmarkAtom = atom<BookmarkData[]>({
  key: "bookmarkAtom",
  default: [],
});

//done
export const bookmarkFavouriteSelector = selector({
  key: "bookmarkFavouriteSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        !get(filterAtom).category &&
        get(searchFilterAtom) == "" &&
        get(favoriteAtom) &&
        b.fav
    );
  },
});
//done
export const bookmarkCategorySelector = selector({
  key: "bookmarkCategorySelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(filterAtom).category &&
        !get(favoriteAtom) &&
        get(searchFilterAtom) == "" &&
        b.category == get(filterAtom).category
    );
  },
});

//done
export const bookmarkSearchSelector = selector({
  key: "bookmarkSearchSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(searchFilterAtom) != "" &&
        !get(favoriteAtom) &&
        !get(filterAtom).category  &&
        b.title.startsWith(get(searchFilterAtom))
    );
  },
});
export const bookmarkSearchFavSelector = selector({
  key: "bookmarkSearchFavSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(searchFilterAtom) &&
        get(favoriteAtom) &&
        !get(filterAtom).category &&
        b.title.startsWith(get(searchFilterAtom)) &&
        b.fav
    );
  },
});
//done
export const bookmarkSearchAndCategorySelector = selector({
  key: "bookmarkSearchAndCategorySelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(searchFilterAtom).length > 0 &&
        get(filterAtom).category &&
        !get(favoriteAtom) &&
        b.title.startsWith(get(searchFilterAtom)) &&
        b.category == get(filterAtom).category
    );
  },
});
export const bookmarkSearchAndCategoryFavSelector = selector({
  key: "bookmarkSearchAndCategoryFavSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(searchFilterAtom).length > 0 &&
        get(filterAtom).category &&
        get(favoriteAtom) &&
        b.title.startsWith(get(searchFilterAtom)) &&
        b.category == get(filterAtom).category &&
        b.fav
    );
  },
});
//done
export const bookmarkCategoryWithFavFilterSelector = selector({
  key: "bookmarkCategoryWithFavFilterSelector",
  get: ({ get }) => {
    return get(bookmarkAtom).filter(
      (b) =>
        get(favoriteAtom) &&
        get(filterAtom).category &&
        get(searchFilterAtom) == "" &&
        b.fav &&
        b.category == get(filterAtom).category
    );
  },
});
