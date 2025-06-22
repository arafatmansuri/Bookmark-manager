import { atom } from "recoil";

export interface categoryData {
  _id: string;
  category: string;
  createdBy: string;
  _v: number;
}

export const categoryAtom = atom<categoryData[]>({
  key: "categoryAtom",
  default: [],
});
