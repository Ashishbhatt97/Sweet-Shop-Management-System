import { body } from "express-validator";

export const registerSchema = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long.")
    .isString()
    .withMessage("Name must be a string."),

  body("email").isEmail().withMessage("Please provide a valid email address."),

  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .isString()
    .withMessage("Username must be a string."),

  body("role")
    .isIn(["ADMIN", "USER"])
    .withMessage('Role must be either "ADMIN" or "USER".')
    .isString()
    .withMessage("Role must be a string.")
    .default("USER")
    .optional(),

  body("active")
    .isBoolean()
    .withMessage("Active must be a boolean value.")
    .default(true)
    .optional(),

  body("refreshToken")
    .isString()
    .withMessage("Refresh token must be a string.")
    .optional(),

  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),

  body("confirmPassword")
    .isLength({ min: 5 })
    .withMessage("Confirm password must be at least 5 characters long.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password and Confirm Password do not match."),
];

export const loginSchema = [
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
];
