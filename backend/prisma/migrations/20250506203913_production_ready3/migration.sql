/*
  Warnings:

  - You are about to drop the column `daysUntilDue` on the `PaymentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PaymentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `installments` on the `PaymentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `overduePenalty` on the `PaymentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PaymentPlan` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MONTHLY',
    "amount" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_PaymentPlan" ("amount", "id", "isActive", "name", "type") SELECT "amount", "id", "isActive", "name", "type" FROM "PaymentPlan";
DROP TABLE "PaymentPlan";
ALTER TABLE "new_PaymentPlan" RENAME TO "PaymentPlan";
CREATE INDEX "PaymentPlan_isActive_idx" ON "PaymentPlan"("isActive");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
