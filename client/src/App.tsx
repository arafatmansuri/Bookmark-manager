import { Bookmark } from "./components";

function App() {
  return (
    <div className="text-black bg-gradient-to-br from-blue-50 to-indigo-100 dark dark:text-white dark:from-gray-900 dark:to-gray-800 w-screen min-h-screen">
      <Bookmark
        title="abc"
        url="https:abc.com"
        date={new Date}
        category={[
          { name: "General", color: "gray" },
          { name: "Work", color: "green" },
        ]}
      />
    </div>
  );
}

export default App;
