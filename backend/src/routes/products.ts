import { Router } from "express";
import * as productController from "../controllers/productController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All product routes require authentication
router.use(authenticate);

// Search / create product
router.post("/search", productController.search);

// List products (paginated, filterable)
router.get("/", productController.list);

// Get single product by ID
router.get("/:id", productController.getById);

// Delete product (owner only)
router.delete("/:id", productController.remove);

export default router;
