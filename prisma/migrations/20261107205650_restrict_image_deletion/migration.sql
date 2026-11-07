-- DropForeignKey
ALTER TABLE "action" DROP CONSTRAINT "action_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "characteristic" DROP CONSTRAINT "characteristic_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "cta" DROP CONSTRAINT "cta_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "person" DROP CONSTRAINT "person_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "person" DROP CONSTRAINT "person_poster_id_fkey";

-- DropForeignKey
ALTER TABLE "person" DROP CONSTRAINT "person_preview_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_poster_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_preview_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_poster_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_preview_id_fkey";

-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_icon_id_fkey";

-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_poster_id_fkey";

-- DropForeignKey
ALTER TABLE "service" DROP CONSTRAINT "service_preview_id_fkey";

-- DropForeignKey
ALTER TABLE "social_media" DROP CONSTRAINT "social_media_icon_id_fkey";

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristic" ADD CONSTRAINT "characteristic_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cta" ADD CONSTRAINT "cta_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
