import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();

// GET
router.get("/", PaymentController.getAllPayments);

// POST
router.post("/", PaymentController.createPayment);

// PUT
router.put("/:id", PaymentController.updatePayment);

// DELETE
router.delete("/:id", PaymentController.deletePayment);

export default router;
