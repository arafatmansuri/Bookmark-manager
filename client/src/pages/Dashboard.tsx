import { Bookmark, Heart, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  AddBookmark,
  BookmarkCard,
  CategoryOverview,
  Header,
  Main,
  NoBookmarks,
  TotalCard,
} from "../components";
import { useAuthMutation, useGetUserQuery } from "../queries/authQueires";
import {
  useBookmarkQuery,
  type BookmarkData,
} from "../queries/bookmarkQueries";
import { useCategoryQuery } from "../queries/categoryQueries";
import {
  bookmarkAtom,
  bookmarkCategorySelector,
  bookmarkCategoryWithFavFilterSelector,
  bookmarkFavouriteSelector,
  bookmarkSearchAndCategorySelector,
  bookmarkSearchSelector,
} from "../store/bookmarkState";
import { categoryAtom } from "../store/categoryState";
import {
  favoriteAtom,
  filterAtom,
  searchFilterAtom,
} from "../store/filterState";
import { modalAtom } from "../store/ModalState";
import { userAtom } from "../store/userState";

function Dashboard() {
  const isRefreshed = useRef<boolean>(false);
  const isModalOpen = useRecoilValue(modalAtom);
  const setUser = useSetRecoilState(userAtom);
  const [bookmarks, setBookmarks] = useRecoilState(bookmarkAtom);
  const bookmarkFavSelector = useRecoilValue(bookmarkFavouriteSelector);
  const bookmarkCatSelector = useRecoilValue(bookmarkCategorySelector);
  const [categories, setCategories] = useRecoilState(categoryAtom);
  const [isFave, setIsFav] = useRecoilState(favoriteAtom);
  const categoryFilter = useRecoilValue(filterAtom);
  const searchFilter = useRecoilValue(searchFilterAtom);
  const searchBookmarkSelector = useRecoilValue(bookmarkSearchSelector);
  const searchAndCategoryBookmarkSelector = useRecoilValue(
    bookmarkSearchAndCategorySelector
  );
  const catWithFavFilter = useRecoilValue(
    bookmarkCategoryWithFavFilterSelector
  );
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
        <span className=" text-gray-400">
          Showing{" "}
          <span>
            {!isFave && !categoryFilter.category && bookmarks.length}
            {isFave && !categoryFilter.category && bookmarkFavSelector.length}
            {categoryFilter.category && !isFave && bookmarkCatSelector.length}
            {categoryFilter.category &&
              isFave &&
              bookmarkCatSelector.filter((b) => b.fav).length}
          </span>{" "}
          of {bookmarks.length} bookmarks
        </span>
        {bookmarks.length <= 0 ? (
          <NoBookmarks />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* {//All Bookmarks no filters} */}
            {!isFave &&
              !categoryFilter.category &&
              searchFilter == "" &&
              bookmarks.map((bookmark) => (
                <BookmarkCard
                  fav={bookmark.fav}
                  id={bookmark._id}
                  date={new Date(bookmark.createdAt)}
                  title={bookmark.title}
                  url={bookmark.url}
                  key={bookmark._id}
                  category={bookmark.category}
                />
              ))}
            {/* {//Only Favourites with all Categories and no search} */}
            {isFave &&
              !categoryFilter.category &&
              searchFilter == "" &&
              bookmarkFavSelector.map((bookmark) => (
                <BookmarkCard
                  fav={bookmark.fav}
                  id={bookmark._id}
                  date={new Date(bookmark.createdAt)}
                  title={bookmark.title}
                  url={bookmark.url}
                  key={bookmark._id}
                  category={bookmark.category}
                />
              ))}
            {/* {//Only Specific Category wihout Favourites and no search} */}
            {categoryFilter.category &&
              !isFave &&
              searchFilter == "" &&
              bookmarkCatSelector.map((bookmark) => (
                <BookmarkCard
                  fav={bookmark.fav}
                  id={bookmark._id}
                  date={new Date(bookmark.createdAt)}
                  title={bookmark.title}
                  url={bookmark.url}
                  key={bookmark._id}
                  category={bookmark.category}
                />
              ))}
            {/* {// Specific Category with Favourites, no Search} */}
            {catWithFavFilter.length > 0 &&
              catWithFavFilter.map((bookmark) => (
                <BookmarkCard
                  fav={bookmark.fav}
                  id={bookmark._id}
                  date={new Date(bookmark.createdAt)}
                  title={bookmark.title}
                  url={bookmark.url}
                  key={bookmark._id}
                  category={bookmark.category}
                />
              ))}
            {/* {// Only search with All Bookmarks, no filter} */}
            {searchFilter &&
              !isFave &&
              !categoryFilter.category &&
              searchBookmarkSelector.map((bookmark) => (
                <BookmarkCard
                  fav={bookmark.fav}
                  id={bookmark._id}
                  date={new Date(bookmark.createdAt)}
                  title={bookmark.title}
                  url={bookmark.url}
                  key={bookmark._id}
                  category={bookmark.category}
                />
              ))}
            {/* {// Search with Favourites} */}
            {searchFilter &&
              isFave &&
              searchBookmarkSelector
                .filter((b) => b.fav)
                .map((bookmark) => (
                  <BookmarkCard
                    fav={bookmark.fav}
                    id={bookmark._id}
                    date={new Date(bookmark.createdAt)}
                    title={bookmark.title}
                    url={bookmark.url}
                    key={bookmark._id}
                    category={bookmark.category}
                  />
                ))}
            {/* {//Search with Specific Category} */}
            {searchFilter &&
              categoryFilter.category &&
              searchAndCategoryBookmarkSelector.map((bookmark) => (
                <BookmarkCard
                  fav={bookmark.fav}
                  id={bookmark._id}
                  date={new Date(bookmark.createdAt)}
                  title={bookmark.title}
                  url={bookmark.url}
                  key={bookmark._id}
                  category={bookmark.category}
                />
              ))}
          </div>
        )}
      </div>
      <AddBookmark />
      <CategoryOverview />
    </div>
  );
}

export default Dashboard;
