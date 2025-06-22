import { BarChart3, Filter, Heart, Pen, Plus, Search } from "lucide-react";
import { useSetRecoilState } from "recoil";
import { modalAtom } from "../store/ModalState";
import { Button } from "./Button";
import { Input } from "./Input";
import { ManageCategory } from "./ManageCategory";

export function Main() {
  const setModalOpen = useSetRecoilState(modalAtom);
  return (
    <div className="flex flex-col dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 gap-6 justify-center">
      <div className="flex flex-wrap lg:flex-row gap-4">
        <div className="h-10 w-full lg:flex-1">
          <Input
            startIcon={
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            }
            isLabel={false}
            isFull={false}
            width="w-full lg:flex-1"
            placeholder="Search bookmarks..."
            type="text"
            classes="pl-9 h-full py-2 dark:bg-gray-800"
          />
        </div>
        <div>
          <Button
            type="button"
            size="md"
            text="Favorites Only"
            variant="secondary"
            startIcon={<Heart className="h-4 w-4" />}
          />
        </div>
        <div>
          <Button
            type="button"
            size="md"
            text="View Categories"
            variant="secondary"
            startIcon={<BarChart3 className="h-4 w-4" />}
            onClick={() => setModalOpen({ modal: "category", open: true })}
          />
        </div>
        <div className="flex flex-col relative">
          <Button
            type="button"
            size="md"
            text="Manage Categories"
            variant="secondary"
            startIcon={<Pen className="h-4 w-4" />}
          />
          <ManageCategory/>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => setModalOpen({ modal: "bookmark", open: true })}
            size="md"
            text="Add Bookmark"
            variant="primary"
            startIcon={<Plus className="h-4 w-4" />}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <span className="flex gap-2 dark:text-gray-400 text-gray-600 items-center">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filter:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" text="All" variant="secondary" />
          <Button
            type="button"
            size="sm"
            text="General"
            color="gray"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}
