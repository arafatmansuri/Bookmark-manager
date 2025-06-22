import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { categoryData } from "../store/categoryState";

interface CategoryInput {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  categoryName?: string;
}

const categoryRequest = async <T>({
  method,
  endpoint,
  categoryName,
}: CategoryInput): Promise<T> => {
  const category = await axios(`${BACKEND_URL}/category/${endpoint}`, {
    method,
    data: {
      categoryName,
    },
    withCredentials: true,
  });
  if (endpoint == "display") {
    return category.data.categories;
  }
  return category.data.category;
};

export const useCategoryQuery = () => {
  return useQuery({
    queryKey: ["getCategoriesQuery"],
    queryFn: async () => {
      return await categoryRequest<categoryData[]>({
        method: "GET",
        endpoint: "display",
      });
    },
    retry: false,
  });
};

export const useCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["categoryMutation"],
    mutationFn: async ({ method, endpoint, categoryName }: CategoryInput) => {
      return await categoryRequest<categoryData>({
        method,
        endpoint,
        categoryName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCategoriesQuery"] });
    },
  });
};
