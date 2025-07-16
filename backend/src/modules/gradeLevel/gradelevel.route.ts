import { Router } from "express";
import { asyncHandler } from "../../utilities/asyncHander.util";
import { GradeLevelController } from "./gradelevel.controller";

const router = Router();

// GET
router.get("/", asyncHandler(GradeLevelController.getAllGradeLevels));
router.get("/:id", asyncHandler(GradeLevelController.getGradeLevelById));

// POST
router.post("/", asyncHandler(GradeLevelController.createGradeLevel));

// PATCH
router.patch("/:id", asyncHandler(GradeLevelController.updateGradeLevel));

// DELETE
router.delete("/:id", asyncHandler(GradeLevelController.deleteGradeLevel));

export default router;
