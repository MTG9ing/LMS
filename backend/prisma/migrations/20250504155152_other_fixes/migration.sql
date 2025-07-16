/*
  Warnings:

  - Made the column `paymentId` on table `FinancialRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxAmount" REAL,
    "paymentId" TEXT NOT NULL
);
INSERT INTO "new_FinancialRecord" ("amount", "category", "date", "description", "id", "paymentId", "taxAmount", "type") SELECT "amount", "category", "date", "description", "id", "paymentId", "taxAmount", "type" FROM "FinancialRecord";
DROP TABLE "FinancialRecord";
ALTER TABLE "new_FinancialRecord" RENAME TO "FinancialRecord";
CREATE INDEX "FinancialRecord_date_type_idx" ON "FinancialRecord"("date", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "search_fullName" ON "Student"("fullName");

-- RedefineIndex
DROP INDEX "Student_studentNumber_idx";
CREATE INDEX "search_studentNumber" ON "Student"("studentNumber");
