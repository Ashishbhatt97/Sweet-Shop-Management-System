import { useForm, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerInput, registerSchema } from "@/types/auth.types";
import { useRegisterMutation } from "@/services/api";
import { toast } from "react-toastify";

export default function Signup() {
  const [registerUser] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<registerInput>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<registerInput> = async (formData) => {
    try {
      const res = await registerUser(formData).unwrap();
      if (res.data) {
        toast.success("Registration successful! Please login.");
        window.location.href = "/login";
        reset();
      }
    } catch (err) {
      toast.error("Registration failed! Please try again.");
      console.log(err);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-64 md:h-full hidden md:block">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1656443041933-37f5069db057?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Signup background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-4xl sm:text-5xl md:text-7xl text-center font-bold mb-8">
            <h1>Sign Up</h1>
          </div>
          <form
            className="flex flex-col gap-4 items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              className="w-full h-12 placeholder:text-neutral-400 pl-4 text-sm bg-neutral-700 rounded-md border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="w-full text-xs text-red-400 text-left pl-4">
                {errors.name?.message}
              </span>
            )}
            <input
              type="text"
              className="w-full h-12 placeholder:text-neutral-400 pl-4 text-sm bg-neutral-700 rounded-md border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <span className="w-full text-xs text-red-400 text-left pl-4">
                {errors.username?.message}
              </span>
            )}
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
              type="password"
              className="w-full h-12 pl-4 placeholder:text-neutral-400 text-sm bg-neutral-700 rounded-md border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="w-full text-xs text-red-400 text-left pl-4">
                {errors.password?.message}
              </span>
            )}
            <input
              type="password"
              className="w-full h-12 pl-4 placeholder:text-neutral-400 text-sm bg-neutral-700 rounded-md border border-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <span className="w-full text-xs text-red-400 text-left pl-4">
                {errors.confirmPassword?.message}
              </span>
            )}
            <Button
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
              Already have an account?{" "}
              <a href="/login" className="text-white hover:underline">
                Login
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const textFieldStyle = {
  fontFamily: "Plus Jakarta Sans",
  backgroundColor: "#a1a1a1",
  color: "black",
  borderRadius: "5px",
};
