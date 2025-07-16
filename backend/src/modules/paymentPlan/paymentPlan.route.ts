import { Router } from "express";
import { PaymentPlanController } from "./paymentPlan.controller";

const router = Router();

// GET
router.get("/", PaymentPlanController.getAllPaymentPlans);
router.get("/:id", PaymentPlanController.getPaymentPlanById);
// router.get("/search", PaymentPlanController.searchPaymentPlan);

// POST
router.post("/", PaymentPlanController.createPaymentPlan);

// PUT
router.put("/:id", PaymentPlanController.updatePaymentPlan);

// DELETE
router.delete("/:id", PaymentPlanController.deletePaymentPlan);

export default router;
