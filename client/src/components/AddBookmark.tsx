import { Plus, X } from "lucide-react";
import { useRecoilState } from "recoil";
import { modalAtom } from "../store/ModalState";
import { Button } from "./Button";
import { Input } from "./Input";
const options: string[] = ["General", "Work", "Work", "Work", "Work"];
export function AddBookmark() {
  const [isModalOpen, setModalOpen] = useRecoilState(modalAtom);
  return (
    <div
      className={`${
        isModalOpen.open && isModalOpen.modal == "bookmark" ? "flex" : "hidden"
      } flex-col gap-2 dark:bg-gray-800 bg-white rounded-2xl shadow-2xl max-w-md min-w-[37%] bg-opacity-50 absolute`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="font-semibold text-xl">Add New Bookmark</h1>
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setModalOpen({ modal: "bookmark", open: false })}
        >
          <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      <form className="p-6 flex flex-col gap-7">
        <Input
          isLabel={true}
          labelText="Title"
          classes="px-3 py-3 dark:bg-gray-700"
          type="text"
          placeholder="Enter bookmark title"
        />
        <Input
          isLabel={true}
          labelText="URL"
          classes="px-3 py-3 dark:bg-gray-700"
          type="text"
          placeholder="https://example.com"
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-xl bg-white text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 px-2 py-3 dark:bg-gray-700">
            {options.map((opt) => (
              <option value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Button
            type="button"
            classes="w-[50%]"
            size="md"
            variant="secondary"
            text="Cancel"
          />
          <Button
            type="button"
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
