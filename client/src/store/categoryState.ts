import { atom } from "recoil";

export interface categoryData {
  id: string;
  category: string;
  createdBy: string;
}

export const categoryAtom = atom<categoryData[]>({
  key: "categoryAtom",
  default: [],
});
