import { ArrowLeft, Lock, User } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useAuthMutation } from "../queries/authQueires";
type Inputs = {
  username: string;
  password: string;
  email?: string;
};
export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();
  const signinMutation = useAuthMutation();
  useEffect(() => {
    if (signinMutation.status == "success") {
      navigate("/dashboard");
      console.log(signinMutation.data);
    }
  }, [signinMutation.status]);
  const signin: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (!errors.username && !errors.email && !errors.password) {
      signinMutation.mutate({
        method: "POST",
        credentials: true,
        data: data,
        endpoint: "login",
      });
      console.log(data);
    }
  };
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark dark:text-white dark:from-gray-900 dark:to-gray-800 text-black flex items-center justify-center h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-7 flex flex-col justify-center items-center gap-4 mt-3">
        {/* <div className="flex gap-3 items-center">
          <div className="p-3 bg-blue-600 rounded-2xl flex items-center">
            <BookmarkIcon className="h-8 w-8 text-white" />
          </div>
          </div> */}
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <h1 className="font-bold text-2xl">Welcome back!</h1>
        <p className="dark:text-gray-400">Sign in to access your bookmarks</p>
        <form
          onSubmit={handleSubmit(signin)}
          className="flex flex-col justify-center items-center gap-6 w-full"
        >
          <div className="w-full flex flex-col gap-2">
            <Input
              isFocus={true}
              register={{ ...register("username", { required: true }) }}
              isLabel={true}
              type="text"
              isFull={true}
              labelText="Username"
              placeholder="Enter your username"
              startIcon={
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              }
            />
            {errors.username?.type == "required" && (
              <span className="text-red-500">Username is required</span>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <Input
              register={{ ...register("password", { required: true }) }}
              isLabel={true}
              type="password"
              isFull={true}
              labelText="Password"
              placeholder="Enter your password"
              startIcon={
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              }
            />
            {errors.password?.type == "required" && (
              <span className="text-red-500">Password is required</span>
            )}
          </div>
          {signinMutation.isError && (
            <span className="text-red-500">
              {signinMutation.error?.message}
            </span>
          )}
          <Button
            type="submit"
            size="lg"
            text="Sign In"
            variant="primary"
            classes="w-full"
          />
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
