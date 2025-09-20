import { useEffect } from "react";
import { Button } from "@mui/material";
import { loginSchema } from "@/types/auth.types";
import { useLoginMutation, useMeQuery } from "@/services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";

type LoginInput = {
  email: string;
  password: string;
};

const Login = () => {
  const [login, { isLoading, data, error }] = useLoginMutation();
  const navigate = useNavigate();
  const { refetch } = useMeQuery();

  useEffect(() => {
    if (data) {
      navigate("/");
    }
  }, [data, error, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (formData) => {
    try {
      const response = await login(formData).unwrap();
      if (response) {
        toast.success("Login successful!");
        navigate("/");
      }
      await refetch();
      reset();
    } catch (err) {
      let errorMessage = "Something went wrong";
      const errorData = (err as FetchBaseQueryError)?.data;
      if (
        errorData &&
        typeof errorData === "object" &&
        "message" in errorData
      ) {
        errorMessage =
          (errorData as { message?: string }).message || errorMessage;
      }
      toast.error(errorMessage);
      console.error("Login failed:", errorMessage);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-64 md:h-full hidden md:block">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1654912912446-8a04346ba47d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-4xl sm:text-5xl md:text-7xl text-center font-bold mb-8">
            <h1>Login</h1>
          </div>
          <form
            className="flex flex-col gap-4 items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="email"
              className="w-full h-12 placeholder:text-neutral-400 pl-4 text-sm bg-neutral-700 rounded-md border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="w-full text-xs text-red-400 text-left pl-4">
                {errors.email?.message}
              </span>
            )}
            <input
              className="w-full h-12 pl-4 placeholder:text-neutral-400 text-sm bg-neutral-700 rounded-md border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="w-full text-xs text-red-400 text-left pl-4">
                {errors.password?.message}
              </span>
            )}
            <Button
              disabled={isLoading}
              variant="contained"
              type="submit"
              fullWidth
              style={textFieldStyle}
              sx={{ height: "48px" }}
            >
              Submit
            </Button>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm text-neutral-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-white hover:underline">
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const textFieldStyle = {
  fontFamily: "Plus Jakarta Sans",
  backgroundColor: "#a1a1a1",
  color: "black",
  borderRadius: "5px",
};

export default Login;
