import { Bookmark, Heart, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { BookmarkCard, Header, Main, TotalCard } from "../components";
import { useAuthMutation, useGetUserQuery } from "../queries/authQueires";
import { userAtom } from "../store/userState";

function Dashboard() {
  const isRefreshed = useRef<boolean>(false);
  const setUser = useSetRecoilState(userAtom);
  const userQuery = useGetUserQuery({
    credentials: true,
    endpoint: "getuser",
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
  return (
    <div className="text-black bg-gradient-to-br from-blue-50 to-indigo-100 dark dark:text-white dark:from-gray-900 dark:to-gray-800 min-h-screen p-8 flex flex-col gap-10">
      <Header />
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
        <TotalCard
          icon={<Bookmark />}
          text="Total Bookmarks"
          totalCount={1}
          classes="dark:bg-blue-800 bg-blue-600 dark:text-blue-400 text-blue-100"
        />
        <TotalCard
          icon={<Heart />}
          text="Favorites"
          totalCount={0}
          classes="dark:bg-red-800 bg-red-600 dark:text-red-400 text-red-100"
        />
        <TotalCard
          icon={<Search />}
          text="Total Bookmarks"
          totalCount={1}
          classes="dark:bg-green-800 bg-green-600 dark:text-green-400 text-green-100"
        />
      </div>
      <Main />
      <span className=" text-gray-400">Showing 1 of 1 bookmarks</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <BookmarkCard
          date={new Date()}
          title="abc"
          url="abc.com"
          category={[{ name: "Genral", color: "green" }]}
        />
        {/* // <BookmarkCard date={new Date()} title="abc" url="abc.com"/>
        // <BookmarkCard date={new Date()} title="abc" url="abc.com"/>
        // <BookmarkCard date={new Date()} title="abc" url="abc.com"/> */}
      </div>
    </div>
  );
}

export default Dashboard;
