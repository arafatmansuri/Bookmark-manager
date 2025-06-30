import { Bookmark, Heart, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  AddBookmark,
  CategoryOverview,
  Header,
  Main,
  TotalCard,
  UpdateBookmark,
} from "../components";
import BookmarksContainer from "../components/BookmarksContainer";
import { useAuthMutation, useGetUserQuery } from "../queries/authQueires";
import {
  useBookmarkQuery,
  type BookmarkData,
} from "../queries/bookmarkQueries";
import { useCategoryQuery } from "../queries/categoryQueries";
import { bookmarkAtom } from "../store/bookmarkState";
import { categoryAtom } from "../store/categoryState";
import { modalAtom } from "../store/ModalState";
import { userAtom } from "../store/userState";

function Dashboard() {
  const isRefreshed = useRef<boolean>(false);
  const isModalOpen = useRecoilValue(modalAtom);
  const setUser = useSetRecoilState(userAtom);
  const [bookmarks, setBookmarks] = useRecoilState(bookmarkAtom);
  const [categories, setCategories] = useRecoilState(categoryAtom);
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
  const categoryQuery = useCategoryQuery();
  const refreshTokenMutation = useAuthMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (userQuery.status == "success") {
      setUser(userQuery.data);
    }
    if (
      (userQuery.status == "error" ||
        bookmarkQuery.status == "error" ||
        categoryQuery.status == "error") &&
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
    isRefreshed.current,
    refreshTokenMutation,
    bookmarkQuery.status,
    categoryQuery.status,
  ]);
  useEffect(() => {
    if (bookmarkQuery.status == "success") {
      setBookmarks(bookmarkQuery.data.bookmarks);
    }
  }, [bookmarkQuery.data?.bookmarks, bookmarkQuery.status]);
  useEffect(() => {
    if (categoryQuery.status == "success") {
      setCategories(categoryQuery.data);
    }
  }, [categoryQuery.status, categoryQuery.data]);
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
            totalCount={categories.length}
            classes="dark:bg-green-800 bg-green-600 dark:text-green-400 text-green-100"
          />
        </div>
        <Main />
        <BookmarksContainer />
      </div>
      <AddBookmark />
      <UpdateBookmark />
      <CategoryOverview />
    </div>
  );
}

export default Dashboard;
