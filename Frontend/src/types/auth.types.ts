import * as yup from "yup";

export type registerInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name should only contain letters")
    .required("Name is required"),
  username: yup
    .string()
    .matches(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticate: boolean;
  isLoading: boolean;
}
