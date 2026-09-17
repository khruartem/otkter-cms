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

Все изображения хранятся как отдельные записи в таблице `images`.

`images` представляет физический медиа-объект и не привязан напрямую к конкретному типу сущности.

Пример:

```text
images
- id
- storage_key
- mime_type
- width
- height
- size
```

Другие таблицы ссылаются на `images` через foreign keys.

Пример для `projects`:

```text
image_id
poster_id
preview_id
icon_id
```

Каждое поле имеет собственный смысл и ссылается на `images.id`.

### Галерея

`Photo` рассматривается не как физическое изображение, а как использование изображения в галерее.

Пример:

```text
photos
- id
- image_id
- ...
```

`photos.image_id` ссылается на `images.id`.

В дальнейшем `Photo` может содержать дополнительные атрибуты:

- `order`
- `alt`
- `caption`

### Почему отдельная таблица `images`

- изображения не дублируются между таблицами;
- метаданные файла хранятся централизованно;
- проще управлять заменой и удалением файлов;
- одна модель хранения используется для всех типов изображений;
- можно независимо менять способ формирования публичного URL.

### Почему `storage_key`, а не полный URL

В БД хранится ключ объекта в S3-compatible storage, например:

```text
projects/esenin/poster-abc123.webp
```

Публичный URL формируется приложением или CDN.

Это позволяет менять домен, bucket или CDN без обновления записей в БД.

### Компромисс

Добавляется отдельная таблица и дополнительные foreign keys, но это принято ради централизованного управления медиа и независимости от конкретного storage URL.

## 4. Список Таблиц

### Таблица `projects`

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
| image_id | UUID | Нет | FK → images.id | Картинка для карточки |
| poster_id | UUID | Нет | FK → images.id | Постер |
| preview_id | UUID | Нет | FK → images.id | Превью |
| icon_id | UUID | Нет | FK → images.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

#### Связи

```text
projects 0 ─── N images
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

### Таблица `services`

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
| image_id | UUID | Нет | FK → images.id | Картинка карточки |
| poster_id | UUID | Нет | FK → images.id | Постер |
| preview_id | UUID | Нет | FK → images.id | Превью |
| icon_id | UUID | Нет | FK → images.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

```text
services 0 ─── N images
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

### Таблица `persons`

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
| image_id | UUID | Нет | FK → images.id | Картинка карточки |
| poster_id | UUID | Нет | FK → images.id | Постер |
| preview_id | UUID | Нет | FK → images.id | Превью |
| icon_id | UUID | Нет | FK → images.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

```text
persons 0 ─── N images
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
| image_id | UUID | Нет | FK → images.id | Картинка карточки |
| poster_id | UUID | Нет | FK → images.id | Постер |
| preview_id | UUID | Нет | FK → images.id | Превью |
| icon_id | UUID | Нет | FK → images.id | Иконка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

```text
products 0 ─── N images
```

#### Ограничения

- `slug` должен быть уникальным.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

#### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.