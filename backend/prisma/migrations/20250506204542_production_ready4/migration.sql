/*
  Warnings:

  - You are about to drop the column `paymentPlanId` on the `Student` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "studentNumber" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isStillAttending" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" JSONB,
    "sensitiveNotes" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    "parentId" TEXT
);
INSERT INTO "new_Student" ("archivedAt", "createdAt", "dateOfBirth", "fullName", "gradeLevelId", "id", "isArchived", "isOnline", "isStillAttending", "notes", "parentId", "sensitiveNotes", "studentNumber") SELECT "archivedAt", "createdAt", "dateOfBirth", "fullName", "gradeLevelId", "id", "isArchived", "isOnline", "isStillAttending", "notes", "parentId", "sensitiveNotes", "studentNumber" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber");
CREATE INDEX "Student_isStillAttending_idx" ON "Student"("isStillAttending");
CREATE INDEX "Student_createdAt_idx" ON "Student"("createdAt");
CREATE INDEX "Student_parentId_idx" ON "Student"("parentId");
CREATE INDEX "Student_gradeLevelId_idx" ON "Student"("gradeLevelId");
CREATE INDEX "Student_isArchived_idx" ON "Student"("isArchived");
CREATE INDEX "search_fullName" ON "Student"("fullName");
CREATE INDEX "search_studentNumber" ON "Student"("studentNumber");
CREATE INDEX "compound_search_idx" ON "Student"("fullName", "studentNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
