import { Router } from "express";
import passport from "passport";

import * as sweetsController from "./sweets.controller";
import * as sweetsValidation from "./sweets.validation";
import catchError from "../common/middleware/catch-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";

const router = Router();
const authenticatedJWT = passport.authenticate("jwt", { session: false });

router.post(
  "/",
  authenticatedJWT,
  sweetsValidation.createSweetSchema,
  catchError,
  sweetsController.createSweet
);

router.get("/", authenticatedJWT, sweetsController.getAllSweets);

router.get(
  "/search",
  authenticatedJWT,
  sweetsValidation.searchSweetSchema,
  catchError,
  sweetsController.searchSweets
);

router.put(
  "/:id",
  authenticatedJWT,
  sweetsValidation.updateSweetSchema,
  catchError,
  sweetsController.updateSweet
);

router.delete(
  "/:id",
  authenticatedJWT,
  roleAuth("ADMIN"),
  sweetsValidation.deleteSweetSchema,
  catchError,
  sweetsController.deleteSweet
);

router.post(
  "/:id/purchase",
  authenticatedJWT,
  catchError,
  sweetsController.purchaseSweet
);

router.post(
  "/:id/restock",
  authenticatedJWT,
  roleAuth("ADMIN"),
  catchError,
  sweetsController.restockSweet
);

export default router;
