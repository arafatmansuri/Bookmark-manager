import { Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useBookamrkMutation } from "../queries/bookmarkQueries";
import { bookmarkAtom } from "../store/bookmarkState";
import { categoryAtom } from "../store/categoryState";
import { modalAtom } from "../store/ModalState";
import { Button } from "./Button";
import { Input } from "./Input";
interface BookmarkFormInput {
  bookmarkTitle: string;
  bookmarkUrl: string;
  category: string;
}
export function UpdateBookmark() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setFocus,
  } = useForm<BookmarkFormInput>();
  const categories = useRecoilValue(categoryAtom);
  const updateBookmarkMutation = useBookamrkMutation();
  const [isModalOpen, setModalOpen] = useRecoilState(modalAtom);
  const [bookmarkParams, setBookmarkParams] = useSearchParams();
  const bookmarks = useRecoilValue(bookmarkAtom);
  const bookmark = bookmarks.filter(
    (bm) => bm.id == bookmarkParams.get("id")
  )[0];
  const addBookmark: SubmitHandler<BookmarkFormInput> = (data) => {
    if (!errors.bookmarkTitle && !errors.bookmarkUrl) {
      updateBookmarkMutation.mutate({
        endpoint: `update/${bookmarkParams.get("id")}`,
        method: "PUT",
        data: data,
      });
    }
  };
  useEffect(() => {
    if (updateBookmarkMutation.status == "success") {
      setModalOpen({ modal: "updateBookmark", open: false });
      //   setValue("bookmarkTitle", "");
      //   setValue("bookmarkUrl", "https://");
      //   setValue(
      //     "category",
      //     categories.filter((c) => c.category == "General")[0]?.id
      //   );
      bookmarkParams.delete("id");
      setBookmarkParams(bookmarkParams);
    }
    if (updateBookmarkMutation.status == "error") {
      console.log(updateBookmarkMutation.error);
    }
  }, [updateBookmarkMutation.status]);
  useEffect(() => {
    setValue(
      "category",
      categories.filter((c) => c.id == bookmark?.category)[0]?.id ||
        categories.filter((c) => c.category == "General")[0]?.id
    );
    setValue("bookmarkUrl", bookmark?.url || "");
    setValue("bookmarkTitle", bookmark?.title || "");
  }, [categories, bookmark]);
  useEffect(() => {
    setFocus("bookmarkTitle");
  }, [isModalOpen]);
  return (
    <div
      className={`${
        isModalOpen.open && isModalOpen.modal == "updateBookmark"
          ? "flex"
          : "hidden"
      } flex-col gap-2 dark:bg-gray-800 bg-white rounded-2xl shadow-2xl max-w-md min-w-[80%] md:min-w-[55%] lg:min-w-[37%] bg-opacity-50 absolute md:top-10`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="font-semibold text-xl">Update Bookmark</h1>
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => {
            setModalOpen({ modal: "updateBookmark", open: false });
            setValue("bookmarkTitle", "");
            setValue("bookmarkUrl", "https://");
            setValue(
              "category",
              categories.filter((c) => c.category == "General")[0]?.id
            );
            bookmarkParams.delete("id");
            setBookmarkParams(bookmarkParams);
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
        {updateBookmarkMutation.isError && (
          <span className="text-red-500">
            {updateBookmarkMutation?.error?.response.data.message}
          </span>
        )}
        <div className="flex gap-2 justify-center items-center">
          <Button
            type="button"
            classes="w-[50%]"
            size="md"
            variant="secondary"
            text="Cancel"
            onClick={() => {
              setModalOpen({ modal: "updateBookmark", open: false });
              bookmarkParams.delete("id");
              setBookmarkParams(bookmarkParams);
            }}
          />
          <Button
            type="submit"
            classes="w-[50%]"
            size="md"
            variant="primary"
            text="Update"
            startIcon={<Save className="h-4 w-4" />}
          />
        </div>
      </form>
    </div>
  );
}
