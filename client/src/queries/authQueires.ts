import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { UserData } from "../store/userState";

interface UserFormData {
  data?: { username: string; email?: string; password: string };
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  credentials: boolean;
}
async function authRequest({
  endpoint,
  data,
  credentials,
  method,
}: UserFormData): Promise<UserData> {
  try {
    const response = await axios(`${BACKEND_URL}/user/${endpoint}`, {
      method,
      data,
      withCredentials: credentials,
    });
    return response.data.user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw { message: err.response?.data?.message || "Unknown error" };
  }
}

export const useGetUserQuery = ({
  credentials = true,
  endpoint,
  method,
}: UserFormData) => {
  return useQuery({
    queryKey: ["getuser"],
    queryFn: async () => {
      return authRequest({ endpoint, method, credentials });
    },
    retry: false,
  });
};

export const useAuthMutation = () => {
  return useMutation<UserData,{message:string},UserFormData>({
    mutationKey: ["authMutation"],
    mutationFn: async ({
      method,
      data,
      endpoint,
      credentials,
    }: UserFormData) => {
      return await authRequest({ method, data, endpoint, credentials });
    },
      onError: (error) => {
        if (!error.message) {
          throw new Error("Network Error");
        }
    }
  });
};
