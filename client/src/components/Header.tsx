import axios from "axios";
import { BookmarkIcon, ChevronDown, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BACKEND_URL } from "../config";
import { userAtom } from "../store/userState";

export function Header() {
  const user = useRecoilValue(userAtom);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  async function logout() {
    await axios.post(
      `${BACKEND_URL}/user/logout`,
      {},
      { withCredentials: true }
    );
    navigate("/");
  }
  return (
    <header className="flex flex-col md:flex-row gap-5 justify-between items-center">
      <div className="flex gap-3">
        <div className="p-3 bg-blue-600 rounded-2xl flex items-center">
          <BookmarkIcon className="h-8 w-8 text-white" />
        </div>
        <div className="">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Bookmark Pro
          </h1>
          <h4 className="text-gray-600 text-xs md:text-sm dark:text-gray-400">
            Organize and manage your bookmarks
          </h4>
        </div>
      </div>
      <div
        className="flex gap-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 p-2 items-center cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="rounded-full bg-blue-600 w-10 h-10 font-medium flex items-center justify-center">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-medium">{user?.username}</h3>
          <h5 className="text-gray-400 text-xs">{user?.email}</h5>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10 cursor-pointer"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-2 top-25 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 w-54 py-2">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>

            {/* <div className="py-2">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 
                         dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div> */}

            <div className="pt-2">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
