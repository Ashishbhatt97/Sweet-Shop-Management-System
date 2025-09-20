import { Router } from "express";
import userRoutes from "./auth/auth.route";
import sweetsRoutes from "./sweets/sweets.route";
const router = Router();

router.use("/auth", userRoutes);
router.use("/sweets", sweetsRoutes);

export default router;
