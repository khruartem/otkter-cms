# Publication Validation Matrix

## 1. Назначение

Документ описывает правила валидации, которые должны быть выполнены перед переходом сущности из состояния `draft` в `published`.

Проверки выполняются на уровне application layer.

PostgreSQL допускает хранение неполных draft-записей и гарантирует только структурную целостность данных через:

- `PRIMARY KEY`;
- `FOREIGN KEY`;
- `NOT NULL`;
- `UNIQUE`;
- `CHECK`;
- delete policy.

Publication validation отвечает за бизнес-полноту сущности.

---

## 2. Общие правила публикации

Для публикации любой root-сущности должны выполняться базовые условия:

- `publication_status = draft` перед выполнением операции публикации;
- `title` заполнен;
- `slug` заполнен и уникален внутри соответствующего типа сущности;
- карточочное изображение `image_id` задано;
- `short_description` заполнен, поскольку используется в карточках сущностей на публичном сайте (публикация карточки без описания не допускается);
- все связанные сущности должны существовать и быть валидны;
- после успешной проверки `publication_status` изменяется на `published`.

Если хотя бы одно обязательное условие не выполнено, публикация отклоняется.

---

## 3. Матрица обязательности

Обозначения:

- `DB` — обязательно всегда на уровне БД;
- `R` — обязательно для публикации;
- `O` — необязательно;
- `—` — не применяется;
- `C` — обязательно при выполнении дополнительного условия (conditional).

| Поле / правило | Project | Service | Person | Product |
|---|---:|---:|---:|---:|
| `title` | DB | DB | DB | DB |
| `slug` | DB | DB | DB | DB |
| `image_id` | R | R | R | R |
| `short_description` | R | R | R | R |
| `description` | O | O | O | O |
| `poster_id` | O | O | O | O |
| `preview_id` | O | O | O | O |
| `icon_id` | O | O | O | O |
| минимум одна `Category` | R | R | R | R |
| `price` | — | — | — | R |
| минимум одна `Photo` | O | O | O | O |
| минимум один `Action` | O | O | O | O |
| минимум один `Person` | O | O | — | — |
| минимум одна `Characteristic` | O | O | — | — |
| минимум один `Event` | O | — | — | — |
| минимум один `ProductCharacteristicList` | — | — | — | C |

---

## 4. Project

Перед публикацией проекта application layer проверяет:

### Обязательно

- `title` заполнен;
- `slug` заполнен;
- `slug` уникален среди проектов;
- `image_id` задан;
- назначена минимум одна `Category`;
- `short_description` заполнен.

### Не влияет на публикацию

- `is_main`;
- `description`.

---

## 5. Service

Перед публикацией услуги application layer проверяет:

### Обязательно

- `title` заполнен;
- `slug` заполнен;
- `slug` уникален среди услуг;
- `image_id` задан;
- назначена минимум одна `Category`;
- `short_description` заполнен.

### Не влияет на публикацию

- `is_main`;
- `description`.

---

## 6. Person

Перед публикацией персоны application layer проверяет:

### Обязательно

- `title` заполнен;
- `slug` заполнен;
- `slug` уникален среди персон;
- `image_id` задан;
- назначена минимум одна `Category`;
- `short_description` заполнен.

### Не влияет на публикацию

- `is_main`;
- `description`.

---

## 7. Product

Для `Product` наличие `ProductCharacteristicList` является условно обязательным.

Если `requires_characteristics = true`, для публикации требуется минимум один
`ProductCharacteristicList`, содержащий минимум один `ProductCharacteristic`.

Если `requires_characteristics = false`, товар может быть опубликован без списка характеристик.

Если список характеристик создан независимо от значения
`requires_characteristics`, при публикации он не должен быть пустым.

Перед публикацией товара application layer проверяет:

### Обязательно

- `title` заполнен;
- `slug` заполнен;
- `slug` уникален среди товаров;
- `image_id` задан;
- назначена минимум одна `Category`;
- `price` задана;
- `short_description` заполнен;
- если `requires_characteristics = true`, создан минимум один `ProductCharacteristicList`, содержащий минимум один `ProductCharacteristic`;
- если `ProductCharacteristicList` создан, он не должен быть пустым.

### Не влияет на публикацию

- `is_main`;
- `description`.

---

## 8. Поведение операции публикации

Publication flow:

```text
draft
  ↓
load entity and relations
  ↓
validate publication requirements
  ↓
validation failed?
  ├── yes → return validation errors
  └── no
       ↓
publication_status = published
```

Изменение `publication_status` выполняется только после успешного прохождения всех проверок.

Проверка и изменение статуса должны выполняться как одна application-level операция.

---

## 9. Ошибки валидации

Application layer должен возвращать ошибки по конкретным невыполненным условиям.

Пример:

```json
{
  "code": "PUBLICATION_VALIDATION_FAILED",
  "errors": [
    {
      "field": "image_id",
      "message": "Для публикации необходимо добавить изображение карточки"
    },
    {
      "field": "categories",
      "message": "Для публикации необходимо выбрать минимум одну категорию"
    }
  ]
}
```

Не следует возвращать только общий ответ:

```text
Entity cannot be published
```

поскольку администратору CMS необходимо понимать, какие данные требуется заполнить.

---

## 10. Принципы развития

Publication validation может расширяться независимо от физической схемы БД.

Добавление нового требования к опубликованной сущности не обязательно приводит к добавлению `NOT NULL` или другого database constraint, если поле должно оставаться необязательным для `draft`.

При изменении требований обновляются:

1. `06-business-rules.md`;
2. `10-publication-validation-matrix.md`;
3. application-level validator;
4. тесты publication flow.