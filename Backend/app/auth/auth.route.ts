import { Router } from "express";
import passport from "passport";

import * as authController from "./auth.controller";
import * as authValidation from "./auth.validation";
import catchError from "../common/middleware/catch-error.middleware";

const router = Router();
const authenticatedJWT = passport.authenticate("jwt", { session: false });

router.get("/me", authenticatedJWT, authController.getUserDetails);
router.post(
  "/register",
  authValidation.registerSchema,
  catchError,
  authController.createUser
);
router.post(
  "/login",
  authValidation.loginSchema,
  catchError,
  authController.loginUser
);
router.post("/refresh", authController.refreshToken);

export default router;
