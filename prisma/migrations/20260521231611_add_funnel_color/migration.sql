/*
  Warnings:

  - A unique constraint covering the columns `[accountId,color]` on the table `Funnel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Funnel_color_key";

-- CreateIndex
CREATE UNIQUE INDEX "Funnel_accountId_color_key" ON "Funnel"("accountId", "color");
