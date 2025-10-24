import {
  ArrowRight,
  Bookmark,
  Check,
  Folder,
  Heart,
  Search,
  Smartphone,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useAuthMutation, useGetUserQuery } from "../queries/authQueires";
import { userAtom } from "../store/userState";

export const LandingPage = () => {
  const navigate = useNavigate();
  const isRefreshed = useRef<boolean>(false);
  const setUser = useSetRecoilState(userAtom);
  const userQuery = useGetUserQuery({
    credentials: true,
    endpoint: "getuser",
    method: "GET",
  });
  const refreshTokenMutation = useAuthMutation();
  useEffect(() => {
    if (userQuery.status == "success") {
      setUser(userQuery.data);
      navigate("/dashboard");
    }
    if (userQuery.status == "error" && !isRefreshed.current) {
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
            navigate("/dashboard");
          },
          onError: () => {
            navigate("/");
          },
        }
      );
    }
  }, [userQuery.status, isRefreshed.current, refreshTokenMutation]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Organize Your
              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                Digital Life
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate bookmark manager that helps you save, organize, and
              find your favorite websites with powerful search, smart
              categories, and seamless synchronization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold text-lg cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Better Organization
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your bookmarks efficiently and never
              lose track of important websites again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl w-fit mb-4">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Instant Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find any bookmark instantly with our powerful search that looks
                through titles, URLs, and categories.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl w-fit mb-4">
                <Folder className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Smart Categories
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize bookmarks with custom categories and color coding for
                better visual organization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl w-fit mb-4">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Favorites System
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Mark important bookmarks as favorites for quick access and
                better prioritization.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl w-fit mb-4">
                <Smartphone className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Mobile Responsive
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your bookmarks from any device with our fully responsive
                design that works everywhere.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl w-fit mb-4">
                <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built for speed with instant loading, real-time search, and
                smooth interactions throughout.
              </p>
            </div>

            {/* Feature 6 */}
            {/* <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl w-fit mb-4">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your data stays private with local storage and secure
                authentication to protect your bookmarks.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose BookmarkPro?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Stop losing important websites in browser chaos. Our bookmark
                manager brings order to your digital life with intelligent
                organization and powerful search capabilities.
              </p>

              <div className="space-y-4">
                {[
                  "Never lose important websites again",
                  "Find any bookmark in seconds",
                  "Organize with custom categories",
                  "Access from any device",
                  "One-click URL copying",
                  "Dark mode for comfortable browsing",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <Bookmark className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    BookmarkPro
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Bookmarks
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      247
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      Categories
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      12
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">
                      Favorites
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      38
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Organize Your Bookmarks?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have already transformed their bookmark
            management experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl cursor-pointer"
            >
              Start Free Today
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
