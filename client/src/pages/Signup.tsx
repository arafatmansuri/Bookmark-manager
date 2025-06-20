import { BookmarkIcon, Lock, Mail, User } from "lucide-react";
import { Button, Input } from "../components";

export default function Signup() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark dark:text-white dark:from-gray-900 dark:to-gray-800 text-black flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-7 flex flex-col justify-center items-center gap-4 mt-3">
        <div className="flex gap-3 items-center">
          <div className="p-3 bg-blue-600 rounded-2xl flex items-center">
            <BookmarkIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-bold text-2xl">Bookmark Manager</h1>
        </div>
        <p className="dark:text-gray-400">Create your account</p>
        <form className="flex flex-col justify-center items-center gap-6 w-full">
          <Input
            isLabel={true}
            type="text"
            isFull={true}
            labelText="Full Name"
            placeholder="Enter your full name"
            startIcon={
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            }
          />
          <Input
            isLabel={true}
            type="text"
            isFull={true}
            labelText="Email Address"
            placeholder="Enter your email"
            startIcon={
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            }
          />
          <Input
            isLabel={true}
            type="password"
            isFull={true}
            labelText="Password"
            placeholder="Enter your password"
            startIcon={
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            }
          />
          <Button
            size="lg"
            text="Create Account"
            variant="primary"
            classes="w-full"
          />
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 cursor-pointer">
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
