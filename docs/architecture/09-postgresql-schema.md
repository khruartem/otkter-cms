# PostgreSQL Schema

## 1. Общие принципы

- PostgreSQL используется как основная реляционная СУБД.
- Идентификаторы сущностей имеют тип `UUID` и по умолчанию генерируются PostgreSQL через `gen_random_uuid()`.
- Все временные поля хранятся в UTC.
- Имена таблиц и колонок — в `snake_case`.
- Для обязательных полей используется `NOT NULL`.
- Связи между таблицами задаются через `FOREIGN KEY`.
- Для уникальных бизнес-идентификаторов используются `UNIQUE` constraints.

## 2. Owner strategy

Для сущностей, которые могут принадлежать одному из нескольких типов владельцев, используются отдельные nullable foreign keys.

Пример для `photo`:

- `project_id`
- `service_id`
- `person_id`
- `product_id`

Каждый внешний ключ ссылается на соответствующую таблицу.

На уровне PostgreSQL используется `CHECK`, гарантирующий, что заполнен ровно один внешний ключ владельца.

```sql
CHECK (
  num_nonnulls(
    project_id,
    service_id,
    person_id,
    product_id
  ) = 1
)
```

### Почему выбран этот подход

- сохраняется ссылочная целостность средствами PostgreSQL;
- допустимые типы владельцев задаются явно;
- не требуется дополнительная техническая сущность;
- схема остается простой и прозрачной.

### Почему не `owner_type + owner_id`

Такой подход не позволяет использовать обычный `FOREIGN KEY`, потому что `owner_id` может ссылаться на разные таблицы.

Проверку существования владельца пришлось бы переносить в application layer или триггеры.

### Почему не общий supertype

Вариант с общей сущностью вроде `ContentEntity` был отклонен, потому что:

- добавляет дополнительный технический уровень модели;
- усложняет связи и запросы;
- не решает полностью проблему допустимых типов владельцев.

Например, если `Characteristic` может принадлежать только `Project` или `Service`, обычный `FOREIGN KEY` на `ContentEntity` все равно не запретит связать ее с `Person`.

### Компромисс

При добавлении нового типа владельца потребуется миграция:

- добавить новый nullable foreign key;
- обновить `CHECK`.

Это принято как допустимый компромисс ради явной структуры и строгой ссылочной целостности.

## 3. Image strategy

Все изображения хранятся как отдельные записи в таблице `image`.

`image` представляет физический медиа-объект и не привязан напрямую к конкретному типу сущности.

Пример:

```text
image
- id
- storage_key
- mime_type
- width
- height
- size
```

Другие таблицы ссылаются на `image` через foreign keys.

Пример для `project`:

```text
image_id
poster_id
preview_id
icon_id
```

Каждое поле имеет собственный смысл и ссылается на `image.id`.

### Галерея

`Photo` рассматривается не как физическое изображение, а как использование изображения в галерее.

Пример:

```text
photos
- id
- image_id
- ...
```

`photos.image_id` ссылается на `image.id`.

В дальнейшем `Photo` может содержать дополнительные атрибуты:

- `sort_order`
- `alt`
- `caption`

### Почему отдельная таблица `image`

- изображения не дублируются между таблицами;
- метаданные файла хранятся централизованно;
- проще управлять заменой и удалением файлов;
- одна модель хранения используется для всех типов изображений;
- можно независимо менять способ формирования публичного URL.

### Почему `storage_key`, а не полный URL

В БД хранится ключ объекта в S3-compatible storage, например:

```text
project/esenin/poster-abc123.webp
```

Публичный URL формируется приложением или CDN.

Это позволяет менять домен, bucket или CDN без обновления записей в БД.

### Компромисс

Добавляется отдельная таблица и дополнительные foreign keys, но это принято ради централизованного управления медиа и независимости от конкретного storage URL.

## 4. Publication strategy

