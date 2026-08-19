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

### Связи

```text
Project 1 ─── 0..N Photo
Project 1 ─── 0..N Category
Project 1 ─── 0..N ProjectPerson
Project 1 ─── 0..N Characteristic
Project 1 ─── 0..N MediaMention
Project 1 ─── 0..N Button
Project 1 ─── 0..N Occurrence
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
- isMain
- isActive

### Связи

```text
Service 1 ─── 0..N Photo
Service 1 ─── 0..N Category
Service 1 ─── 0..N ServicePerson
Service 1 ─── 0..N Characteristic
Service 1 ─── 0..N Button
Service 1 ─── 0..1 CTA
Service 1 ─── 0..N Occurrence
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
- isMain
- isActive

### Связи

```text
Person 1 ─── 0..N Photo
Person 1 ─── 1..N Category
Person 1 ─── 0..N ProjectPerson
Person 1 ─── 0..N ServicePerson
Person 1 ─── 0..N SocialMedia
Person 1 ─── 0..N MediaMention
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
- isMain
- isActive

### Связи

```text
Product 1 ─── 0..N Photo
Product 1 ─── 1..N Category
Product 1 ─── 0..N ProductCharacteristicList
Product 1 ─── 0..N Button
```

## Category

### Атрибуты

- id
- icon
- text
- isAttention

### Связи

```text
Category 1 ─── 1..1 Owner

Owner = Project | Service | Person | Product
```

## Photo

### Атрибуты

- id
- url

### Связи

```text
Photo 1 ─── 1..1 Owner

Owner = Project | Service | Person | Product
```

## Button

### Атрибуты

- id
- url
- icon
- text

### Связи

```text
Button 1 ─── 1..1 Owner

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
SocialMedia 1 ─── 1..1 Owner

Owner = Project | Service | Person | Product
```

## Characteristic

### Атрибуты

- id
- title

### Связи

```text
Characteristic 1 ─── 1..1 Owner
Characteristic 1 ─── 1..N CharacteristicBlock

Owner = Project | Service
```

## CharacteristicBlock

### Атрибуты

- id
- icon
- title
- value

### Связи

```text
CharacteristicBlock 1 ─── 1..1 Characteristic
```

## MediaMention

### Атрибуты

- id
- image
- title
- text

### Связи

```text
MediaMention 1 ─── 1..1 Owner

Owner = Project | Person
```

## Occurrence

### Атрибуты

- id
- place
- date
- time
- isActive

### Связи

```text
Occurrence 1 ─── 1..1 Owner

Owner = Project | Service
```

## CTA

### Атрибуты

- id
- icon
- text

### Связи

```text
CTA 1 ─── 1..1 Owner

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
ProductCharacteristicList 1 ─── 1..N ProductCharacteristic
```

## ProductCharacteristic

### Атрибуты

- id
- color
- title

### Связи

```text
ProductCharacteristic 1 ─── 1..1 ProductCharacteristicList
```
