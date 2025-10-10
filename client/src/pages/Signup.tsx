import { BookmarkIcon, Lock, Mail, User } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useAuthMutation } from "../queries/authQueires";
type Inputs = {
  username: string;
  email: string;
  password: string;
};
export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();
  const signupMutation = useAuthMutation();
  const singup: SubmitHandler<Inputs> = async (data) => {
    if (!errors.username && !errors.email && !errors.password) {
      signupMutation.mutate({
        method: "POST",
        credentials: false,
        data: data,
        endpoint: "register",
      });
      console.log(data);
    }
  };
  useEffect(() => {
    if (signupMutation.status == "success") {
      navigate("/signin");
    }
  }, [signupMutation.status]);
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark dark:text-white dark:from-gray-900 dark:to-gray-800 text-black flex items-center justify-center p-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-7 flex flex-col justify-center items-center gap-4 mt-3">
        <div className="flex gap-3 items-center">
          <div className="p-3 bg-blue-600 rounded-2xl flex items-center">
            <BookmarkIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-bold text-2xl">Bookmark Manager</h1>
        </div>
        <p className="dark:text-gray-400">Create your account</p>
        <form
          onSubmit={handleSubmit(singup)}
          className="flex flex-col justify-center items-center gap-6 w-full"
        >
          <div className="w-full flex flex-col gap-2">
            <Input
              isLabel={true}
              type="text"
              isFocus={true}
              isFull={true}
              labelText="Username"
              placeholder="Enter username"
              startIcon={
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              }
              register={{
                ...register("username", { required: true, minLength: 3 }),
              }}
            />
            {errors.username?.type == "required" && (
              <span className="text-red-500">Username is required</span>
            )}
            {errors.username?.type == "minLength" && (
              <span className="text-red-500">
                Username must be of atleast 3 characters{" "}
              </span>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <Input
              isLabel={true}
              type="email"
              isFull={true}
              labelText="Email Address"
              placeholder="Enter your email"
              startIcon={
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              }
              register={{
                ...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                }),
              }}
            />
            {errors.email?.type == "required" && (
              <span className="text-red-500">Email is required</span>
            )}
            {errors.email?.type == "pattern" && (
              <span className="text-red-500">Invalid email</span>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <Input
              isLabel={true}
              type="password"
              isFull={true}
              labelText="Password"
              placeholder="Enter your password"
              startIcon={
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              }
              register={{
                ...register("password", { required: true, minLength: 8 }),
              }}
            />
            {errors.password?.type == "required" && (
              <span className="text-red-500">Password is required</span>
            )}
            {errors.password?.type == "minLength" && (
              <span className="text-red-500">
                Password must be of atleast 8 characters{" "}
              </span>
            )}
          </div>
          {signupMutation.isError && (
            <span className="text-red-500">
              {signupMutation.error?.message}
            </span>
          )}
          <Button
            type="submit"
            size="lg"
            text="Create Account"
            variant="primary"
            classes="w-full"
          />
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
