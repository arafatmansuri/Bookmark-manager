import { Pen, Plus, Trash2, X } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

export const ManageCategory = () => {
  return (
    <div className="absolute top-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 w-80 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Manage Categories
        </h3>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
          <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      <div className="flex p-3 gap-2 bg-gray-700 rounded-md">
        <Input
          type="text"
          placeholder="Category name"
          isLabel={false}
          classes="py-2 px-3 dark:bg-gray-800"
          isFull={false}
          width="w-[85%]"
        />
        <Button
          type="button"
          size="sm"
          text=""
          variant="primary"
          startIcon={<Plus className="h-5 w-5" />}
        />
      </div>
      <div className="flex flex-col gap-2 max-h-52 space-y-2 overflow-y-auto p-2">
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-gray-300 text-gray-700">
            General
          </span>
          <div className="flex gap-1 items-center">
            <button className="dark:text-gray-500 text-gray-400 cursor-pointer p-1">
              <Pen className="w-4 h-4" />
            </button>
            <button className="dark:text-gray-500 text-gray-400 cursor-pointer p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-gray-300 text-gray-700">
            General
          </span>
          <div className="flex gap-1 items-center">
            <button className="dark:text-gray-500 text-gray-400 cursor-pointer p-1">
              <Pen className="w-4 h-4" />
            </button>
            <button className="dark:text-gray-500 text-gray-400 cursor-pointer p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm dark:text-gray-300 text-gray-700">
            General
          </span>
          <div className="flex gap-1 items-center">
            <button className="dark:text-gray-500 text-gray-400 cursor-pointer p-1">
              <Pen className="w-4 h-4" />
            </button>
            <button className="dark:text-gray-500 text-gray-400 cursor-pointer p-1">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