Для сущностей, публикуемых на публичном сайте, состояние публикации хранится отдельно от признака бизнес-активности.

Поддерживаются два состояния:

- `draft` — черновик, может содержать неполные данные;
- `published` — опубликованная сущность, доступная публичному сайту.

Физически состояние публикации хранится в поле:

```text
publication_status
```

Для поля используется `TEXT` с ограничением:

```sql
CHECK (
  publication_status IN ('draft', 'published')
)
```

Значение по умолчанию:

```sql
DEFAULT 'draft'
```

### Отличие от `is_active`

`publication_status` отвечает за факт публикации сущности.

`is_active` отвечает за отображение сущности как действующая/завершенная.

Например:

```text
publication_status = published
is_active = false
```

означает, что сущность опубликована, но помечена как неактивная.

### Проверка при публикации

Черновик может содержать неполные данные.

Обязательные для публикации поля проверяются на уровне application layer при переходе из `draft` в `published`.

Ограничения `NOT NULL` используются только для данных, без которых сама запись не имеет смысла независимо от состояния публикации.

### Применение

`publication_status` добавляется в таблицы:

- `project`
- `service`
- `person`
- `product`

Пример поля:

```text
| publication_status | TEXT | Нет | DEFAULT 'draft', CHECK (...) | Состояние публикации |
```

## 5. Delete policy

Политика удаления определяется семантикой связи.

Используются следующие стратегии:

- `CASCADE` — для зависимых сущностей, которые не имеют смысла без владельца;
- `RESTRICT` — если удаление родительской записи недопустимо, пока существуют зависимости;
- `SET NULL` — если зависимая сущность может продолжать существовать без ссылки.

Правило выбирается отдельно для каждого foreign key.

| Связь | `ON DELETE` | Почему |
|---|---|---|
| `project/service/person/product.image_id → image.id` | `RESTRICT` | Используемое карточочное изображение нельзя удалить, пока на него ссылается основная сущность |
| `project/service/person/product.(poster_id, preview_id, icon_id) → image.id` | `SET NULL` | Основная сущность может существовать без изображения |
| `category.icon_id → image.id` | `SET NULL` | Категория может существовать без иконки |
| `photo.image_id → image.id` | `RESTRICT` | `Photo` без физического изображения не имеет смысла |
| `photo.*_owner_id → root.id` | `CASCADE` | Фото является частью конкретного владельца |
| `action.icon_id → image.id` | `SET NULL` | Действие может существовать без иконки |
| `action.*_owner_id → root.id` | `CASCADE` | Action принадлежит владельцу |
| `social_media.icon_id → image.id` | `SET NULL` | Ссылка на соцсеть может существовать без иконки |
| `social_media.person_id → person.id` | `CASCADE` | SocialMedia не существует независимо от Person |
| `characteristic.icon_id → image.id` | `SET NULL` | Характеристика может существовать без иконки |
| `characteristic.*_owner_id → root.id` | `CASCADE` | Характеристика принадлежит одному владельцу |
| `media_mention.image_id → image.id` | `RESTRICT` | Упоминание не может существовать без изображения |
| `cta.icon_id → image.id` | `SET NULL` | CTA может существовать без иконки |
| `cta.*_owner_id → root.id` | `CASCADE` | CTA является частью владельца |
| `event.project_id → project.id` | `CASCADE` | Event не существует без Project |
| `product_characteristic_list.product_id → product.id` | `CASCADE` | Список характеристик является частью Product |
| `product_characteristic.characteristic_list_id → product_characteristic_list.id` | `CASCADE` | Элемент не существует без списка |
| все FK в `*_category` | `CASCADE` | Join-row не имеет смысла без любого участника |
| все FK в `*_media_mention` | `CASCADE` | Join-row не имеет самостоятельного смысла |
| `project_person.project_id → project.id` | `CASCADE` | Связь не существует без Project |
| `project_person.person_id → person.id` | `CASCADE` | Связь не существует без Person |
| `service_person.service_id → service.id` | `CASCADE` | Связь не существует без Service |
| `service_person.person_id → person.id` | `CASCADE` | Связь не существует без Person |

