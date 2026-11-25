/*
Warnings:

- A unique constraint covering the columns `[project_id,sort_order]` on the table `photo` will be added. If there are existing duplicate values, this will fail.
- A unique constraint covering the columns `[service_id,sort_order]` on the table `photo` will be added. If there are existing duplicate values, this will fail.
- A unique constraint covering the columns `[person_id,sort_order]` on the table `photo` will be added. If there are existing duplicate values, this will fail.
- A unique constraint covering the columns `[product_id,sort_order]` on the table `photo` will be added. If there are existing duplicate values, this will fail.

 */
-- AlterTable
ALTER TABLE "photo"
ADD COLUMN "sort_order" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "photo_project_sort_order_key" ON "photo" ("project_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "photo_service_sort_order_key" ON "photo" ("service_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "photo_person_sort_order_key" ON "photo" ("person_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "photo_product_sort_order_key" ON "photo" ("product_id", "sort_order");

-- Project
ALTER TABLE "project" ADD CONSTRAINT "project_sort_order_positive_check" CHECK ("sort_order" >= 1);

-- Person
ALTER TABLE "person" ADD CONSTRAINT "person_sort_order_positive_check" CHECK ("sort_order" >= 1);

-- Service
ALTER TABLE "service" ADD CONSTRAINT "service_sort_order_positive_check" CHECK ("sort_order" >= 1);

-- Product
ALTER TABLE "product" ADD CONSTRAINT "product_sort_order_positive_check" CHECK ("sort_order" >= 1);

-- SocialMedia
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_sort_order_positive_check" CHECK ("sort_order" >= 1);

-- Photo
ALTER TABLE "photo" ADD CONSTRAINT "photo_sort_order_positive_check" CHECK ("sort_order" >= 1);