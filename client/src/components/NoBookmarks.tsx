import { Bookmark, Plus } from "lucide-react";
import { useSetRecoilState } from "recoil";
import { modalAtom } from "../store/ModalState";
import { Button } from "./Button";

export function NoBookmarks() {
  const setModalOpen = useSetRecoilState(modalAtom);
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full inline-block mb-4">
        <Bookmark className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h1 className="font-semibold md:text-xl text-lg">No bookmarks yet</h1>
      <p className="text-gray-400 md:w-96 text-sm text-center">
        Start by adding your first bookmark to organize your favorite websites.
      </p>
      <Button
        type="button"
        size="lg"
        variant="primary"
        text="Add Your First Bookmark"
        startIcon={<Plus className="w-5 h-5" />}
        classes="mt-3"
        onClick={() => setModalOpen({ modal: "bookmark", open: true })}
      />
    </div>
  );
}
