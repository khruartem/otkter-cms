# PostgreSQL Schema

## 1. Общие принципы

- PostgreSQL используется как основная реляционная СУБД.
- Идентификаторы сущностей хранятся в формате UUID.
- Все временные поля хранятся в UTC.
- Имена таблиц и колонок — в `snake_case`.
- Для обязательных полей используется `NOT NULL`.
- Связи между таблицами задаются через `FOREIGN KEY`.
- Для уникальных бизнес-идентификаторов используются `UNIQUE` constraints.

## 2. Owner strategy

Для сущностей, которые могут принадлежать одному из нескольких типов владельцев, используются отдельные nullable foreign keys.

Пример для `categories`:

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

- `order`
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

## 4. Список Таблиц

### Таблица `project`

#### Назначение

Хранит информацию по проектам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор проекта |
| slug | TEXT | Нет | UNIQUE | Уникальный slug проекта |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| order | NUMBER | Да |  | Порядок |
| image_id | UUID | Нет | FK → image.id | Картинка для карточки |
| poster_id | UUID | Нет | FK → image.id | Постер |
| preview_id | UUID | Нет | FK → image.id | Превью |
| icon_id | UUID | Нет | FK → image.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

#### Связи

```text
project 0 ─── N image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

### Таблица `service`

#### Назначение

Хранит информацию по услугам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор услуги |
| slug | TEXT | Нет | UNIQUE | Уникальный slug услуги |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| order | NUMBER | Да |  | Порядок |
| image_id | UUID | Нет | FK → image.id | Картинка карточки |
| poster_id | UUID | Нет | FK → image.id | Постер |
| preview_id | UUID | Нет | FK → image.id | Превью |
| icon_id | UUID | Нет | FK → image.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

```text
service 0 ─── N image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

### Таблица `person`

#### Назначение

Хранит информацию по услугам.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| slug | TEXT | Нет | UNIQUE | Уникальный slug персоны |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| order | NUMBER | Да |  | Порядок |
| image_id | UUID | Нет | FK → image.id | Картинка карточки |
| poster_id | UUID | Нет | FK → image.id | Постер |
| preview_id | UUID | Нет | FK → image.id | Превью |
| icon_id | UUID | Нет | FK → image.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

```text
person 0 ─── N image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

### Таблица `product`

#### Назначение

Хранит информацию по товарам (мерч).

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| slug | TEXT | Нет | UNIQUE | Уникальный slug персоны |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| price | NUMBER | Да |  | Цена |
| order | NUMBER | Да |  | Порядок |
| image_id | UUID | Нет | FK → image.id | Картинка карточки |
| poster_id | UUID | Нет | FK → image.id | Постер |
| preview_id | UUID | Нет | FK → image.id | Превью |
| icon_id | UUID | Нет | FK → image.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

```text
product 0 ─── N image
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

### Таблица `category`

#### Назначение

Хранит информацию по категориям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| service_id | UUID | Нет | FK → service.id | Ссылка на услугу |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| product_id | UUID | Нет | FK → product.id | Ссылка на товар |
| icon_id | UUID | Нет | FK → image.id | Иконка |
| text | TEXT | Нет |  | Заголовок |
| is_attention | BOOLEAN | Нет | DEFAULT false | Признак "Обратить внимание" |

```text
category 0 ─── N image
category 1 ─── 1 project
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_attention` по умолчанию равен `false`.

#### Индексы

Нет

---

### Таблица `project_category`

#### Назначение

Хранит информацию по связи проектов с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| category_id | UUID | Нет | FK → service.id | Ссылка на услугу |

```text
project_category 1 ─── 1 project
project_category 1 ─── 1 category
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `service_category`

#### Назначение

Хранит информацию по связи услуг с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| service_id | UUID | Нет | FK → service.id | Ссылка на проект |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
service_category 1 ─── 1 service
service_category 1 ─── 1 category
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `person_category`

#### Назначение

Хранит информацию по связи персон с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
person_category 1 ─── 1 person
person_category 1 ─── 1 category
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `product_category`

#### Назначение

Хранит информацию по связи товаров с категориями.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| product_id | UUID | Нет | FK → product.id | Ссылка на товар |
| category_id | UUID | Нет | FK → category.id | Ссылка на категорию |

```text
product_category 1 ─── 1 product
product_category 1 ─── 1 category
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `photo`

#### Назначение

Хранит информацию по фотографиям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| service_id | UUID | Нет | FK → service.id | Ссылка на услугу |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| product_id | UUID | Нет | FK → product.id | Ссылка на товар |
| image_id | UUID | Нет | FK → image.id | Ссылка на изображение |

```text
photo 1 ─── 1 projects
photo 1 ─── 1 service
photo 1 ─── 1 person
photo 1 ─── 1 product
photo 1 ─── 1 image
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

Нет

---

### Таблица `action`

#### Назначение

Хранит информацию по действиям.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| service_id | UUID | Нет | FK → service.id | Ссылка на услугу |
| person_id | UUID | Нет | FK → person.id | Ссылка на персону |
| product_id | UUID | Нет | FK → product.id | Ссылка на товар |
| icon_id | UUID | Нет | FK → image.id | Ссылка на изображение |
| url | TEXT | Нет | Нет | Ссылка |
| text | TEXT | Нет | Нет | Лейбл |

```text
action 1 ─── 1 projects
action 1 ─── 1 service
action 1 ─── 1 person
action 1 ─── 1 product
action 1 ─── 1 image
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

Нет

---

### Таблица `social_media`

#### Назначение

Хранит информацию по упоминаниям в СМИ.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| icon_id | UUID | Нет | FK → image.id | Ссылка на изображение |
| url | TEXT | Нет | Нет | Ссылка на ресурс |
| title | TEXT | Нет | Нет | Заголовок |

```text
social_media 1 ─── 1 image
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `project_social_media`

#### Назначение

Хранит информацию по связи проектов с упоминаниям в СМИ.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| project_id | UUID | Нет | FK → project.id | Ссылка на проект |
| social_media_id | UUID | Нет | FK → social_media.id | Ссылка на упоминание в СМИ |

```text
project_social_media 1 ─── 1 project
project_social_media 1 ─── 1 social_media
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `service_social_media`

#### Назначение

Хранит информацию по связи услуг с упоминаниям в СМИ.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| service_id | UUID | Нет | FK → service.id | Ссылка на услугу |
| social_media_id | UUID | Нет | FK → social_media.id | Ссылка на упоминание в СМИ |

```text
service_social_media 1 ─── 1 service
service_social_media 1 ─── 1 social_media
```

#### Ограничения

Нет

#### Индексы

Нет

---

### Таблица `person_social_media`

#### Назначение

Хранит информацию по связи персон с упоминаниям в СМИ.

#### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор персоны |
| person_id | UUID | Нет | FK → service.id | Ссылка на персону |
| social_media_id | UUID | Нет | FK → social_media.id | Ссылка на упоминание в СМИ |

```text
person_social_media 1 ─── 1 person
person_social_media 1 ─── 1 social_media
```

#### Ограничения

Нет

#### Индексы

Нет