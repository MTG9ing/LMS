/*
  Warnings:

  - You are about to drop the column `category` on the `FinancialRecord` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `FinancialRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `PaymentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "categoryId" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxAmount" REAL,
    "paymentId" TEXT NOT NULL
);
INSERT INTO "new_FinancialRecord" ("amount", "date", "description", "id", "paymentId", "taxAmount", "type") SELECT "amount", "date", "description", "id", "paymentId", "taxAmount", "type" FROM "FinancialRecord";
DROP TABLE "FinancialRecord";
ALTER TABLE "new_FinancialRecord" RENAME TO "FinancialRecord";
CREATE INDEX "FinancialRecord_date_type_idx" ON "FinancialRecord"("date", "type");
CREATE INDEX "FinancialRecord_categoryId_idx" ON "FinancialRecord"("categoryId");
CREATE INDEX "FinancialRecord_paymentId_idx" ON "FinancialRecord"("paymentId");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "studentId" TEXT,
    "planId" TEXT,
    "categoryId" TEXT
);
INSERT INTO "new_Payment" ("amount", "description", "id", "paymentDate", "paymentMethod", "planId", "studentId", "type") SELECT "amount", "description", "id", "paymentDate", "paymentMethod", "planId", "studentId", "type" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_planId_idx" ON "Payment"("planId");
CREATE INDEX "Payment_paymentDate_idx" ON "Payment"("paymentDate");
CREATE INDEX "Payment_studentId_paymentDate_idx" ON "Payment"("studentId", "paymentDate");
CREATE INDEX "Payment_categoryId_idx" ON "Payment"("categoryId");
CREATE TABLE "new_PaymentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MONTHLY',
    "amount" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_PaymentPlan" ("amount", "id", "isActive", "isRecurring", "name", "type") SELECT "amount", "id", "isActive", "isRecurring", "name", "type" FROM "PaymentPlan";
DROP TABLE "PaymentPlan";
ALTER TABLE "new_PaymentPlan" RENAME TO "PaymentPlan";
CREATE INDEX "PaymentPlan_isActive_idx" ON "PaymentPlan"("isActive");
CREATE INDEX "PaymentPlan_categoryId_idx" ON "PaymentPlan"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
