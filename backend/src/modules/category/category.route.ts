import { Router } from "express";
import { CategoryController } from "./category.controller";

const router = Router();

// GET
router.get("/", CategoryController.getAllCategories); // retrieving all categories with optional query parameters for pagination, sorting, etc.
router.get("/:id", CategoryController.getCategoryById);
// router.get("/name/:name", CategoryController.getCategoryByName);
// router.get("/search", CategoryController.searchCategories); // searching for categories, accepting additional query parameters.

// POST
router.post("/", CategoryController.createCategory);

// PUT
router.put("/:id", CategoryController.updateCategory);

// DELETE
router.delete("/:id", CategoryController.deleteCategory);

export default router;
