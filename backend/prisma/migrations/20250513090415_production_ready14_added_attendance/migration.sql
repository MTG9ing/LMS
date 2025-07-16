/*
  Warnings:

  - A unique constraint covering the columns `[studentId,examId]` on the table `ExamAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "gradeLevelId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Attendance_gradeLevelId_idx" ON "Attendance"("gradeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_key" ON "Attendance"("studentId", "date");

-- CreateIndex
CREATE INDEX "Achievement_studentId_idx" ON "Achievement"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAttempt_studentId_examId_key" ON "ExamAttempt"("studentId", "examId");

-- CreateIndex
CREATE INDEX "HomeworkTemplate_gradeLevelId_idx" ON "HomeworkTemplate"("gradeLevelId");
