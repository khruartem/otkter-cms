-- CreateEnum
CREATE TYPE "publication_status" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('primary', 'secondary');

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "sort_order" INTEGER,
    "image_id" UUID,
    "poster_id" UUID,
    "preview_id" UUID,
    "icon_id" UUID,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_is_attention" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication_status" "publication_status" NOT NULL DEFAULT 'draft',

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "sort_order" INTEGER,
    "image_id" UUID,
    "poster_id" UUID,
    "preview_id" UUID,
    "icon_id" UUID,
    "category_icon_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication_status" "publication_status" NOT NULL DEFAULT 'draft',

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "sort_order" INTEGER,
    "image_id" UUID,
    "poster_id" UUID,
    "preview_id" UUID,
    "icon_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication_status" "publication_status" NOT NULL DEFAULT 'draft',

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "sort_order" INTEGER,
    "image_id" UUID,
    "poster_id" UUID,
    "preview_id" UUID,
    "icon_id" UUID,
    "requires_characteristics" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publication_status" "publication_status" NOT NULL DEFAULT 'draft',

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "icon_id" UUID,
    "text" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_category" (
    "project_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "project_category_pkey" PRIMARY KEY ("project_id","category_id")
);

-- CreateTable
CREATE TABLE "person_category" (
    "person_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "person_category_pkey" PRIMARY KEY ("person_id","category_id")
);

