# ER Model

## Назначение

Документ описывает логическую модель данных системы.

Модель фиксирует:

- сущности;
- ключевые атрибуты сущностей;
- связи между сущностями;
- кардинальности связей;
- association entities;
- обязательность участия сущностей в связях.

Физическая реализация в PostgreSQL описывается отдельно в `09-postgresql-schema.md`.

---

## Project

### Атрибуты

- id
- slug
- title
- shortDescription
- description
- order
- image
- poster
- preview
- icon
- isMain
- isActive
- publicationStatus

### Связи

```text
Project 1 ─── 0..N Photo
Project 1 ─── 0..N ProjectCategory
Project 1 ─── 0..N ProjectPerson
Project 1 ─── 0..N Characteristic
Project 1 ─── 0..N ProjectMediaMention
Project 1 ─── 0..N Action
Project 1 ─── 0..N Event
Project 1 ─── 0..1 Image

```

## Service

### Атрибуты

- id
- slug
- title
- shortDescription
- description
- order
- image
- poster
- preview
- icon
- publicationStatus

### Связи

```text
Service 1 ─── 0..N Photo
Service 1 ─── 0..N ServiceCategory
Service 1 ─── 0..N ServicePerson
Service 1 ─── 0..N Characteristic
Service 1 ─── 0..N Action
Service 1 ─── 0..1 CTA
Service 1 ─── 0..1 Image
```

## Person

### Атрибуты

- id
- slug
- title
- shortDescription
- description
- order
- image
- poster
- preview
- icon
- publicationStatus

### Связи

```text
Person 1 ─── 0..N Photo
Person 1 ─── 0..N PersonCategory
Person 1 ─── 0..N ProjectPerson
Person 1 ─── 0..N ServicePerson
Person 1 ─── 0..N SocialMedia
Person 1 ─── 0..N PersonMediaMention
Person 1 ─── 0..1 Image
```

## Product

### Атрибуты

- id
- slug
- title
- shortDescription
- description
- price
- order
- image
- poster
- preview
- icon
- isAvailable
- requiresCharacteristics
- publicationStatus

### Связи

```text
Product 1 ─── 0..N Photo
Product 1 ─── 0..N ProductCategory
Product 1 ─── 0..N ProductCharacteristicList
Product 1 ─── 0..N Action
Product 1 ─── 0..1 Image
```

## Category

### Атрибуты

- id
- icon
- text
- isAttention

### Связи

```text
Category 1 ─── 0..N ProjectCategory
Category 1 ─── 0..N ServiceCategory
Category 1 ─── 0..N PersonCategory
Category 1 ─── 0..N ProductCategory
Category 1 ─── 0..1 Image
```

## ProjectCategory

### Атрибуты

- projectId
- categoryId

### Связи

```text
ProjectCategory 1 ─── 1 Category
ProjectCategory 1 ─── 1 Project
```

## ServiceCategory

### Атрибуты

- serviceId
- categoryId

### Связи

```text
ServiceCategory 1 ─── 1 Category
ServiceCategory 1 ─── 1 Service
```

## PersonCategory

### Атрибуты

- personId
- categoryId

### Связи

```text
PersonCategory 1 ─── 1 Category
PersonCategory 1 ─── 1 Person
```

## ProductCategory

### Атрибуты

- productId
- categoryId

### Связи

```text
ProductCategory 1 ─── 1 Category
ProductCategory 1 ─── 1 Product
```

## Photo

### Атрибуты

- id

### Связи

```text
Photo 1 ─── 1..1 Owner
Photo 1 ─── 1..1 Image

Owner = Project | Service | Person | Product
```

## Action

### Атрибуты

- id
- type
- url
- icon
- text

### Связи

```text
Action 1 ─── 1..1 Owner
Action 1 ─── 0..1 Image

Owner = Project | Service | Person | Product
```

## SocialMedia

### Атрибуты

- id
- url
- icon
- text

### Связи

```text
SocialMedia 1 ─── 1..1 Person
SocialMedia 1 ─── 0..1 Image
```

## Characteristic

### Атрибуты

- id
- icon
- title
- value

### Связи

```text
Characteristic 1 ─── 1..1 Owner
Characteristic 1 ─── 0..1 Image

Owner = Project | Service
```

## MediaMention

### Атрибуты

- id
- image
- title
- text

### Связи

```text
MediaMention 1 ─── 0..N ProjectMediaMention
MediaMention 1 ─── 0..N PersonMediaMention
MediaMention 1 ─── 1..1 Image
```

## ProjectMediaMention

### Атрибуты

- projectId
- mediaMentionId

### Связи

```text
ProjectMediaMention 1 ─── 1 MediaMention
ProjectMediaMention 1 ─── 1 Project
```

## PersonMediaMention

### Атрибуты

- personId
- mediaMentionId

### Связи

```text
PersonMediaMention 1 ─── 1 MediaMention
PersonMediaMention 1 ─── 1 Person
```

## Event

### Атрибуты

- id
- place
- dateTime
- isActive

### Связи

```text
Event 1 ─── 1..1 Project
```

## CTA

### Атрибуты

- id
- icon
- text

### Связи

```text
CTA 1 ─── 1..1 Owner
CTA 1 ─── 0..1 Image

Owner = Project | Service | Person | Product
```

## ProjectPerson

### Атрибуты

- id
- role
- extra

### Связи

```text
ProjectPerson 1 ─── 1..1 Project
ProjectPerson 1 ─── 1..1 Person
```

## ServicePerson

### Атрибуты

- id
- role
- extra

### Связи

```text
ServicePerson 1 ─── 1..1 Service
ServicePerson 1 ─── 1..1 Person
```

## ProductCharacteristicList

### Атрибуты

- id
- title

### Связи

```text
ProductCharacteristicList 1 ─── 1..1 Product
ProductCharacteristicList 1 ─── 0..N ProductCharacteristic
```

## ProductCharacteristic

### Атрибуты

- id
- color
- text

### Связи

```text
ProductCharacteristic 1 ─── 1..1 ProductCharacteristicList
```

## Image

### Атрибуты

- id

### Связи

Нет