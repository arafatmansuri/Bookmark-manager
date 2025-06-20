import { BookmarkIcon, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <div className="flex gap-3">
        <div className="p-3 bg-blue-600 rounded-2xl flex items-center">
          <BookmarkIcon className="h-8 w-8 text-white" />
        </div>
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmark Manager
          </h1>
          <h4 className="text-gray-600 dark:text-gray-400">
            Organize and manage your bookmarks
          </h4>
        </div>
      </div>
      <div className="flex gap-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 p-2 items-center cursor-pointer">
        <div className="rounded-full bg-blue-600 w-12 h-12 font-medium flex items-center justify-center">
          DA
        </div>
        <div>
          <h3 className="font-medium">Demo User</h3>
          <h5 className="text-gray-400 text-xs">mansurianas@mail.com</h5>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
      </div>
    </header>
  );
}
