/*
  Warnings:

  - A unique constraint covering the columns `[sort_order]` on the table `project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "project_sort_order_key" ON "project"("sort_order");
