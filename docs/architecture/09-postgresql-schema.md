# PostgreSQL Schema

## 1. Общие принципы

- PostgreSQL используется как основная реляционная СУБД.
- Идентификаторы сущностей хранятся в формате UUID.
- Все временные поля хранятся в UTC.
- Имена таблиц и колонок — в `snake_case`.
- Для обязательных полей используется `NOT NULL`.
- Связи между таблицами задаются через `FOREIGN KEY`.
- Для уникальных бизнес-идентификаторов используются `UNIQUE` constraints.

---

## 2. Таблица `projects`

### Назначение

Хранит информацию по проектам.

### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор проекта |
| slug | TEXT | Нет | UNIQUE | Уникальный slug проекта |
| title | TEXT | Нет |  | Заголовок |
| short_description | TEXT | Да |  | Короткое описание |
| description | TEXT | Да |  | Основное описание |
| order | NUMBER | Да |  | Порядок |
| image | TEXT | Да |  | Картинка |
| is_main | BOOLEAN | Нет | DEFAULT false | Отображать на главной |
| is_active | BOOLEAN | Нет | DEFAULT true | Активный проект |
| created_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата создания |
| updated_at | TIMESTAMPTZ | Нет | DEFAULT now() | Дата изменения |

### Ограничения

- `slug` должен быть уникальным среди проектов.
- `is_main` по умолчанию равен `false`.
- `is_active` по умолчанию равен `true`.

### Индексы

- уникальный индекс по `slug`;
- индекс по `is_active`, если выборка активных проектов используется часто.

---

## 3. Таблица `project_history`

### Назначение

Хранит события истории проекта.

### Поля

| Поле | Тип | NULL | Ограничения | Описание |
|---|---|---:|---|---|
| id | UUID | Нет | PK | Идентификатор события |
| project_id | UUID | Нет | FK → projects.id | Проект |
| place | TEXT | Нет |  | Место |
| event_date | DATE | Нет |  | Дата |
| event_time | TIME | Да |  | Время |
| is_active | BOOLEAN | Нет | DEFAULT false | Активное событие |

### Связи

```text
projects 1 ─── N project_history