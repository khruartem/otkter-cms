# OTKTER CMS

[Русский](./README.md) | **English**

Content Management System for the **Открытая Территория** website.

The project is being developed as a full-stack application with a focus on software architecture, domain modeling, API design, code quality, testing, and production engineering practices.

## About

**OTKTER CMS** is an administration system for managing content published on the Открытая Территория website.

The CMS is designed to manage:

- projects;
- services;
- people;
- categories;
- media files;
- additional content and metadata;
- content publication state.

In addition to solving a real-world problem, the project is used for an in-depth exploration of modern full-stack and backend development — from domain analysis and database design to testing, containerization, and deployment.

---

## Architecture

The project is organized as a **monorepo** containing two main applications:

```text
otkter-cms/
│
├── apps/
│   ├── admin/              # React application
│   └── api/                # NestJS API
│
├── packages/               # Shared packages
├── docs/                   # Project documentation
├── docker/                 # Docker configuration
│
├── README.md
├── README.en.md
├── package.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

The backend is designed as a **modular monolith**.

```text
API
│
├── Auth
├── Projects
├── Services
├── People
├── Categories
├── Media
└── Common
```

The architecture will evolve together with the project requirements. Additional infrastructure components will only be introduced when there is a real use case for them.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- CSS Modules / SCSS

### Backend

- Node.js
- TypeScript
- NestJS
- REST API
- OpenAPI / Swagger

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT / HttpOnly Cookies
- Argon2

### Validation

- DTO
- class-validator
- class-transformer

### File Storage

- S3-compatible object storage

### Testing

- Jest
- Unit tests
- Integration tests
- E2E tests

### Infrastructure

- Docker
- Docker Compose
- GitHub Actions
- CI/CD

---

## Engineering Principles

### Domain-first design

The project starts with understanding the domain rather than choosing database tables or implementing framework abstractions.

```text
Domain Analysis
      ↓
Use Cases
      ↓
Domain Model
      ↓
Data Model
      ↓
API Design
      ↓
Architecture
      ↓
Implementation
```

### Modular architecture

The backend is divided into domain-oriented modules with clearly defined responsibilities and boundaries.

### Explicit contracts

Communication between the frontend and backend is based on explicitly defined API contracts.

### Database fundamentals

Prisma is used as an ORM, but database design is based on an understanding of PostgreSQL, SQL, relational modeling, constraints, indexes, and transactions rather than relying solely on ORM abstractions.

### Production-oriented development

Validation, error handling, security, testing, migrations, logging, and deployment are treated as integral parts of the application architecture.

### No unnecessary complexity

Redis, message queues, brokers, microservices, and other infrastructure components are introduced only when there is a real requirement they need to solve.

---

## Documentation

Engineering documentation is stored in the `docs` directory.

Planned structure:

```text
docs/
│
├── domain/
│   ├── domain-overview.md
│   ├── glossary.md
│   ├── use-cases.md
│   └── domain-model.md
│
├── architecture/
│   ├── database-design.md
│   ├── architecture.md
│   └── diagrams/
│
├── api/
│   ├── rest-api.md
│   └── authentication.md
│
└── adr/
```

Significant architectural decisions will be documented using **Architecture Decision Records (ADR)**.

Examples:

```text
adr/
├── 001-use-monorepo.md
├── 002-use-postgresql.md
├── 003-use-nestjs.md
└── 004-use-modular-monolith.md
```

This makes it possible to understand not only **what** technologies and approaches are used, but also **why** particular architectural decisions were made.

---

## Roadmap

### 1. Domain Design

- [ ] Domain Overview
- [ ] Glossary
- [ ] Use Cases
- [ ] Domain Model

### 2. Data Design

- [ ] Entity relationships
- [ ] ER diagram
- [ ] PostgreSQL schema
- [ ] Constraints
- [ ] Index strategy
- [ ] Prisma schema
- [ ] Database migrations

### 3. API Design

- [ ] REST resources
- [ ] API contracts
- [ ] Error model
- [ ] Validation strategy
- [ ] OpenAPI specification

### 4. Backend

- [ ] NestJS setup
- [ ] Application configuration
- [ ] Projects module
- [ ] Services module
- [ ] People module
- [ ] Categories module
- [ ] Media module
- [ ] Authentication
- [ ] Authorization
- [ ] File storage
- [ ] Error handling
- [ ] Logging

### 5. Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

### 6. Frontend

- [ ] Application architecture
- [ ] Authentication
- [ ] Projects management
- [ ] Services management
- [ ] People management
- [ ] Media management
- [ ] API integration
- [ ] Error handling

### 7. Infrastructure

- [ ] Docker
- [ ] Docker Compose
- [ ] PostgreSQL container
- [ ] CI pipeline
- [ ] Automated tests
- [ ] Production deployment

### 8. Production Readiness

- [ ] Structured logging
- [ ] Health checks
- [ ] Security review
- [ ] Performance analysis
- [ ] Database query analysis
- [ ] Observability

---

## Local Development

Local development instructions will be added as the corresponding project components are implemented.

The development environment will eventually be started using Docker Compose:

```bash
docker compose up
```

Individual applications will also support local development:

```bash
pnpm install
pnpm dev
```

---

## Project Status

🚧 **Active development**

The project is currently in the **domain analysis and system design phase**.

Backend implementation will begin after the initial domain model, data model, and API contracts have been defined.

---

## 👨‍💻 Developer

The project is developed and maintained by [@khruartem](https://github.com/khruartem).

---

## 📞 Contact

For questions and suggestions, please contact the project maintainer via GitHub Issues.

---

**Made with ❤️ for [Открытая Территория](https://otkter.ru/)**

---

## License

MIT