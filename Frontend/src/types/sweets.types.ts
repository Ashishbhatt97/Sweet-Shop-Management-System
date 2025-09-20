import * as yup from "yup";

export const sweetSchema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    category: yup
      .string()
      .required("Category is required")
      .min(2, "Category must be at least 2 characters")
      .max(50, "Category cannot exceed 50 characters"),
    price: yup
      .number()
      .required("Price is required")
      .min(0.01, "Price must be at least 0.01")
      .typeError("Price must be a valid number"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .min(0, "Quantity cannot be negative")
      .integer("Quantity must be an integer")
      .typeError("Quantity must be a valid number"),
  })
  .required();

export const sweetEditSchema = yup
  .object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    category: yup
      .string()
      .required("Category is required")
      .min(2, "Category must be at least 2 characters")
      .max(50, "Category cannot exceed 50 characters"),
    price: yup
      .number()
      .required("Price is required")
      .min(0.01, "Price must be at least 0.01")
      .typeError("Price must be a valid number"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .min(0, "Quantity cannot be negative")
      .integer("Quantity must be an integer")
      .typeError("Quantity must be a valid number"),
  })
  .required();

export type SweetEditFormData = yup.InferType<typeof sweetEditSchema>;
export type SweetFormData = yup.InferType<typeof sweetSchema>;
