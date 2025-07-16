import { Router } from "express";
import { AttendanceController } from "./attendance.controller";

const router = Router();

router.post("/", AttendanceController.recordAttendance);
router.get("/:date/:gradeLevelId", AttendanceController.getAttendanceByDate);

export default router;
