import { atom } from "recoil";

export interface UserData {
  id: string;
  username: string;
  password: string;
  email: string;
  refreshToken?: string;
}

export const userAtom = atom<UserData | null>({
    key:"userAtom",
    default:null
})