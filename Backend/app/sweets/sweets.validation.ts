import { body, param, query } from "express-validator";

export const createSweetSchema = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),

  body("category")
    .isString()
    .withMessage("Category must be a string.")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters long."),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer."),

  body("imageUrl")
    .isString()
    .withMessage("Image URL must be a string.")
    .optional(),

  body("isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean value.")
    .optional(),
];

export const updateSweetSchema = [
  param("id").isUUID().withMessage("Invalid sweet ID."),

  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long.")
    .optional(),

  body("category")
    .isString()
    .withMessage("Category must be a string.")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters long.")
    .optional(),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number.")
    .optional(),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer.")
    .optional(),

  body("imageUrl")
    .isString()
    .withMessage("Image URL must be a string.")
    .optional(),

  body("isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean value.")
    .optional(),
];

export const searchSweetSchema = [
  query("name").isString().withMessage("Name must be a string.").optional(),

  query("category")
    .isString()
    .withMessage("Category must be a string.")
    .optional(),

  query("minPrice")
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number.")
    .optional(),

  query("maxPrice")
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number.")
    .optional(),
];

export const deleteSweetSchema = [
  param("id").isUUID().withMessage("Invalid sweet ID."),
];
