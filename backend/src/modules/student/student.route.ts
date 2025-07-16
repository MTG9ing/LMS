import { Router } from "express";
import { StudentController } from "./student.controller";
import { asyncHandler } from "../../utilities/asyncHander.util";

const router = Router();

// GET
router.get(`/`, asyncHandler(StudentController.getAllStudents));
router.get(`/:id`, asyncHandler(StudentController.getStudentById));
// router.get(`/search`, StudentController.searchStudents);

// POST
router.post(`/`, asyncHandler(StudentController.createStudent));
// router.post(`/students/bulk-archive`, StudentController.bulkArchive);

// PATCH
router.patch(`/:id`, asyncHandler(StudentController.updateStudent));

// DELETE
router.delete(`/:id`, asyncHandler(StudentController.deleteStudent));

export default router;
