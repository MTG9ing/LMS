/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PaymentPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentPlan_name_key" ON "PaymentPlan"("name");