## 6. Index strategy

Индексы создаются исходя из реальных сценариев чтения, соединения и удаления данных.

Основные правила:

- `PRIMARY KEY` и `UNIQUE` автоматически создают индексы;
- дополнительные индексы для таких колонок не создаются;
- PostgreSQL не создаёт индекс автоматически для `FOREIGN KEY`;
- наличие `FOREIGN KEY` само по себе не является достаточной причиной для создания индекса;
- FK индексируется исходя из сценариев чтения, JOIN, удаления и ожидаемого объёма данных;
- для polymorphic owner columns допускаются partial indexes с условием `IS NOT NULL`;
- для составных PK учитывается порядок колонок;
- индексы по boolean-полям не создаются без подтверждённого сценария;
- сложные и partial indexes добавляются под конкретные запросы и проверяются через `EXPLAIN ANALYZE`.

## 7. UUID generation strategy

Идентификаторы сущностей имеют тип `UUID`.

UUID генерируется на стороне PostgreSQL с использованием `gen_random_uuid()`.

Пример:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

## 8. Timestamp strategy

Для сущностей с полями `created_at` и `updated_at`:

- `created_at` устанавливается при создании записи;
- `updated_at` устанавливается при создании записи и обновляется application layer при каждом изменении сущности.

На уровне PostgreSQL оба поля имеют начальное значение:

```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

## 9. Integrity strategy

Правила целостности разделяются между PostgreSQL и application layer.

### PostgreSQL

На уровне БД гарантируются правила, нарушение которых создаёт некорректное состояние данных:

- primary и foreign keys;
- уникальность business identifiers;
- допустимые значения ограниченных полей;
- ровно один владелец polymorphic owned entities;
- отсутствие дублирующих строк в association tables;
- корректное поведение при удалении связанных данных.

### Application layer

На уровне application layer проверяются правила, зависящие от состояния и бизнес-контекста:

- полнота данных при переходе `draft → published`;
- наличие обязательных для публикации изображений;
- наличие минимум одной категории у `Person` и `Product`;
- другие требования к публикации, которые не должны ограничивать неполные draft-записи.

Такие проверки выполняются до изменения состояния сущности на `published`.

## 10. Список Таблиц

### Таблица `project`

#### Назначение

Хранит информацию по проектам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор проекта |
| slug | TEXT | Нет | UNIQUE | Уникальный slug проекта |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| sort_order | INTEGER | Да |  | Порядок |
| image_id | UUID | Да | FK → image.id | Картинка для карточки |
| poster_id | UUID | Да | FK → image.id | Постер |
| preview_id | UUID | Да | FK → image.id | Превью |
| icon_id | UUID | Да | FK → image.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать проект в секции «Проекты» на главной странице |
| is_active | BOOLEAN | Нет | DEFAULT true | true — действующий, false — завершён |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |
| publication_status | TEXT | Нет | DEFAULT 'draft' | Состояние публикации |

#### Связи

```text
project.image   0..1 → 1 image
project.poster  0..1 → 1 image
project.preview 0..1 → 1 image
project.icon    0..1 → 1 image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.
- `publication_status` может принимать только значения `draft` или `published`.

#### Индексы

- уникальный индекс по `slug`;

---

### Таблица `service`

#### Назначение

Хранит информацию по услугам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор услуги |
| slug | TEXT | Нет | UNIQUE | Уникальный slug услуги |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| sort_order | INTEGER | Да |  | Порядок |
| image_id | UUID | Да | FK → image.id | Картинка карточки |
| poster_id | UUID | Да | FK → image.id | Постер |
| preview_id | UUID | Да | FK → image.id | Превью |
| icon_id | UUID | Да | FK → image.id | Иконка |
| is_active | BOOLEAN | Нет | DEFAULT true | true — действующий, false — завершён |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |
| publication_status | TEXT | Нет | DEFAULT 'draft' | Состояние публикации |

