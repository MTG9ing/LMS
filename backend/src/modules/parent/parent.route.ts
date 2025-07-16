import { Router } from "express";
import { asyncHandler } from "../../utilities/asyncHander.util";
import { ParentController } from "./parent.controller";

const router = Router();

// GET
router.get("/", asyncHandler(ParentController.getAllParents));
router.get("/:id", asyncHandler(ParentController.getParentById));

// POST
router.post("/", asyncHandler(ParentController.createParent));

// PATCH
router.patch("/:id", asyncHandler(ParentController.updateParent));

// DELETE
router.delete("/:id", asyncHandler(ParentController.deleteParent));

export default router;
