# CV Skills & Concepts — Tasks & Notes App

> Realistic summary of what was built and learned in this project.  
> Use this to update your resume, LinkedIn, or portfolio — keep claims aligned with what exists in the repo.

---

## Project Summary (1–2 lines for CV)

**Tasks & Notes App** — Full-stack monorepo with a NestJS REST API (JWT auth, RBAC, PostgreSQL) and a Next.js frontend scaffold. Backend is feature-complete for users and tasks; frontend is set up but not yet connected to the API.

---

## What Was Built

### Backend (NestJS API — production-oriented patterns)

- Modular REST API with **Auth**, **Users**, and **Tasks** feature modules
- **JWT authentication** — login endpoint, Passport JWT strategy, Bearer token validation
- **Role-based access control (RBAC)** — `user` and `admin` roles with guards and a custom `@Roles()` decorator
- **User management** — registration, CRUD, bcrypt password hashing (12 rounds), password excluded from API responses
- **Task management** — CRUD with filtering, pagination, sorting, and user-scoped reads
- **PostgreSQL + TypeORM** — entities, relations (`OneToMany` / `ManyToOne`), enums, unique constraints
- **Global error handling** — standardized error response shape via a custom exception filter
- **Input validation** — DTOs with `class-validator`, global `ValidationPipe` (whitelist, transform)
- **Database seeding** — idempotent seed script with sample users and tasks
- **Monorepo dev workflow** — run API and web concurrently from the root

### Frontend (Next.js — scaffold stage)

- Next.js 16 App Router project with React 19 and Tailwind CSS 4
- Default starter layout and page — **no auth UI or task pages yet**
- Ready to connect to the API at `http://localhost:3001`

### Not yet built (do not claim on CV unless marked "in progress")

- Notes feature (despite project name)
- Frontend API integration (login, task list, forms)
- Production database migrations (currently uses TypeORM `synchronize: true` in dev)
- Comprehensive test coverage (mostly scaffold unit tests)

---

## Technical Skills (realistic proficiency)

| Skill | Level | Evidence in this project |
|-------|-------|--------------------------|
| **TypeScript** | Intermediate | Entire API, DTOs, decorators, interfaces |
| **NestJS** | Intermediate | Modules, DI, guards, pipes, interceptors, filters |
| **REST API design** | Intermediate | Auth, users, tasks endpoints with consistent response envelope |
| **PostgreSQL** | Beginner–Intermediate | Schema design, FK relations, enums, seed data |
| **TypeORM** | Intermediate | Entities, repositories, QueryBuilder, async module config |
| **JWT / Passport** | Intermediate | Login flow, JWT strategy, protected routes |
| **Authentication & security** | Intermediate | bcrypt hashing, token expiry, RBAC, field exclusion |
| **Validation & DTOs** | Intermediate | class-validator, class-transformer, mapped types |
| **Monorepo setup** | Beginner | npm workspaces-style layout, concurrently scripts |
| **Next.js / React** | Beginner | Scaffold only — App Router, Tailwind 4 configured |
| **Testing (Jest)** | Beginner | Scaffold tests exist; not a focus yet |
| **Git** | Beginner–Intermediate | Feature commits, monorepo refactor, docs |

*Levels: Beginner = used with guidance; Intermediate = can implement independently; Advanced = would need more production experience to claim.*

---

## Concepts Learned

### Architecture & design

- **Monorepo structure** — separate `apps/api` and `apps/web` with shared root scripts
- **Feature-based modules** — each domain (auth, users, tasks) owns its controller, service, DTOs, and entities
- **Separation of concerns** — controllers handle HTTP, services hold business logic, entities map to DB
- **API response envelope** — consistent `{ success, data, meta? }` and error `{ success, status, message, path, timestamp }`

### NestJS patterns

- **Dependency injection** — services injected via constructors; modules export/import providers
- **Guards** — `JwtAuthGuard` for authentication, `RolesGuard` for authorization
- **Custom decorators** — `@CurrentUser()` to inject JWT payload into route handlers
- **Global pipes** — `ValidationPipe` with whitelist and transform for safe, typed input
- **Global filters** — `HttpExceptionFilter` for uniform error responses
- **Interceptors** — `ClassSerializerInterceptor` to strip sensitive fields (`@Exclude()` on password)
- **Async module registration** — `TypeOrmModule.forRootAsync`, `JwtModule.registerAsync` with `ConfigService`

### Authentication & authorization

