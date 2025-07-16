import { Plus, Trash2, X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCategoryMutation } from "../queries/categoryQueries";
import { categoryAtom } from "../store/categoryState";
import { manageCategoryAtom } from "../store/ModalState";
import { Button } from "./Button";
import { Input } from "./Input";

export const ManageCategory = () => {
  const { register, handleSubmit, setValue, setFocus } = useForm<{
    categoryName: string;
  }>();
  const setModalOpen = useSetRecoilState(manageCategoryAtom);
  const categories = useRecoilValue(categoryAtom);
  const categoryMutation = useCategoryMutation();
  const addCategory: SubmitHandler<{ categoryName: string }> = (data) => {
    categoryMutation.mutate(
      {
        endpoint: "add",
        method: "POST",
        categoryName: data.categoryName,
      },
      {
        onSuccess: () => {
          setValue("categoryName", "");
          setFocus("categoryName");
        },
      }
    );
  };
  function deleteCategory(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    categoryMutation.mutate({
      endpoint: `delete/${e.currentTarget.id}`,
      method: "DELETE",
    });
  }
  useEffect(() => {
    setFocus("categoryName");
  }, []);
  return (
    <div className="absolute -left-4 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 w-80 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Manage Categories
        </h3>
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => {
            setModalOpen(false);
            setValue("categoryName", "");
          }}
        >
          <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      <form
        onSubmit={handleSubmit(addCategory)}
        className="flex p-3 gap-2 bg-gray-700 rounded-md"
      >
        <Input
          register={{ ...register("categoryName") }}
          type="text"
          placeholder="Category name"
          isLabel={false}
          classes="py-2 px-3 dark:bg-gray-800"
          isFull={false}
          width="w-[85%]"
        />
        <Button
          type="submit"
          size="sm"
          text=""
          classes="border-none rounded-xl h-10"
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
        />
      </form>
      <div className="flex flex-col gap-2 max-h-52 space-y-2 overflow-y-auto p-2">
        {categories.map((category) => (
          <div key={category.id} className="flex justify-between items-center">
            <span className="text-sm dark:text-gray-300 text-gray-700">
              {category.category}
            </span>
            <div className="flex gap-1 items-center">
              {/* <button
                className="dark:text-gray-500 text-gray-400 cursor-pointer p-1"
                id={category.id}
              >
                <Pen
                  className="w-4 h-4"
                  onClick={() => setIsSave({ id: category.id, isSave: true })}
                />
              </button> */}
              <button
                id={category.id}
                className="dark:text-gray-500 text-gray-400 cursor-pointer p-1"
                onClick={deleteCategory}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
