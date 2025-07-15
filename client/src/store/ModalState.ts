import { atom } from "recoil";

export const modalAtom = atom<{
  modal: "bookmark" | "category" | "updateBookmark" | null;
  open: boolean;
}>({
  key: "modalAtom",
  default: { modal: null, open: false },
});

export const manageCategoryAtom = atom({
  key: "manageCategoryAtom",
  default: false,
});

export const isSaveAtom = atom({
  key: "isSave",
  default: { id: "", isSave: false },
});
