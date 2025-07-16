import { Router } from "express";
import { FinancialRecordController } from "./financialRecord.controller";

const router = Router();

// GET
router.get("/", FinancialRecordController.getAll); // ALL
router.get("/summary", FinancialRecordController.recordSummary); // SUMMARY
router.get("/:id", FinancialRecordController.getById); // byId

// POST
router.post("/", FinancialRecordController.createRecord); // CREATE

// PUT
router.put("/:id", FinancialRecordController.updateRecord); // UPDATE

// DELETE
router.delete("/:id", FinancialRecordController.deleteRecord); // DELETE

export default router;
