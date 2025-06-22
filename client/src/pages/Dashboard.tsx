import { Bookmark, Heart, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  AddBookmark,
  BookmarkCard,
  CategoryOverview,
  Header,
  Main,
  TotalCard,
} from "../components";
import { useAuthMutation, useGetUserQuery } from "../queries/authQueires";
import {
  useBookmarkQuery,
  type BookmarkData,
} from "../queries/bookmarkQueries";
import { bookmarkAtom } from "../store/bookmarkState";
import { modalAtom } from "../store/ModalState";
import { userAtom } from "../store/userState";

function Dashboard() {
  const isRefreshed = useRef<boolean>(false);
  const setUser = useSetRecoilState(userAtom);
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalAtom);
  const [bookmarks, setBookmarks] = useRecoilState(bookmarkAtom);
  const userQuery = useGetUserQuery({
    credentials: true,
    endpoint: "getuser",
    method: "GET",
  });
  const bookmarkQuery = useBookmarkQuery<{
    user: string;
    bookmarks: BookmarkData[];
  }>({
    endpoint: "display",
    method: "GET",
  });
  const refreshTokenMutation = useAuthMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (userQuery.status == "success") {
      console.log(userQuery.data);
      setUser(userQuery.data);
    }
    if (
      userQuery.status == "error" &&
      userQuery.error?.response.status == 401 &&
      !isRefreshed.current
    ) {
      isRefreshed.current = true;
      refreshTokenMutation.mutate(
        {
          credentials: true,
          endpoint: "refreshtoken",
          method: "POST",
        },
        {
          onSuccess: () => {
            userQuery.refetch();
          },
          onError: () => {
            navigate("/signin");
          },
        }
      );
    }
  }, [
    userQuery.status,
    userQuery.error?.response.status,
    isRefreshed.current,
    refreshTokenMutation,
  ]);
  useEffect(() => {
    if (bookmarkQuery.status == "success") {
      console.log(bookmarkQuery.data);
      setBookmarks(bookmarkQuery.data.bookmarks);
    }
  }, [bookmarkQuery.status]);
  return (
    <div className={`p-8 flex items-center justify-center`}>
      <div
        className={`flex flex-col gap-10 ${
          isModalOpen.open ? "opacity-60" : "opacity-100"
        }`}
      >
        <Header />
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          <TotalCard
            icon={<Bookmark />}
            text="Total Bookmarks"
            totalCount={bookmarks.length}
            classes="dark:bg-blue-800 bg-blue-600 dark:text-blue-400 text-blue-100"
          />
          <TotalCard
            icon={<Heart />}
            text="Favorites"
            totalCount={bookmarks.filter((bm) => bm.fav).length}
            classes="dark:bg-red-800 bg-red-600 dark:text-red-400 text-red-100"
          />
          <TotalCard
            icon={<Search />}
            text="Categories"
            totalCount={1}
            classes="dark:bg-green-800 bg-green-600 dark:text-green-400 text-green-100"
          />
        </div>
        <Main />
        <span className=" text-gray-400">
          Showing 0 of {bookmarks.length} bookmarks
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              date={new Date(bookmark.createdAt)}
              title={bookmark.title}
              url={bookmark.url}
              key={bookmark._id}
            />
          ))}
        </div>
      </div>
      <AddBookmark />
      <CategoryOverview />
    </div>
  );
}

export default Dashboard;
