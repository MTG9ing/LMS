-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCOME',
    "categoryId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxAmount" REAL,
    "paymentId" TEXT NOT NULL
);
INSERT INTO "new_FinancialRecord" ("amount", "categoryId", "date", "description", "id", "paymentId", "taxAmount", "type") SELECT "amount", "categoryId", "date", "description", "id", "paymentId", "taxAmount", "type" FROM "FinancialRecord";
DROP TABLE "FinancialRecord";
ALTER TABLE "new_FinancialRecord" RENAME TO "FinancialRecord";
CREATE INDEX "FinancialRecord_date_type_idx" ON "FinancialRecord"("date", "type");
CREATE INDEX "FinancialRecord_categoryId_idx" ON "FinancialRecord"("categoryId");
CREATE INDEX "FinancialRecord_paymentId_idx" ON "FinancialRecord"("paymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
