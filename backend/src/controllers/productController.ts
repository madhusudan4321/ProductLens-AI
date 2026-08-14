import { Request, Response, NextFunction } from "express";
import * as productService from "../services/productService";

// ─── Handlers ────────────────────────────────────────────

/**
 * POST /api/products/search
 * Search for a product or create a new one.
 * Body: { query: string } OR { manufacturer, modelNumber, name }
 */
export async function search(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { query, manufacturer, modelNumber, name } = req.body;

    let result;

    if (query) {
      // Freeform query — parse and resolve
      if (typeof query !== "string" || query.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: "Search query cannot be empty",
        });
        return;
      }
      result = await productService.resolveFromQuery(query.trim(), userId);
    } else if (manufacturer && modelNumber) {
      // Structured search — resolve directly
      if (typeof manufacturer !== "string" || typeof modelNumber !== "string") {
        res.status(400).json({
          success: false,
          error: "Manufacturer and model number must be strings",
        });
        return;
      }
      const productName =
        name || `${manufacturer.trim()} ${modelNumber.trim()}`;
      result = await productService.resolveAndCreate(
        manufacturer.trim(),
        modelNumber.trim(),
        productName,
        userId
      );
    } else {
      res.status(400).json({
        success: false,
        error:
          "Provide either a 'query' string or 'manufacturer' + 'modelNumber'",
      });
      return;
    }

    res.status(result.isNew ? 201 : 200).json({
      success: true,
      data: {
        product: result.product,
        isNew: result.isNew,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products
 * List products with pagination and filtering.
 * Query params: page, limit, status, sort, mine (boolean)
 */
export async function list(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );
    const status = req.query.status as string | undefined;
    const sort = (req.query.sort as string) || "-createdAt";
    const mine = req.query.mine === "true";

    const userId = mine ? req.user!.userId : undefined;

    const result = await productService.listProducts(
      page,
      limit,
      status,
      sort,
      userId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 * Get a single product by ID.
 */
export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
      return;
    }

    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id
 * Delete a product (owner only).
 */
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
      return;
    }

    await productService.deleteProduct(id, userId);

    res.status(200).json({
      success: true,
      data: { message: "Product deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
}
