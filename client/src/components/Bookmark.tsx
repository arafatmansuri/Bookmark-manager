import { Clock, Copy, ExternalLink, Heart, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useBookamrkMutation } from "../queries/bookmarkQueries";
import { categoryAtom } from "../store/categoryState";
import { modalAtom } from "../store/ModalState";
type category = {
  id: string;
  category: string;
  authorId: string;
  createdAt: null | string;
  updatedAt: null | string;
};
interface BookmarkProps {
  id: string;
  title: string;
  url: string;
  date: Date;
  category?: category;
  fav?: boolean;
}
const monthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function BookmarkCard({
  category,
  date,
  title,
  url,
  id,
  fav = false,
}: BookmarkProps) {
  const bookmarkMutation = useBookamrkMutation();
  const categories = useRecoilValue(categoryAtom);
  const setUpdateBookmark = useSetRecoilState(modalAtom);
  const [bookmarkParams, setBookmarkParams] = useSearchParams();
  function deleteBookmark(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    bookmarkMutation.mutate({
      method: "DELETE",
      endpoint: `delete/${e.currentTarget.id}`,
    });
  }
  function toggleFavorite(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    bookmarkMutation.mutate({
      method: "PUT",
      endpoint: `changefav/${e.currentTarget.id}`,
    });
  }
  useEffect(() => {
    if (bookmarkMutation.status == "success") {
      console.log("Bookmark Deleted");
    }
  }, [bookmarkMutation.status]);
  return (
    <div className="flex flex-col gap-7 justify-end dark:bg-gray-800 rounded-md px-6 py-6 hover:-translate-y-1 transition-transform duration-300 delay-50 dark:border-gray-700 border border-gray-300">
      <div>
        {categories.find((c) => c.id == category?.id)?.category && (
          <div
            className={`flex gap-2 mb-4 py-0.5 px-3 text-sm rounded-full w-fit bg-gray-500`}
          >
            {categories.find((c) => c.id == category?.id)?.category}
          </div>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
        <h4 className="text-sm dark:text-gray-400 text-gray-500">{url}</h4>
      </div>
      <span className="text-xs dark:text-gray-500 text-gray-400 flex items-center gap-1">
        <Clock className="h-3 w-3" /> Created {monthName[date.getMonth()]}{" "}
        {date.getDate()}, {date.getFullYear()}, {date.getHours()}:
        {date.getMinutes()} {date.getHours() > 12 ? "PM" : "AM"}
      </span>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 in-hover:cursor-pointer">
          <Heart
            className={`h-4 w-4 ${
              fav ? "text-red-500" : "text-gray-500 bg-transparent"
            }`}
            fill={fav ? "red" : "none"}
            id={id}
            onClick={toggleFavorite}
          />{" "}
          <Copy
            className="h-4 w-4 text-gray-500"
            onClick={() => {
              navigator.clipboard.writeText(url);
            }}
          />{" "}
          <a target="_blank" href={url}>
            <ExternalLink className="h-4 w-4 text-gray-500" />
          </a>
        </div>
        <div className="flex gap-4 in-hover:cursor-pointer">
          <Pencil
            className="h-4 w-4 text-gray-500"
            onClick={() => {
              bookmarkParams.set("id", id);
              setBookmarkParams(bookmarkParams);
              setUpdateBookmark({ modal: "updateBookmark", open: true });
            }}
          />{" "}
          <Trash2
            className="h-4 w-4 text-gray-500"
            id={id}
            onClick={deleteBookmark}
          />{" "}
        </div>
      </div>
    </div>
  );
}
