import { useRecoilValue } from "recoil";
import {
  bookmarkAtom,
  bookmarkCategorySelector,
  bookmarkCategoryWithFavFilterSelector,
  bookmarkFavouriteSelector,
  bookmarkSearchAndCategoryFavSelector,
  bookmarkSearchAndCategorySelector,
  bookmarkSearchFavSelector,
  bookmarkSearchSelector,
} from "../store/bookmarkState";
import {
  favoriteAtom,
  filterAtom,
  searchFilterAtom,
} from "../store/filterState";
import { BookmarkCard } from "./Bookmark";
import { NoBookmarks } from "./NoBookmarks";

function BookmarksContainer() {
  const isFave = useRecoilValue(favoriteAtom);
  const searchFilter = useRecoilValue(searchFilterAtom);
  const categoryFilter = useRecoilValue(filterAtom);
  const bookmarks = useRecoilValue(bookmarkAtom);
  const searchBookmarkSelector = useRecoilValue(bookmarkSearchSelector);
  const searchFavSelector = useRecoilValue(bookmarkSearchFavSelector);
  const searchFavCatSelector = useRecoilValue(
    bookmarkSearchAndCategoryFavSelector
  );
  const searchAndCategoryBookmarkSelector = useRecoilValue(
    bookmarkSearchAndCategorySelector
  );
  const catWithFavFilter = useRecoilValue(
    bookmarkCategoryWithFavFilterSelector
  );
  const bookmarkFavSelector = useRecoilValue(bookmarkFavouriteSelector);
  const bookmarkCatSelector = useRecoilValue(bookmarkCategorySelector);
  return (
    <div className="flex flex-col gap-10">
      <span className=" text-gray-400">
        Showing{" "}
        <span>
          {!isFave &&
            !categoryFilter.category &&
            searchFilter == "" &&
            bookmarks.length > 0 &&
            bookmarks.length}
          {bookmarkFavSelector.length > 0 && bookmarkFavSelector.length}
          {bookmarkCatSelector.length > 0 && bookmarkCatSelector.length}
          {catWithFavFilter.length > 0 && catWithFavFilter.length}
          {searchBookmarkSelector.length > 0 && searchBookmarkSelector.length}
          {searchFavSelector.length > 0 && searchFavSelector.length}
          {searchFavCatSelector.length > 0 && searchFavCatSelector.length}
          {searchAndCategoryBookmarkSelector.length > 0 &&
            searchAndCategoryBookmarkSelector.length}

          {bookmarkFavSelector.length <= 0 &&
            bookmarkCatSelector.length <= 0 &&
            catWithFavFilter.length <= 0 &&
            searchBookmarkSelector.length <= 0 &&
            searchFavSelector.length <= 0 &&
            searchFavCatSelector.length <= 0 &&
            searchAndCategoryBookmarkSelector.length <= 0 &&
            bookmarks.length <=0 &&
            0}
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
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {//Only Favourites with all Categories and no search} */}
          {bookmarkFavSelector.length > 0 &&
            bookmarkFavSelector.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {//Only Specific Category wihout Favourites and no search} */}
          {bookmarkCatSelector.length > 0 &&
            bookmarkCatSelector.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {// Specific Category with Favourites, no Search} */}
          {catWithFavFilter.length > 0 &&
            catWithFavFilter.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {// Only search with All Bookmarks, no filter} */}
          {searchBookmarkSelector.length > 0 &&
            searchBookmarkSelector.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {// Search with Favourites} */}
          {searchFavSelector.length > 0 &&
            searchFavSelector.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {//Search with Specific Category} */}
          {searchAndCategoryBookmarkSelector.length > 0 &&
            searchAndCategoryBookmarkSelector.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
          {/* {//Search with Specific Category and fav} */}
          {searchFavCatSelector.length > 0 &&
            searchFavCatSelector.map((bookmark) => (
              <BookmarkCard
                fav={bookmark.fav}
                id={bookmark.id}
                date={new Date(bookmark.createdAt)}
                title={bookmark.title}
                url={bookmark.url}
                key={bookmark.id}
                category={bookmark.category}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default BookmarksContainer;
