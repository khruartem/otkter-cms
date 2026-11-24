/*
  Warnings:

  - A unique constraint covering the columns `[person_id,sort_order]` on the table `social_media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "social_media" ADD COLUMN     "sort_order" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "social_media_person_sort_order_key" ON "social_media"("person_id", "sort_order");
