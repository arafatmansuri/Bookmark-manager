import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface BookmarkInput {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: { bookmarkTitle: string; bookmarkUrl: string; category: string };
}

export interface BookmarkData {
  _id: string;
  title: string;
  url: string;
  category: string;
  fav?: boolean;
  createdBy: string;
  _v: number;
  createdAt: string;
  updatedAt: string;
}
const bookmarkRequest = async <T>({
  endpoint,
  method,
  data,
}: BookmarkInput): Promise<T> => {
  const response = await axios(`${BACKEND_URL}/bookmark/${endpoint}`, {
    method,
    data,
    withCredentials: true,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (endpoint == "display") {
    return response.data;
  }
  if (method == "GET" && endpoint != "display") {
    return response.data.bookmarks;
  }
  return response.data.bookmark;
};
export const useBookmarkQuery = <T>({
  endpoint,
  method,
}: BookmarkInput): UseQueryResult<T, unknown> => {
  return useQuery({
    queryKey: ["bookmark"],
    queryFn: async () => {
      return await bookmarkRequest<T>({ endpoint, method });
    },
    retry: false,
  });
};

export const useBookamrkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["bookmarkMutation"],
    mutationFn: async ({ endpoint, method, data }: BookmarkInput) => {
      return await bookmarkRequest<BookmarkData>({ endpoint, method, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark"] });
    },
  });
};