```text
service.image   0..1 → 1 image
service.poster  0..1 → 1 image
service.preview 0..1 → 1 image
service.icon    0..1 → 1 image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_active` по умолчанию равен `true`.
- `publication_status` может принимать только значения `draft` или `published`.

#### Индексы

- уникальный индекс по `slug`;

---

### Таблица `person`

#### Назначение

Хранит информацию по персонам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор персоны |
| slug | TEXT | Нет | UNIQUE | Уникальный slug персоны |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| sort_order | INTEGER | Да |  | Порядок |
| image_id | UUID | Да | FK → image.id | Картинка карточки |
| poster_id | UUID | Да | FK → image.id | Постер |
| preview_id | UUID | Да | FK → image.id | Превью |
| icon_id | UUID | Да | FK → image.id | Иконка |
| is_active | BOOLEAN | Нет | DEFAULT true | true — действующий, false — завершён |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |
| publication_status | TEXT | Нет | DEFAULT 'draft' | Состояние публикации |

```text
person.image   0..1 → 1 image
person.poster  0..1 → 1 image
person.preview 0..1 → 1 image
person.icon    0..1 → 1 image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_active` по умолчанию равен `true`.
- `publication_status` может принимать только значения `draft` или `published`.

#### Индексы

- уникальный индекс по `slug`;

---

### Таблица `product`

#### Назначение

Хранит информацию по товарам (мерч).

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор товара |
| slug | TEXT | Нет | UNIQUE | Уникальный slug товара |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| price | NUMERIC(10,2) | Да |  | Цена |
| sort_order | INTEGER | Да |  | Порядок |
| image_id | UUID | Да | FK → image.id | Картинка карточки |
| poster_id | UUID | Да | FK → image.id | Постер |
| preview_id | UUID | Да | FK → image.id | Превью |
| icon_id | UUID | Да | FK → image.id | Иконка |
| requires_characteristics | BOOLEAN | Нет | DEFAULT false | Признак, что продукт требует хотя бы 1 списка характеристик |
| is_active | BOOLEAN | Нет | DEFAULT true | true — действующий, false — завершён |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |
| publication_status | TEXT | Нет | DEFAULT 'draft' | Состояние публикации |

```text
product.image   0..1 → 1 image
product.poster  0..1 → 1 image
product.preview 0..1 → 1 image
product.icon    0..1 → 1 image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_active` по умолчанию равен `true`.
- CHECK (price >= 0).
- `publication_status` может принимать только значения `draft` или `published`.

#### Индексы

- уникальный индекс по `slug`;

---

### Таблица `category`

#### Назначение

Хранит информацию по категориям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| icon_id | UUID | Да | FK → image.id | Иконка |
| text | TEXT | Нет |  | Заголовок |
| is_attention | BOOLEAN | Нет | DEFAULT false | Признак "Обратить внимание" |

```text
category.icon 0..1 → 1 image
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `project_category`

#### Назначение

Хранит информацию по связи проектов с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
project_category 1 ─── 1 project
project_category 1 ─── 1 category
```

#### Ограничения

PRIMARY KEY (project_id, category_id)

#### Индексы

`CREATE INDEX idx_project_category_category_id ON project_category (category_id);`

---

### Таблица `service_category`

#### Назначение

Хранит информацию по связи услуг с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| service_id | UUID | Нет | FK → service.id | Ссылка на услугу |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
service_category 1 ─── 1 service
service_category 1 ─── 1 category
```

#### Ограничения

PRIMARY KEY (service_id, category_id)

#### Индексы

`CREATE INDEX idx_service_category_category_id ON service_category (category_id);`

---

### Таблица `person_category`

#### Назначение

Хранит информацию по связи персон с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
person_category 1 ─── 1 person
person_category 1 ─── 1 category
```

