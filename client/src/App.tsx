import { Lock } from "lucide-react";
import { Button, Input } from "./components";

function App() {
  return (
    <div className="text-black bg-gradient-to-br from-blue-50 to-indigo-100 dark dark:text-white dark:from-gray-900 dark:to-gray-800 w-screen min-h-screen">
      Init Bookmakr Manager
      <Button text="signin" size="lg" variant="primary" />
      <Input
        isLabel={true}
        type="password"
        labelText="Fullname"
        placeholder="Enter your name"
        startIcon={
          <Lock
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          />
        }
      />
    </div>
  );
}

export default App;
