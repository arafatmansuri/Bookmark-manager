import { atom } from "recoil";

export interface UserData {
  _id: string;
  username: string;
  password: string;
  email: string;
  refreshToken?: string;
  _v: number;
}

export const userAtom = atom<UserData | null>({
    key:"userAtom",
    default:null
})