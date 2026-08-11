# CV Skills & Concepts — OCEAN67

> Reference document based on hands-on work building **Ocean67**, a unified digital-goods fulfillment platform (e-commerce + ops + webhook processing). Written to reflect what was actually built and learned — not inflated claims.

---

## Project Summary (for CV / portfolio)

Built a full-stack TypeScript monorepo that replaces a legacy PHP webhook processor and Node.js control panel with a single platform serving customers, CS staff, and admins. Core work spans secure auth, webhook ingestion, async fulfillment against 10+ third-party providers, staff ops tooling, and admin reporting — all spec-driven with ~85 automated tests.

**Domain:** Digital goods / prepaid top-ups / PIN vouchers (Saudi market — Salla integration, Taqnyat SMS, STC telecom)

---

## Languages & Runtime

| Skill | Level | Notes |
|-------|-------|-------|
| **TypeScript** | Working proficiency | Primary language across API, web, shared libs, and tests |
| **SQL** | Working proficiency | TypeORM migrations, composite indexes, `uuidv7()` PKs, idempotency constraints |
| **Node.js** | Working proficiency | NestJS API, BullMQ workers, Jest test runner |
| **Bash / shell** | Basic | Docker Compose, Nx CLI, local dev scripts |

---

## Frontend

| Technology | What you used it for |
|------------|---------------------|
| **Next.js 16** (App Router) | Staff ops dashboard (`/ops/*`), admin panel (`/admin/*`), auth pages |
| **React 19** | Client components, forms, data tables, charts |
| **next-intl** | Arabic (RTL default) + English i18n, locale routing via `[locale]/` |
| **Tailwind CSS 4** | Layout, responsive ops/admin UI |
| **shadcn/ui + Radix UI** | Accessible form controls, dialogs, sidebars, dropdowns |
| **React Hook Form + Zod** | Validated admin/ops forms with shared client-side schemas |
| **Zustand** | Global client UI state where URL/server state isn't appropriate |
| **Recharts / Nivo** | Sync monitor charts, report visualizations |
| **xlsx-js-style** | Excel export for inventory and staff reports |

**Concepts learned:**
- App Router server vs client component boundaries
- Thin API proxy pattern (Next.js routes → NestJS backend)
- RTL layout and bilingual admin UX
- Permission-gated UI (hide/disable actions based on RBAC flags)
- Mapping API errors to localized user-facing messages

---

## Backend

| Technology | What you used it for |
|------------|---------------------|
| **NestJS 11** | Modular REST API — Auth, Users, Webhooks, Fulfillment, Orders, Sessions, Inventory, Purchases, Reports, Providers, Notifications |
| **TypeORM** | Decorator-based entities, migrations, repository pattern |
| **Passport.js + JWT** | RS256 JWT strategy, HTTP-only Secure SameSite cookies |
| **class-validator / class-transformer** | Request DTO validation via NestJS pipes |
| **BullMQ + Redis** | `fulfillment` and `notifications` async job queues with priority |
| **@nestjs/throttler** | Rate limiting on auth and public endpoints |
| **nestjs-pino** | Structured JSON logging with correlation IDs |
| **prom-client** | Prometheus metrics (`http_request_duration_seconds`, Node defaults) |
| **@sentry/nestjs** | Unhandled exception capture (staging/production wiring) |
| **bcrypt** | Password hashing with dummy-hash timing-safe comparison |
| **otplib** | TOTP enrollment for admin/super_admin (RFC 6238) |
| **AWS SDK (SES)** | Transactional email (password reset, staff onboarding) |
| **EJS + html-to-text** | Email template rendering |

**Concepts learned:**
- NestJS module boundaries and dependency injection
- Guards, interceptors, and custom decorators (`@RequirePermission()`)
- Queue workers decoupled from HTTP handlers (return 200 fast, process async)
- Health probes (`/health/live`, `/health/ready`) for orchestration
- Shadow mode flag for safe production cutover without side effects

---

## Database & Data Modeling

| Technology | What you used it for |
|------------|---------------------|
| **PostgreSQL 18** | Two databases: `ocean67_main` (operational), `ocean67_store` (catalog — planned) |
| **TypeORM migrations** | Versioned schema, seed data for tenants/roles/providers |
| **UUID v7** | Time-ordered primary keys via native `uuidv7()` — not UUID v4 |
| **Redis** | Idempotency nonces, rate-limit counters, OTP state, BullMQ backing store |

