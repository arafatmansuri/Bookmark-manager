import { atom } from "recoil";

export const favoriteAtom = atom({
  key: "favoriteAtom",
  default: false,
});

export const filterAtom = atom<{ category: string | null }>({
  key: "filterAtom",
  default: { category: null },
});

export const searchFilterAtom = atom({
  key: "searchFilterAtom",
  default: "",
});
