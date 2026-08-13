import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

// Protected routes
router.get("/me", authenticate, authController.getMe);

export default router;
