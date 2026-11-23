/*
  Warnings:

  - A unique constraint covering the columns `[sort_order]` on the table `person` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "person_sort_order_key" ON "person"("sort_order");
