/*
  Warnings:

  - You are about to drop the `ExamSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExamSubmission";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentGrade" REAL,
    "submittedAt" DATETIME,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_idx" ON "ExamAttempt"("studentId");

-- CreateIndex
CREATE INDEX "ExamAttempt_examId_idx" ON "ExamAttempt"("examId");

-- CreateIndex
CREATE INDEX "ExamAttempt_submittedAt_idx" ON "ExamAttempt"("submittedAt");

-- CreateIndex
CREATE INDEX "Achievement_awardedAt_idx" ON "Achievement"("awardedAt");

-- CreateIndex
CREATE INDEX "Homework_isDone_isLate_idx" ON "Homework"("isDone", "isLate");

-- CreateIndex
CREATE INDEX "Parent_primaryPhone_idx" ON "Parent"("primaryPhone");

-- CreateIndex
CREATE INDEX "Student_studentNumber_idx" ON "Student"("studentNumber");

-- CreateIndex
CREATE INDEX "Student_isArchived_idx" ON "Student"("isArchived");