-- CreateTable
CREATE TABLE "product_category" (
    "product_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "service_id" UUID,
    "person_id" UUID,
    "product_id" UUID,
    "image_id" UUID NOT NULL,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "service_id" UUID,
    "product_id" UUID,
    "icon_id" UUID,
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "action_type" NOT NULL,

    CONSTRAINT "action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "person_id" UUID NOT NULL,
    "icon_id" UUID,
    "url" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characteristic" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID,
    "service_id" UUID,
    "icon_id" UUID,
    "title" TEXT NOT NULL,
    "value" TEXT[] NOT NULL,

    CONSTRAINT "characteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_mention" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "media_mention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_media_mention" (
    "project_id" UUID NOT NULL,
    "media_mention_id" UUID NOT NULL,

    CONSTRAINT "project_media_mention_pkey" PRIMARY KEY ("project_id","media_mention_id")
);

-- CreateTable
CREATE TABLE "person_media_mention" (
    "person_id" UUID NOT NULL,
    "media_mention_id" UUID NOT NULL,

    CONSTRAINT "person_media_mention_pkey" PRIMARY KEY ("person_id","media_mention_id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "place" TEXT NOT NULL,
    "date_time" TIMESTAMPTZ NOT NULL,
    "label" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cta" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service_id" UUID NOT NULL,
    "icon_id" UUID,
    "text" TEXT,

    CONSTRAINT "cta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_person" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "role" TEXT,
    "extra" TEXT,

    CONSTRAINT "project_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_person" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "service_id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "role" TEXT,
    "extra" TEXT,

    CONSTRAINT "service_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_characteristic_list" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "title" TEXT,

    CONSTRAINT "product_characteristic_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_characteristic" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "characteristic_list_id" UUID NOT NULL,
    "color" TEXT,
    "text" TEXT,

    CONSTRAINT "product_characteristic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "size" BIGINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_slug_key" ON "project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_image_id_key" ON "project"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_poster_id_key" ON "project"("poster_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_preview_id_key" ON "project"("preview_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_icon_id_key" ON "project"("icon_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_slug_key" ON "service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "service_image_id_key" ON "service"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_poster_id_key" ON "service"("poster_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_preview_id_key" ON "service"("preview_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_icon_id_key" ON "service"("icon_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_category_icon_id_key" ON "service"("category_icon_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_slug_key" ON "person"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "person_image_id_key" ON "person"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_poster_id_key" ON "person"("poster_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_preview_id_key" ON "person"("preview_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_icon_id_key" ON "person"("icon_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_image_id_key" ON "product"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_poster_id_key" ON "product"("poster_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_preview_id_key" ON "product"("preview_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_icon_id_key" ON "product"("icon_id");

-- CreateIndex
CREATE INDEX "idx_project_category_category_id" ON "project_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_person_category_category_id" ON "person_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_product_category_category_id" ON "product_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_photo_image_id" ON "photo"("image_id");

-- CreateIndex
CREATE INDEX "idx_social_media_person_id" ON "social_media"("person_id");

-- CreateIndex
CREATE INDEX "idx_media_mention_image_id" ON "media_mention"("image_id");

-- CreateIndex
CREATE INDEX "idx_project_media_mention_media_mention_id" ON "project_media_mention"("media_mention_id");

-- CreateIndex
CREATE INDEX "idx_person_media_mention_media_mention_id" ON "person_media_mention"("media_mention_id");

-- CreateIndex
CREATE INDEX "idx_event_project_id" ON "event"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "cta_service_id_key" ON "cta"("service_id");

-- CreateIndex
CREATE INDEX "idx_project_person_project_id" ON "project_person"("project_id");

-- CreateIndex
CREATE INDEX "idx_project_person_person_id" ON "project_person"("person_id");

-- CreateIndex
CREATE INDEX "idx_service_person_service_id" ON "service_person"("service_id");

-- CreateIndex
CREATE INDEX "idx_service_person_person_id" ON "service_person"("person_id");

-- CreateIndex
CREATE INDEX "idx_product_characteristic_list_product_id" ON "product_characteristic_list"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_characteristic_characteristic_list_id" ON "product_characteristic"("characteristic_list_id");

-- CreateIndex
CREATE UNIQUE INDEX "image_storage_key_key" ON "image"("storage_key");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_category_icon_id_fkey" FOREIGN KEY ("category_icon_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_poster_id_fkey" FOREIGN KEY ("poster_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_preview_id_fkey" FOREIGN KEY ("preview_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_category" ADD CONSTRAINT "project_category_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_category" ADD CONSTRAINT "project_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_category" ADD CONSTRAINT "person_category_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_category" ADD CONSTRAINT "person_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_media" ADD CONSTRAINT "social_media_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristic" ADD CONSTRAINT "characteristic_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristic" ADD CONSTRAINT "characteristic_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristic" ADD CONSTRAINT "characteristic_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_mention" ADD CONSTRAINT "media_mention_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_media_mention" ADD CONSTRAINT "project_media_mention_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_media_mention" ADD CONSTRAINT "project_media_mention_media_mention_id_fkey" FOREIGN KEY ("media_mention_id") REFERENCES "media_mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_media_mention" ADD CONSTRAINT "person_media_mention_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_media_mention" ADD CONSTRAINT "person_media_mention_media_mention_id_fkey" FOREIGN KEY ("media_mention_id") REFERENCES "media_mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cta" ADD CONSTRAINT "cta_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cta" ADD CONSTRAINT "cta_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_person" ADD CONSTRAINT "project_person_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_person" ADD CONSTRAINT "project_person_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_person" ADD CONSTRAINT "service_person_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_person" ADD CONSTRAINT "service_person_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_characteristic_list" ADD CONSTRAINT "product_characteristic_list_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_characteristic" ADD CONSTRAINT "product_characteristic_characteristic_list_id_fkey" FOREIGN KEY ("characteristic_list_id") REFERENCES "product_characteristic_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

--Custom constraints
ALTER TABLE "photo"
ADD CONSTRAINT "photo_exactly_one_owner"
CHECK (
    num_nonnulls(
        project_id,
        service_id,
        person_id,
        product_id
    ) = 1
);

ALTER TABLE "action"
ADD CONSTRAINT "action_exactly_one_owner"
CHECK (
    num_nonnulls(
        project_id,
        service_id,
        product_id
    ) = 1
);

ALTER TABLE "characteristic"
ADD CONSTRAINT "characteristic_exactly_one_owner"
CHECK (
  num_nonnulls(
    project_id,
    service_id
  ) = 1
);

ALTER TABLE "product"
ADD CONSTRAINT "product_price"
CHECK (price >= 0);

ALTER TABLE "product_characteristic"
ADD CONSTRAINT "product_characteristic_at_least_one_attribute"
CHECK (
  num_nonnulls(color, text) >= 1
);

--Partial indexes
CREATE INDEX idx_photo_project_id ON photo (project_id) WHERE project_id IS NOT NULL;

CREATE INDEX idx_photo_service_id ON photo (service_id) WHERE service_id IS NOT NULL;

CREATE INDEX idx_photo_person_id ON photo (person_id) WHERE person_id IS NOT NULL;

CREATE INDEX idx_photo_product_id ON photo (product_id) WHERE product_id IS NOT NULL;

CREATE INDEX idx_action_project_id ON action (project_id) WHERE project_id IS NOT NULL;

CREATE INDEX idx_action_service_id ON action (service_id) WHERE service_id IS NOT NULL;

CREATE INDEX idx_action_product_id ON action (product_id) WHERE product_id IS NOT NULL;

CREATE INDEX idx_characteristic_project_id ON characteristic (project_id) WHERE project_id IS NOT NULL;

CREATE INDEX idx_characteristic_service_id ON characteristic (service_id) WHERE service_id IS NOT NULL;

-- Database comments
-- Generated from docs/architecture/09-postgresql-schema.md
-- PostgreSQL table and column descriptions

-- project
COMMENT ON TABLE "project" IS 'Хранит информацию по проектам.';
COMMENT ON COLUMN "project"."id" IS 'Идентификатор проекта';
COMMENT ON COLUMN "project"."slug" IS 'Уникальный slug проекта';
COMMENT ON COLUMN "project"."title" IS 'Заголовок';
COMMENT ON COLUMN "project"."short_description" IS 'Короткое описание';
COMMENT ON COLUMN "project"."description" IS 'Основное описание';
COMMENT ON COLUMN "project"."sort_order" IS 'Порядок';
COMMENT ON COLUMN "project"."image_id" IS 'Картинка для карточки';
COMMENT ON COLUMN "project"."poster_id" IS 'Постер';
COMMENT ON COLUMN "project"."preview_id" IS 'Превью';
COMMENT ON COLUMN "project"."icon_id" IS 'Иконка';
COMMENT ON COLUMN "project"."is_main" IS 'Отображать проект в секции «Проекты» на главной странице';
COMMENT ON COLUMN "project"."is_active" IS 'true — действующий, false — завершён';
COMMENT ON COLUMN "project"."category_is_attention" IS 'Признак специального отображения блока категорий';
COMMENT ON COLUMN "project"."created_at" IS 'Дата создания';
COMMENT ON COLUMN "project"."updated_at" IS 'Дата изменения';
COMMENT ON COLUMN "project"."publication_status" IS 'Состояние публикации';

-- service
COMMENT ON TABLE "service" IS 'Хранит информацию по услугам.';
COMMENT ON COLUMN "service"."id" IS 'Идентификатор услуги';
COMMENT ON COLUMN "service"."slug" IS 'Уникальный slug услуги';
COMMENT ON COLUMN "service"."title" IS 'Заголовок';
COMMENT ON COLUMN "service"."short_description" IS 'Короткое описание';
COMMENT ON COLUMN "service"."description" IS 'Основное описание';
COMMENT ON COLUMN "service"."sort_order" IS 'Порядок';
COMMENT ON COLUMN "service"."image_id" IS 'Картинка карточки';
COMMENT ON COLUMN "service"."poster_id" IS 'Постер';
COMMENT ON COLUMN "service"."preview_id" IS 'Превью';
COMMENT ON COLUMN "service"."icon_id" IS 'Иконка';
COMMENT ON COLUMN "service"."category_icon_id" IS 'Иконка категории';
COMMENT ON COLUMN "service"."created_at" IS 'Дата создания';
COMMENT ON COLUMN "service"."updated_at" IS 'Дата изменения';
COMMENT ON COLUMN "service"."publication_status" IS 'Состояние публикации';

-- person
COMMENT ON TABLE "person" IS 'Хранит информацию по персонам.';
COMMENT ON COLUMN "person"."id" IS 'Идентификатор персоны';
COMMENT ON COLUMN "person"."slug" IS 'Уникальный slug персоны';
COMMENT ON COLUMN "person"."title" IS 'Заголовок';
COMMENT ON COLUMN "person"."short_description" IS 'Короткое описание';
COMMENT ON COLUMN "person"."description" IS 'Основное описание';
COMMENT ON COLUMN "person"."sort_order" IS 'Порядок';
COMMENT ON COLUMN "person"."image_id" IS 'Картинка карточки';
COMMENT ON COLUMN "person"."poster_id" IS 'Постер';
COMMENT ON COLUMN "person"."preview_id" IS 'Превью';
COMMENT ON COLUMN "person"."icon_id" IS 'Иконка';
COMMENT ON COLUMN "person"."created_at" IS 'Дата создания';
COMMENT ON COLUMN "person"."updated_at" IS 'Дата изменения';
COMMENT ON COLUMN "person"."publication_status" IS 'Состояние публикации';

-- product
COMMENT ON TABLE "product" IS 'Хранит информацию по товарам (мерч).';
COMMENT ON COLUMN "product"."id" IS 'Идентификатор товара';
COMMENT ON COLUMN "product"."slug" IS 'Уникальный slug товара';
COMMENT ON COLUMN "product"."title" IS 'Заголовок';
COMMENT ON COLUMN "product"."short_description" IS 'Короткое описание';
COMMENT ON COLUMN "product"."description" IS 'Основное описание';
COMMENT ON COLUMN "product"."price" IS 'Цена';
COMMENT ON COLUMN "product"."sort_order" IS 'Порядок';
COMMENT ON COLUMN "product"."image_id" IS 'Картинка карточки';
COMMENT ON COLUMN "product"."poster_id" IS 'Постер';
COMMENT ON COLUMN "product"."preview_id" IS 'Превью';
COMMENT ON COLUMN "product"."icon_id" IS 'Иконка';
COMMENT ON COLUMN "product"."requires_characteristics" IS 'Признак, что продукт требует хотя бы 1 списка характеристик';
COMMENT ON COLUMN "product"."is_available" IS 'true — товар можно купить, false — купить нельзя';
COMMENT ON COLUMN "product"."created_at" IS 'Дата создания';
COMMENT ON COLUMN "product"."updated_at" IS 'Дата изменения';
COMMENT ON COLUMN "product"."publication_status" IS 'Состояние публикации';

-- category
COMMENT ON TABLE "category" IS 'Хранит информацию по категориям.';
COMMENT ON COLUMN "category"."id" IS 'Идентификатор';
COMMENT ON COLUMN "category"."icon_id" IS 'Иконка';
COMMENT ON COLUMN "category"."text" IS 'Заголовок';

-- project_category
COMMENT ON TABLE "project_category" IS 'Хранит информацию по связи проектов с категориями.';
COMMENT ON COLUMN "project_category"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "project_category"."category_id" IS 'Ссылка на категорию';

-- person_category
COMMENT ON TABLE "person_category" IS 'Хранит информацию по связи персон с категориями.';
COMMENT ON COLUMN "person_category"."person_id" IS 'Ссылка на персону';
COMMENT ON COLUMN "person_category"."category_id" IS 'Ссылка на категорию';

-- product_category
COMMENT ON TABLE "product_category" IS 'Хранит информацию по связи товаров с категориями.';
COMMENT ON COLUMN "product_category"."product_id" IS 'Ссылка на товар';
COMMENT ON COLUMN "product_category"."category_id" IS 'Ссылка на категорию';

-- photo
COMMENT ON TABLE "photo" IS 'Хранит информацию по фотографиям.';
COMMENT ON COLUMN "photo"."id" IS 'Идентификатор';
COMMENT ON COLUMN "photo"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "photo"."service_id" IS 'Ссылка на услугу';
COMMENT ON COLUMN "photo"."person_id" IS 'Ссылка на персону';
COMMENT ON COLUMN "photo"."product_id" IS 'Ссылка на товар';
COMMENT ON COLUMN "photo"."image_id" IS 'Ссылка на изображение';

-- action
COMMENT ON TABLE "action" IS 'Хранит информацию по действиям.';
COMMENT ON COLUMN "action"."id" IS 'Идентификатор';
COMMENT ON COLUMN "action"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "action"."service_id" IS 'Ссылка на услугу';
COMMENT ON COLUMN "action"."product_id" IS 'Ссылка на товар';
COMMENT ON COLUMN "action"."icon_id" IS 'Ссылка на изображение';
COMMENT ON COLUMN "action"."url" IS 'Ссылка';
COMMENT ON COLUMN "action"."text" IS 'Лейбл';
COMMENT ON COLUMN "action"."type" IS 'Тип действия';

-- social_media
COMMENT ON TABLE "social_media" IS 'Хранит информацию по социальным сетям.';
COMMENT ON COLUMN "social_media"."id" IS 'Идентификатор';
COMMENT ON COLUMN "social_media"."person_id" IS 'Ссылка на персону';
COMMENT ON COLUMN "social_media"."icon_id" IS 'Ссылка на изображение';
COMMENT ON COLUMN "social_media"."url" IS 'Ссылка на ресурс';
COMMENT ON COLUMN "social_media"."text" IS 'Текст';

-- characteristic
COMMENT ON TABLE "characteristic" IS 'Хранит информацию по характеристикам.';
COMMENT ON COLUMN "characteristic"."id" IS 'Идентификатор';
COMMENT ON COLUMN "characteristic"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "characteristic"."service_id" IS 'Ссылка на услугу';
COMMENT ON COLUMN "characteristic"."icon_id" IS 'Ссылка на иконку';
COMMENT ON COLUMN "characteristic"."title" IS 'Заголовок';
COMMENT ON COLUMN "characteristic"."value" IS 'Значения';

-- media_mention
COMMENT ON TABLE "media_mention" IS 'Хранит информацию по упоминаниям в СМИ.';
COMMENT ON COLUMN "media_mention"."id" IS 'Идентификатор';
COMMENT ON COLUMN "media_mention"."image_id" IS 'Ссылка на изображение СМИ';
COMMENT ON COLUMN "media_mention"."title" IS 'Название СМИ';
COMMENT ON COLUMN "media_mention"."text" IS 'Заголовок статьи';
COMMENT ON COLUMN "media_mention"."url" IS 'Ссылка на исходный материал';

-- project_media_mention
COMMENT ON TABLE "project_media_mention" IS 'Хранит информацию по связям упоминаний в СМИ и проектов.';
COMMENT ON COLUMN "project_media_mention"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "project_media_mention"."media_mention_id" IS 'Ссылка на упоминание в СМИ';

-- person_media_mention
COMMENT ON TABLE "person_media_mention" IS 'Хранит информацию по связям упоминаний в СМИ и персон.';
COMMENT ON COLUMN "person_media_mention"."person_id" IS 'Ссылка на персону';
COMMENT ON COLUMN "person_media_mention"."media_mention_id" IS 'Ссылка на упоминание в СМИ';

-- event
COMMENT ON TABLE "event" IS 'Хранит информацию по событиям.';
COMMENT ON COLUMN "event"."id" IS 'Идентификатор';
COMMENT ON COLUMN "event"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "event"."place" IS 'Место проведения';
COMMENT ON COLUMN "event"."date_time" IS 'Дата и время';
COMMENT ON COLUMN "event"."label" IS 'Подпись';
COMMENT ON COLUMN "event"."is_active" IS 'Признак актуальности события, устанавливается администратором';

-- cta
COMMENT ON TABLE "cta" IS 'Хранит информацию по CTA.';
COMMENT ON COLUMN "cta"."id" IS 'Идентификатор';
COMMENT ON COLUMN "cta"."service_id" IS 'Ссылка на услугу';
COMMENT ON COLUMN "cta"."icon_id" IS 'Ссылка на иконку';
COMMENT ON COLUMN "cta"."text" IS 'Подпись';

-- project_person
COMMENT ON TABLE "project_person" IS 'Хранит информацию по связи проектов с персонами.';
COMMENT ON COLUMN "project_person"."id" IS 'Идентификатор';
COMMENT ON COLUMN "project_person"."project_id" IS 'Ссылка на проект';
COMMENT ON COLUMN "project_person"."person_id" IS 'Ссылка на персону';
COMMENT ON COLUMN "project_person"."role" IS 'Роль';
COMMENT ON COLUMN "project_person"."extra" IS 'Пояснение';

-- service_person
COMMENT ON TABLE "service_person" IS 'Хранит информацию по связи услуг с персонами.';
COMMENT ON COLUMN "service_person"."id" IS 'Идентификатор';
COMMENT ON COLUMN "service_person"."service_id" IS 'Ссылка на услугу';
COMMENT ON COLUMN "service_person"."person_id" IS 'Ссылка на персону';
COMMENT ON COLUMN "service_person"."role" IS 'Роль';
COMMENT ON COLUMN "service_person"."extra" IS 'Пояснение';

-- product_characteristic_list
COMMENT ON TABLE "product_characteristic_list" IS 'Хранит информацию по списку характеристик по товару.';
COMMENT ON COLUMN "product_characteristic_list"."id" IS 'Идентификатор';
COMMENT ON COLUMN "product_characteristic_list"."product_id" IS 'Ссылка на товар';
COMMENT ON COLUMN "product_characteristic_list"."title" IS 'Заголовок';

-- product_characteristic
COMMENT ON TABLE "product_characteristic" IS 'Хранит информацию по характеристикам по товару.';
COMMENT ON COLUMN "product_characteristic"."id" IS 'Идентификатор';
COMMENT ON COLUMN "product_characteristic"."characteristic_list_id" IS 'Ссылка на список характеристик';
COMMENT ON COLUMN "product_characteristic"."color" IS 'Цвет';
COMMENT ON COLUMN "product_characteristic"."text" IS 'Пояснение';

-- image
COMMENT ON TABLE "image" IS 'Хранит метаданные изображений, размещённых в объектном хранилище.';
COMMENT ON COLUMN "image"."id" IS 'Идентификатор';
COMMENT ON COLUMN "image"."storage_key" IS 'Ключ хранилища';
COMMENT ON COLUMN "image"."mime_type" IS 'MIME-тип';
COMMENT ON COLUMN "image"."width" IS 'Ширина';
COMMENT ON COLUMN "image"."height" IS 'Высота';
COMMENT ON COLUMN "image"."size" IS 'Размер';
COMMENT ON COLUMN "image"."created_at" IS 'Дата создания';