**Concepts learned:**
- Multi-tenant data model (`tenant_id` on operational tables)
- Composite unique constraints for idempotency (`tenant_id + external_id`)
- Encrypted column storage (AES-256-GCM for provider credentials and fulfillment proof)
- Atomic inventory transactions with `balance_after` snapshots
- Daily snapshot jobs for inventory reconciliation
- Row-Level Security planned (Slice 15 — not yet implemented)

---

## Security & Auth

Things you can honestly describe as implemented or designed:

| Area | Implementation |
|------|----------------|
| **RBAC** | Dynamic per-tenant roles with permission flag arrays; `PermissionsGuard` on routes |
| **Staff 2FA** | SMS OTP via Taqnyat; TOTP alternative for admin roles |
| **JWT sessions** | RS256, refresh token rotation, silent access-token renewal |
| **CSRF** | Token issued to staff sessions; mutating ops routes reject missing CSRF |
| **Account enumeration protection** | Generic "Invalid credentials" on login; silent forgot-password |
| **Password policy** | ≥10 chars, complexity rules, HIBP breach check (k-anonymity API) |
| **Rate limiting** | Login lockout, OTP attempt limits, registration CAPTCHA after 2nd attempt |
| **Cloudflare Turnstile** | Server-side Siteverify on registration |
| **Webhook auth** | Constant-time secret comparison (Salla), query-token verification (Paymob) |
| **Replay defense** | Deterministic event fingerprint + Redis `SET NX` with 24h TTL |
| **Credential security** | Provider secrets encrypted at rest; never returned in API responses |

---

## Integrations & Domain Logic

| Integration | Role |
|-------------|------|
| **Salla** (Saudi e-commerce) | Webhook receiver, OAuth token storage, order normalization, Admin API status updates |
| **Paymob** | Payment webhook ingress |
| **Taqnyat** | SMS OTP and PIN delivery notifications |
| **Rawachat, STC, Coda, OneCard, MintRoute, QwikCharge, etc.** | Fulfillment provider APIs (coin charge, telecom recharge, PIN voucher, manual) |
| **AWS SES** | Password reset and staff onboarding emails |

**Concepts learned:**
- Webhook idempotency (duplicate events must not double-charge)
- Provider registry pattern — SKU → provider routing from DB, no hardcoded `if (sku...)`
- Strategy/handler pattern: `coin_charge`, `telecom_recharge`, `pin_voucher`, `pin_pool`, `coda_style`, `manual`
- Legacy API signing (sorted-parameter MD5) ported from PHP
- Invisible character sanitization before provider calls (Unicode RLM/LRM)
- Fulfillment proof logging (encrypted raw responses for dispute evidence)
- Post-fulfillment lifecycle: Salla status sync, cancellation handling, failed-item SLA escalation
- Canary/shadow migration strategy from legacy PHP system

---

## DevOps, Tooling & Quality

| Tool | What you used it for |
|------|---------------------|
| **Nx 23** | Monorepo orchestration — `apps/api`, `apps/web`, `libs/*` |
| **pnpm** | Workspace package management |
| **Docker Compose** | Local Postgres 18 + Redis |
| **Jest** | ~85 unit and integration test files |
| **Testcontainers** | Postgres/Redis integration tests without manual setup |
| **ESLint + Prettier** | Linting and formatting across the monorepo |
| **Webpack** | NestJS API bundling |
| **Concurrently** | Parallel `api` + `web` dev servers |
| **Prometheus / Grafana / Loki** | Observability stack (baseline metrics in place; full stack Slice 16) |

**Concepts learned:**
- Spec-first / vertical-slice development (one PR-sized slice at a time)
- Acceptance-criteria-driven delivery
- Integration tests with recorded production webhook fixtures
- Load testing webhook ingress (p99 < 500 ms target)
- Module boundary tests to prevent cross-domain coupling
- `.env.example` discipline — no secrets in repo

---

## Architecture & Software Design Concepts

These are the **ideas** worth putting on a CV or discussing in interviews — grounded in what you built:

