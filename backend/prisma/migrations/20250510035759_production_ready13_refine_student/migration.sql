/*
  Warnings:

  - You are about to drop the column `email` on the `Parent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN "email" TEXT;
ALTER TABLE "Student" ADD COLUMN "phone" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Parent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "address" TEXT
);
INSERT INTO "new_Parent" ("address", "id", "name", "primaryPhone", "secondaryPhone") SELECT "address", "id", "name", "primaryPhone", "secondaryPhone" FROM "Parent";
DROP TABLE "Parent";
ALTER TABLE "new_Parent" RENAME TO "Parent";
CREATE INDEX "Parent_primaryPhone_idx" ON "Parent"("primaryPhone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");