#### Ограничения

PRIMARY KEY (person_id, category_id)

#### Индексы

`CREATE INDEX idx_person_category_category_id ON person_category (category_id);`

---

### Таблица `product_category`

#### Назначение

Хранит информацию по связи товаров с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| product_id | UUID | Нет | FK → product.id | Ссылка на товар |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
product_category 1 ─── 1 product
product_category 1 ─── 1 category
```

#### Ограничения

PRIMARY KEY (product_id, category_id)

#### Индексы

`CREATE INDEX idx_product_category_category_id ON product_category (category_id);`

---

### Таблица `photo`

#### Назначение

Хранит информацию по фотографиям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| project_id | UUID | Да | FK → project.id | Ссылка на проект |
| service_id | UUID | Да | FK → service.id | Ссылка на услугу |
| person_id | UUID | Да | FK → person.id | Ссылка на персону |
| product_id | UUID | Да | FK → product.id | Ссылка на товар |
| image_id | UUID | Нет | FK → image.id | Ссылка на изображение |

```text
photo.project_id  0..1 → 1 project
photo.service_id  0..1 → 1 service
photo.person_id   0..1 → 1 person
photo.product_id  0..1 → 1 product
photo.image 1 → 1 image
```

#### Ограничения

На уровне PostgreSQL используется `CHECK`, гарантирующий, что заполнен ровно один внешний ключ владельца.

```sql
CHECK (
  num_nonnulls(
    project_id,
    service_id,
    person_id,
    product_id
  ) = 1
)
```

#### Индексы

- `CREATE INDEX idx_photo_project_id ON photo (project_id) WHERE project_id IS NOT NULL;`
- `CREATE INDEX idx_photo_service_id ON photo (service_id) WHERE service_id IS NOT NULL;`
- `CREATE INDEX idx_photo_person_id ON photo (person_id) WHERE person_id IS NOT NULL;`
- `CREATE INDEX idx_photo_product_id ON photo (product_id) WHERE product_id IS NOT NULL;`
- `CREATE INDEX idx_photo_image_id ON photo (image_id);`

---

### Таблица `action`

#### Назначение

Хранит информацию по действиям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| project_id | UUID | Да | FK → project.id | Ссылка на проект |
| service_id | UUID | Да | FK → service.id | Ссылка на услугу |
| person_id | UUID | Да | FK → person.id | Ссылка на персону |
| product_id | UUID | Да | FK → product.id | Ссылка на товар |
| icon_id | UUID | Да | FK → image.id | Ссылка на изображение |
| url | TEXT | Нет | Нет | Ссылка |
| text | TEXT | Нет | Нет | Лейбл |
| type | TEXT | Нет | Доступны только значения: `primary`, `secondary` | Тип действия |

```text
action.project_id  0..1 → 1 project
action.service_id  0..1 → 1 service
action.person_id   0..1 → 1 person
action.product_id  0..1 → 1 product
action.icon 0..1 → 1 image
```

#### Ограничения

На уровне PostgreSQL используется `CHECK`, гарантирующий, что заполнен ровно один внешний ключ владельца.

```sql
CHECK (
  num_nonnulls(
    project_id,
    service_id,
    person_id,
    product_id
  ) = 1
)
```

CHECK (type IN ('primary', 'secondary'))

#### Индексы

- `CREATE INDEX idx_action_project_id ON action (project_id) WHERE project_id IS NOT NULL;`
- `CREATE INDEX idx_action_service_id ON action (service_id) WHERE service_id IS NOT NULL;`
- `CREATE INDEX idx_action_person_id ON action (person_id) WHERE person_id IS NOT NULL;`
- `CREATE INDEX idx_action_product_id ON action (product_id) WHERE product_id IS NOT NULL;`

---

### Таблица `social_media`

#### Назначение

Хранит информацию по социальным сетям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| icon_id | UUID | Да | FK → image.id | Ссылка на изображение |
| url | TEXT | Нет | Нет | Ссылка на ресурс |
| title | TEXT | Нет | Нет | Заголовок |

```text
social_media 1 ─── 1 person
social_media.icon 0..1 → 1 image
```

#### Ограничения

Нет

#### Индексы

`CREATE INDEX idx_social_media_person_id ON social_media (person_id);`

---

### Таблица `characteristic`

#### Назначение

Хранит информацию по характеристикам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| project_id | UUID | Да | FK → project.id | Ссылка на проект |
| service_id | UUID | Да | FK → service.id | Ссылка на услугу |
| icon_id | UUID | Да | FK → image.id | Ссылка на иконку |
| title | TEXT | Нет | Нет | Заголовок |
| value | TEXT[] | Нет | Нет | Значения |

```text
characteristic.project_id  0..1 → 1 project
characteristic.service_id  0..1 → 1 service
characteristic.icon 0..1 → 1 image
```

#### Ограничения

На уровне PostgreSQL используется `CHECK`, гарантирующий, что заполнен ровно один внешний ключ владельца.

```sql
CHECK (
  num_nonnulls(
    project_id,
    service_id
  ) = 1
)
```

#### Индексы

- `CREATE INDEX idx_characteristic_project_id ON characteristic (project_id) WHERE project_id IS NOT NULL;`
- `CREATE INDEX idx_characteristic_service_id ON characteristic (service_id) WHERE service_id IS NOT NULL;`

---

### Таблица `media_mention`

#### Назначение

Хранит информацию по упоминаниям в СМИ.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| image_id | UUID | Нет | FK → image.id | Ссылка на изображение СМИ |
| title | TEXT | Нет | Нет | Название СМИ |
| text | TEXT | Нет | Нет | Заголовок статьи |

```text
media_mention.image 1 → 1 image
```

#### Ограничения

Нет

#### Индексы

- `CREATE INDEX idx_media_mention_image_id ON media_mention (image_id);`

---

### Таблица `project_media_mention`

#### Назначение

Хранит информацию по связям упоминаний в СМИ и проектов.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| media_mention_id | UUID | Нет | FK → media_mention.id | Ссылка на упоминание в СМИ |

```text
project_media_mention 1 ─── 1 project
project_media_mention 1 ─── 1 media_mention
```

#### Ограничения

PRIMARY KEY (project_id, media_mention_id)

#### Индексы

`CREATE INDEX idx_project_media_mention_media_mention_id ON project_media_mention (media_mention_id);`

---

### Таблица `person_media_mention`

#### Назначение

Хранит информацию по связям упоминаний в СМИ и персон.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| media_mention_id | UUID | Нет | FK → media_mention.id | Ссылка на упоминание в СМИ |

```text
person_media_mention 1 ─── 1 person
person_media_mention 1 ─── 1 media_mention
```

#### Ограничения

PRIMARY KEY(person_id, media_mention_id)

#### Индексы

`CREATE INDEX idx_person_media_mention_media_mention_id ON person_media_mention (media_mention_id);`

---

### Таблица `event`

#### Назначение

Хранит информацию по событиям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| place | TEXT | Нет | Нет | Место проведения |
| date_time | TIMESTAMPTZ | Нет | Нет | Дата и время |
| label | TEXT | Да | Нет | Подпись |
| is_active | BOOLEAN | Нет | DEFAULT true | Признак актуальности события, устанавливается администратором |

```text
event 1 ─── 1 project
```

#### Ограничения

Нет

#### Индексы

`CREATE INDEX idx_event_project_id ON event (project_id);`

---

### Таблица `cta`

#### Назначение

Хранит информацию по CTA.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| project_id | UUID | Да | FK → project.id | Ссылка на проект |
| service_id | UUID | Да | FK → service.id | Ссылка на услугу |
| person_id | UUID | Да | FK → person.id | Ссылка на персону |
| product_id | UUID | Да | FK → product.id | Ссылка на товар |
| icon_id | UUID | Да | FK → image.id | Ссылка на иконку |
| text | TEXT | Да | Нет | Подпись |

```text
cta.project_id  0..1 → 1 project
cta.service_id  0..1 → 1 service
cta.person_id   0..1 → 1 person
cta.product_id 0..1 → 1 product
```

#### Ограничения

На уровне PostgreSQL используется `CHECK`, гарантирующий, что заполнен ровно один внешний ключ владельца.

```sql
CHECK (
  num_nonnulls(
    project_id,
    service_id,
    person_id,
    product_id
  ) = 1
)
```

#### Индексы

- `CREATE INDEX idx_cta_project_id ON cta (project_id) WHERE project_id IS NOT NULL;`
- `CREATE INDEX idx_cta_service_id ON cta (service_id) WHERE service_id IS NOT NULL;`
- `CREATE INDEX idx_cta_person_id ON cta (person_id) WHERE person_id IS NOT NULL;`
- `CREATE INDEX idx_cta_product_id ON cta (product_id) WHERE product_id IS NOT NULL;`

---

### Таблица `project_person`

#### Назначение

Хранит информацию по связи проектов с персонами.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| role | TEXT | Да | Нет | Роль |
| extra | TEXT | Да | Нет | Пояснение |

```text
project_person 1 ─── 1 project
project_person 1 ─── 1 person
```

#### Ограничения

Нет

#### Индексы

- `CREATE INDEX idx_project_person_project_id ON project_person (project_id);`
- `CREATE INDEX idx_project_person_person_id ON project_person (person_id);`

---

### Таблица `service_person`

#### Назначение

Хранит информацию по связи услуг с персонами.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| service_id | UUID | Нет | FK → service.id | Ссылка на услугу |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| role | TEXT | Да | Нет | Роль |
| extra | TEXT | Да | Нет | Пояснение |

```text
service_person 1 ─── 1 service
service_person 1 ─── 1 person
```

#### Ограничения

Нет

#### Индексы

- `CREATE INDEX idx_service_person_service_id ON service_person (service_id);`
- `CREATE INDEX idx_service_person_person_id ON service_person (person_id);`

---

### Таблица `product_characteristic_list`

#### Назначение

Хранит информацию по списку характеристик по товару.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| product_id | UUID | Нет | FK → product.id | Ссылка на товар |
| title | TEXT | Да | Нет | Заголовок |
| extra | TEXT | Да | Нет | Пояснение |

```text
product_characteristic_list 1 ─── 1 product
```

#### Ограничения

Нет

#### Индексы

`CREATE INDEX idx_product_characteristic_list_product_id ON product_characteristic_list (product_id);`

---

### Таблица `product_characteristic`

#### Назначение

Хранит информацию по характеристикам по товару.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| characteristic_list_id | UUID | Нет | FK → product_characteristic_list.id | Ссылка на список характеристик |
| color | TEXT | Да | Нет | Цвет |
| text | TEXT | Да | Нет | Пояснение |

```text
product_characteristic 1 ─── 1 product_characteristic_list
```

#### Ограничения

Нет

#### Индексы

`CREATE INDEX idx_product_characteristic_characteristic_list_id ON product_characteristic (characteristic_list_id);`

---

### Таблица `image`

#### Назначение

Хранит метаданные изображений, размещённых в объектном хранилище.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK DEFAULT gen_random_uuid() | Идентификатор |
| storage_key | TEXT | Нет | UNIQUE | Ключ хранилища |
| mime_type | TEXT | Да | Нет | MIME-тип |
| width | INTEGER | Да | Нет | Ширина |
| height | INTEGER | Да | Нет | Высота |
| size | BIGINT | Да | Нет | Размер |
| created_at | TIMESTAMPTZ | Нет | `DEFAULT now()` | Дата создания |

#### Ограничения

Нет

#### Индексы

Нет