import { atom } from "recoil";

export const modalAtom = atom<{modal:"bookmark" | "category" | null,open:boolean}>({
    key:"modalAtom",
    default:{modal:null,open:false}
})