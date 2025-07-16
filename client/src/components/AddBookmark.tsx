import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { useBookamrkMutation } from "../queries/bookmarkQueries";
import { categoryAtom } from "../store/categoryState";
import { modalAtom } from "../store/ModalState";
import { Button } from "./Button";
import { Input } from "./Input";
interface BookmarkFormInput {
  bookmarkTitle: string;
  bookmarkUrl: string;
  category: string;
}
export function AddBookmark() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setFocus,
  } = useForm<BookmarkFormInput>();
  const categories = useRecoilValue(categoryAtom);
  const addBookmarkMutation = useBookamrkMutation();
  const [isModalOpen, setModalOpen] = useRecoilState(modalAtom);
  const addBookmark: SubmitHandler<BookmarkFormInput> = (data) => {
    if (!errors.bookmarkTitle && !errors.bookmarkUrl) {
      addBookmarkMutation.mutate({
        endpoint: "add",
        method: "POST",
        data: data,
      });
    }
  };
  useEffect(() => {
    if (addBookmarkMutation.status == "success") {
      setModalOpen({ modal: "bookmark", open: false });
      setValue("bookmarkTitle", "");
      setValue("bookmarkUrl", "https://");
      setValue(
        "category",
        categories.filter((c) => c.category == "General")[0]?.id
      );
    }
    if (addBookmarkMutation.status == "error") {
      console.log(addBookmarkMutation.error);
    }
  }, [addBookmarkMutation.status]);
  useEffect(() => {
    setValue(
      "category",
      categories.filter((c) => c.category == "General")[0]?.id
    );
    setValue("bookmarkUrl", "https://");
  }, [categories]);
  useEffect(() => {
    setFocus("bookmarkTitle");
  }, [isModalOpen]);
  return (
    <div
      className={`${
        isModalOpen.open && isModalOpen.modal == "bookmark" ? "flex" : "hidden"
      } flex-col gap-2 dark:bg-gray-800 bg-white rounded-2xl shadow-2xl max-w-md min-w-[80%] md:min-w-[55%] lg:min-w-[37%] bg-opacity-50 absolute md:top-10`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="font-semibold text-xl">Add New Bookmark</h1>
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => {
            setModalOpen({ modal: "bookmark", open: false });
            setValue("bookmarkTitle", "");
            setValue("bookmarkUrl", "https://");
            setValue(
              "category",
              categories.filter((c) => c.category == "General")[0]?.id
            );
          }}
        >
          <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      <form
        onSubmit={handleSubmit(addBookmark)}
        className="p-6 flex flex-col gap-7"
      >
        <div className="flex flex-col gap-2">
          <Input
            isFocus={true}
            register={{ ...register("bookmarkTitle", { required: true }) }}
            isLabel={true}
            labelText="Title"
            classes="px-3 py-3 dark:bg-gray-700"
            type="text"
            placeholder="Enter bookmark title"
          />
          {errors.bookmarkTitle && (
            <span className="text-red-500">Title is required</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            register={{ ...register("bookmarkUrl", { required: true }) }}
            isLabel={true}
            labelText="URL"
            classes="px-3 py-3 dark:bg-gray-700"
            type="text"
            placeholder="https://example.com"
          />
          {errors.bookmarkUrl && (
            <span className="text-red-500">URL is required</span>
          )}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl bg-white text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-2 py-3 dark:bg-gray-700"
            {...register("category")}
          >
            {categories.map((opt) => (
              <option value={opt.id} key={opt.id}>
                {opt.category}
              </option>
            ))}
          </select>
        </div>
        {addBookmarkMutation.isError && (
          <span className="text-red-500">
            {addBookmarkMutation?.error?.response.data.message}
          </span>
        )}
        <div className="flex gap-2 justify-center items-center">
          <Button
            type="button"
            classes="w-[50%]"
            size="md"
            variant="secondary"
            text="Cancel"
            onClick={() => setModalOpen({ modal: "bookmark", open: false })}
          />
          <Button
            type="submit"
            classes="w-[50%]"
            size="md"
            variant="primary"
            text="Add"
            startIcon={<Plus className="h-4 w-4" />}
          />
        </div>
      </form>
    </div>
  );
}
