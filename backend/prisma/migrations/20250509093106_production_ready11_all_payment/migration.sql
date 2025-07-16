-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "studentId" TEXT,
    "planId" TEXT,
    "categoryId" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Payment" ("amount", "categoryId", "description", "id", "paymentDate", "paymentMethod", "planId", "studentId", "type") SELECT "amount", "categoryId", "description", "id", "paymentDate", "paymentMethod", "planId", "studentId", "type" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_planId_idx" ON "Payment"("planId");
CREATE INDEX "Payment_paymentDate_idx" ON "Payment"("paymentDate");
CREATE INDEX "Payment_studentId_paymentDate_idx" ON "Payment"("studentId", "paymentDate");
CREATE INDEX "Payment_categoryId_idx" ON "Payment"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