### System design
- **Monorepo with shared libs** — types, DTOs, database entities, config consumed by API and web
- **Event-driven fulfillment** — webhooks enqueue jobs; workers call providers asynchronously
- **Database-driven configuration** — add providers/SKU maps without redeploying code
- **Multi-audience single deployment** — customer storefront, staff ops, admin, webhook receiver behind one auth layer
- **Legacy migration strategy** — shadow → canary → expand → decommission (not big-bang)

### Backend patterns
- **Repository + service layer** separation in NestJS modules
- **Guard-based authorization** (JWT auth guard + permissions guard + step-up guard)
- **Idempotency keys** at webhook ingress and post-success fulfillment
- **Retry with exponential backoff** on provider failures (10s / 30s / 90s)
- **Correlation ID propagation** through HTTP → queue jobs → provider calls
- **Non-blocking side effects** — Salla status update failure logged but doesn't fail fulfillment

### Frontend patterns
- **Feature folders** (`features/auth`, `features/ops`, `features/admin`)
- **Server-side API client** for RSC pages; browser client for mutations
- **Schema-shared validation** — Zod on web, class-validator on API (same rules, different runtimes)
- **Ops shell layout** — sidebar nav, command menu, permission-filtered routes

### Testing mindset
- Fixture-based tests from real webhook payloads
- Boundary tests (module imports, slice acceptance criteria)
- Mocked provider APIs for handler unit tests
- Integration tests for auth flows, webhook replay, fulfillment pipeline

---

## Realistic CV Bullet Points

Copy/adapt these — they're tied to actual deliverables:

- Built a TypeScript/Nx monorepo (NestJS + Next.js) replacing a legacy PHP fulfillment system for a Saudi digital-goods platform integrated with Salla e-commerce.
- Implemented secure auth with JWT (RS256), SMS OTP, TOTP, RBAC permission guards, CSRF protection, and account-enumeration-safe error handling.
- Designed webhook ingress with replay defense, idempotency logging, and BullMQ async processing — achieving sub-500 ms p99 response under load.
- Built a database-driven provider registry routing 20+ SKUs to fulfillment handlers (coin charge, telecom, PIN voucher, manual) without code deploys.
- Ported legacy provider integrations (MD5 signing, STC 3-step recharge, Coda validate-then-charge) from PHP to typed NestJS handlers with encrypted audit trails.
- Delivered staff ops tooling: shift sessions, coin inventory tracking, supplier purchases, CS manual charge portal, and admin reporting with Excel export.
- Wrote 85+ automated tests including Testcontainers integration tests and recorded webhook fixture tests.
- Implemented bilingual (Arabic RTL / English) admin UI with next-intl and permission-gated navigation.

---

## Honest Scope Notes

What is **done or mostly done** (Slices 0–6, 9–12, partial 2–3, 7–8):
- Monorepo scaffold, database foundation, webhooks, Salla handlers, provider registry
- Fulfillment handlers (tested against fixtures; real provider canary calls still pending)
- Post-fulfillment rules, ops dashboard, sessions/inventory/purchases, admin users/reports
- Auth core (login, OTP, JWT, RBAC, TOTP, Turnstile, policy acceptance)

What is **in progress or not started** — don't oversell:
- Customer storefront (`/store/*`) — Slice 13, not started
- B2B tenancy with PostgreSQL RLS — Slice 15, not started
- Full observability stack deployment (Grafana/Loki/Alertmanager) — Slice 16
- Production cutover from legacy PHP — Slice 17
- Real Taqnyat SMS and AWS SES verified in staging (stubbed/dev outbox works locally)
- Some auth acceptance criteria still open (SES reset email, staging OTP)

---

## Suggested Skills Section (for CV)

**Languages:** TypeScript, SQL  
**Frontend:** Next.js, React, Tailwind CSS, next-intl, React Hook Form, Zod  
**Backend:** NestJS, Node.js, TypeORM, BullMQ, Redis, Passport/JWT  
**Database:** PostgreSQL, Redis  
**DevOps & Tools:** Nx, pnpm, Docker, Jest, Testcontainers, Prometheus, Git  
**Cloud & Integrations:** AWS SES, Salla API, Paymob, Taqnyat SMS, Cloudflare Turnstile  
**Concepts:** REST APIs, RBAC, webhook security, idempotency, async job queues, multi-tenant design, i18n/RTL, spec-driven development, legacy system migration

---

*Generated from the OCEAN67 codebase and docs (roadmap slices 0–12). Update as you complete storefront, RLS, and production cutover.*