- **Stateless JWT auth** — no server-side sessions; token carries `sub`, `email`, `role`
- **Password security** — never store plain text; hash on create/update; compare on login
- **RBAC** — role metadata on routes + guard that checks `request.user.role`
- **Route protection** — public routes (login, register) vs JWT-protected vs admin-only
- **Resource scoping** — list/find tasks filtered by authenticated user ID

### Database & ORM

- **Entity relationships** — User has many Tasks; Task belongs to User
- **Enums in DB** — role (`user` \| `admin`), priority (`low` \| `medium` \| `high`)
- **QueryBuilder** — dynamic filters, pagination (`skip`/`take`), sorting
- **Referential integrity** — `onDelete: RESTRICT` on task → user FK
- **Seeding** — standalone TypeORM `DataSource` script, idempotent inserts

### API best practices

- **DTO validation** — required fields, string length, enum values at the boundary
- **Partial updates** — `UpdateUserDto` / `UpdateTaskDto` with optional fields
- **Query params** — typed `TasksQueryDto` for filter, page, limit, sort
- **HTTP status codes** — 401 unauthorized, 404 not found, 400 bad request
- **Environment config** — `.env` for DB credentials and JWT secret

### DevOps & workflow

- **Concurrent dev servers** — API on `:3001`, web on `:3000`
- **Env example files** — `.env.example` documents required variables
- **README documentation** — setup, endpoints, auth flow for onboarding

---

## Resume Bullet Points (copy-paste ready)

Pick 3–5 that match the role you're applying for:

- Built a **NestJS REST API** in a monorepo with modular architecture (Auth, Users, Tasks) and PostgreSQL persistence via TypeORM
- Implemented **JWT authentication** with Passport, bcrypt password hashing, and 1-hour token expiry
- Designed **role-based access control (RBAC)** using custom guards and decorators for admin-only routes
- Developed **task CRUD APIs** with QueryBuilder-based filtering, pagination, sorting, and user-scoped reads
- Applied **global validation and error handling** — ValidationPipe, custom exception filter, standardized API responses
- Modeled a **relational PostgreSQL schema** with TypeORM entities, enums, and one-to-many user–task relations
- Wrote an **idempotent database seed script** for local development with sample users and tasks
- Scaffolded a **Next.js 16 + React 19** frontend with Tailwind CSS 4 in the same monorepo (API integration planned)
- Configured a **monorepo dev workflow** using concurrently to run backend and frontend in parallel

---

## Skills Section for CV (grouped)

**Languages:** TypeScript, JavaScript  
**Backend:** NestJS, Node.js, REST APIs, Passport.js, JWT  
**Database:** PostgreSQL, TypeORM, SQL (schema design, relations, seeding)  
**Security:** bcrypt, RBAC, input validation, sensitive field exclusion  
**Frontend:** Next.js, React, Tailwind CSS *(scaffold stage)*  
**Tools:** Git, npm, concurrently, ESLint, Jest *(basic)*  
**Concepts:** Dependency injection, modular architecture, DTOs, guards, decorators, exception filters, monorepos

---

## Interview Talking Points

Things you can explain confidently from this project:

1. **Walk through the login flow** — email/password → bcrypt compare → JWT sign → Bearer header on protected routes
2. **How RBAC works** — `@Roles('admin')` sets metadata → `RolesGuard` reads it → compares to `request.user.role`
3. **Why DTOs and ValidationPipe** — validate and strip unknown fields before they reach your service
4. **TypeORM relations** — how `user_id` FK links tasks to users; why `RESTRICT` on delete
5. **Task list scoping** — QueryBuilder adds `WHERE user.id = :userId` from JWT so users only see their tasks
6. **Global exception filter** — one place to shape all errors; validation errors normalized to a readable message
7. **Monorepo tradeoffs** — shared scripts at root, independent `package.json` per app, single repo for full-stack feature work

---

## Honest "In Progress" / Next Steps

Good to mention if asked what you're learning next:

- Connect Next.js frontend to the API (login form, token storage, protected routes)
- Add Notes module (same patterns as Tasks)
- Enforce task ownership on update/delete (currently only read is scoped)
- Replace `synchronize: true` with TypeORM migrations for production
- Add e2e tests for auth and task flows
- Deploy API (Railway, Render, etc.) and web (Vercel)

---

## Keywords for ATS / job boards

```
TypeScript, NestJS, Node.js, REST API, PostgreSQL, TypeORM, JWT, Passport,
bcrypt, RBAC, authentication, authorization, class-validator, DTO,
dependency injection, guards, decorators, exception filters, monorepo,
Next.js, React, Tailwind CSS, Git, npm, API design, CRUD, pagination
```

---

*Last updated: August 2026 — reflects backend work through JWT auth, RBAC, task scoping, seed script, and global error handling.*
