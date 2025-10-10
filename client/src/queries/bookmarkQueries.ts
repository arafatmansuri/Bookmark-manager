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
type category = {
  id: string;
  category: string;
  authorId: string;
  createdAt: null | string;
  updatedAt: null | string;
};
export interface BookmarkData {
  id: string;
  title: string;
  url: string;
  category: category;
  fav?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
const bookmarkRequest = async <T>({
  endpoint,
  method,
  data,
}: BookmarkInput): Promise<T> => {
  try {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err:any) {
    throw { message: err.response?.data?.message || "Unknown error" };
  }
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

// export const useBookamrkMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation<BookmarkData | { message: string }>(
//     async ({ endpoint, method, data }: BookmarkInput) => {
//       return await bookmarkRequest<BookmarkData | { message: string }>({
//         endpoint,
//         method,
//         data,
//       });
//     })
// };
export const useBookamrkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<BookmarkData,{ message: string },BookmarkInput>({
    mutationKey: ["bookmarkMutation"],
    mutationFn: async ({ endpoint, method, data }: BookmarkInput) => {
      return await bookmarkRequest<BookmarkData>({
        endpoint,
        method,
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark"] });
    },
  });
};
