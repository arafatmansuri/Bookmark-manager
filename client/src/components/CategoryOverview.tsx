import { BarChart3, Folder, Heart, X } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { bookmarkAtom } from "../store/bookmarkState";
import { categoryAtom } from "../store/categoryState";
import { modalAtom } from "../store/ModalState";
import { TotalCard } from "./TotalCard";

export function CategoryOverview() {
  const [isModalOpen, setModalOpen] = useRecoilState(modalAtom);
  const categories = useRecoilValue(categoryAtom);
  const bookmarks = useRecoilValue(bookmarkAtom);
  return (
    <div
      className={`${
        isModalOpen.open && isModalOpen.modal == "category" ? "flex" : "hidden"
      } bg-white dark:bg-gray-800 rounded-2xl shadow-2xl h-[80vh] overflow-hidden md:min-w-2xl min-w-[90%] flex-col gap-3 pb-6 absolute`}
    >
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <div className="flex gap-3 items-center">
          <div className="p-2 h-10 rounded-lg dark:bg-blue-900">
            <BarChart3 className="w-6 h-6 dark:text-blue-400 text-blue-600" />
          </div>
          <h1 className="font-semibold text-xl">Category Overview</h1>
        </div>
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setModalOpen({ modal: "category", open: false })}
        >
          <X className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
        <div className="flex flex-col md:flex-row gap-6 px-8 py-6">
          <TotalCard
            icon={<Folder />}
            text="Total Bookmarks"
            totalCount={bookmarks.length}
            classes="dark:bg-blue-900 bg-blue-600 dark:text-blue-400 text-blue-100"
            color="dark:bg-blue-900/20 md:w-[50%] dark:text-blue-400 text-blue-600 border-none"
            totalCountStyle="dark:text-blue-400 text-blue-600"
          />
          <TotalCard
            icon={<Heart />}
            text="Total Favourites"
            totalCount={bookmarks.filter((b) => b.fav).length}
            classes="dark:bg-red-900 bg-red-600 dark:text-red-400 text-red-100"
            color="dark:bg-red-900/20 md:w-[50%] dark:text-red-400 text-red-600"
            totalCountStyle="dark:text-red-400 text-red-600"
          />
        </div>
        <div className="flex flex-col px-8 gap-4">
          <h1 className="font-semibold text-lg">Category Breakdown</h1>
          {categories.map((category) => (
            <div
              key={category.id}
              className="dark:bg-gray-700 flex flex-col gap-4 p-4 rounded-xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{category.category}</h3>
                <div className="text-right">
                  <h3 className="font-medium">
                    {bookmarks.filter((b) => b.category == category.id).length}{" "}
                    Bookmarks
                  </h3>
                  <h5 className="text-xs text-gray-400">
                    {
                      bookmarks.filter(
                        (b) => b.category == category.id && b.fav
                      ).length
                    }{" "}
                    Favorites
                  </h5>
                </div>
              </div>
              <div>
                <div className="bg-gray-200 dark:bg-gray-600 h-2 rounded-full mb-1 relative">
                  <div
                    className={`bg-green-600 h-full absolute top-0 z-10 rounded-full`}
                    style={{
                      width:
                        (bookmarks.filter((b) => b.category == category.id)
                          .length /
                          bookmarks.length) *
                          100 +
                        "%",
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400">
                  {(
                    (bookmarks.filter((b) => b.category == category.id)
                      .length /
                      bookmarks.length) *
                    100
                  ).toFixed(2)}
                  % of total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
