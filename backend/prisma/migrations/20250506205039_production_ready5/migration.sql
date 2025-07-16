/*
  Warnings:

  - You are about to drop the column `isRecurring` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN "paymentPlanId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "category" TEXT NOT NULL,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "description" TEXT,
    "studentId" TEXT,
    "planId" TEXT
);
INSERT INTO "new_Payment" ("amount", "category", "description", "id", "paymentDate", "paymentMethod", "planId", "studentId", "type") SELECT "amount", "category", "description", "id", "paymentDate", "paymentMethod", "planId", "studentId", "type" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_paymentDate_category_idx" ON "Payment"("paymentDate", "category");
CREATE INDEX "Payment_studentId_paymentDate_idx" ON "Payment"("studentId", "paymentDate");
CREATE TABLE "new_PaymentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MONTHLY',
    "amount" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_PaymentPlan" ("amount", "id", "isActive", "name", "type") SELECT "amount", "id", "isActive", "name", "type" FROM "PaymentPlan";
DROP TABLE "PaymentPlan";
ALTER TABLE "new_PaymentPlan" RENAME TO "PaymentPlan";
CREATE INDEX "PaymentPlan_isActive_idx" ON "PaymentPlan"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Student_paymentPlanId_idx" ON "Student"("paymentPlanId");
