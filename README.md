# CV — Cyber HUD Portfolio

Interactive CV website for **Abdel-Rahman Abdel-Monsef**, built as a **NestJS + Next.js** monorepo with the original Cyber HUD design ported from the static HTML site.

## Repository layout

```
cv/
├── README.md                 ← project overview (this file)
├── package.json              ← npm workspaces root
├── tsconfig.base.json        ← shared TypeScript paths
│
├── apps/
│   ├── web-cv/               ← Next.js 14 — Cyber HUD UI
│   │   ├── app/              ← routes, API handlers, global styles
│   │   ├── components/       ← React UI (contact, cv, layout, ui)
│   │   ├── contexts/         ← matrix & lightbox providers
│   │   ├── lib/              ← messages auth helpers
│   │   └── public/           ← synced symlinks to legacy assets
│   └── api-cv/               ← NestJS REST API
│       ├── src/              ← cv & contact modules
│       └── data/             ← messages.json (runtime)
│
├── libs/
│   └── cv-data/              ← typed CV content shared by both apps
│       └── src/
│           ├── data.ts       ← live site content (edit here)
│           ├── types.ts
│           └── index.ts
│
├── data/                     ← markdown CV drafts & variants
├── legacy/                   ← original static HTML site + assets
│   ├── index.html
│   ├── photo/
│   ├── certificates/
│   └── good resources/
└── node_modules/
```

| Folder | Purpose |
|--------|---------|
| **`apps/web-cv`** | Primary frontend — run, build, and deploy the site from here |
| **`apps/api-cv`** | Optional NestJS API for CV JSON and contact endpoints |
| **`libs/cv-data`** | Single source of truth for typed CV data at runtime |
| **`data/`** | Markdown drafts used when updating `libs/cv-data/src/data.ts` |
| **`legacy/`** | Standalone static site; photo, certificates, and PDF assets |

## Quick start

```bash
npm install
cp apps/web-cv/.env.example apps/web-cv/.env.local   # set MESSAGE_SECRET
npm run sync-assets                                    # link legacy assets into public/
npm run dev                                            # API :3001 + site :3000
```

| URL | Description |
|-----|-------------|
| http://localhost:3000 | CV site |
| http://localhost:3000/messages | Contact inbox (password from `MESSAGE_SECRET`) |
| http://localhost:3001/cv | NestJS CV JSON (when API is running) |

## Prerequisites

- Node.js 18+
- npm 9+ (workspaces)

## Environment

Copy `apps/web-cv/.env.example` → `apps/web-cv/.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL. Use `/api` for built-in Next.js routes (default). |
| `MESSAGE_SECRET` | Password for `/messages` admin page. **Required** — no default. |
| `NEXT_PUBLIC_SITE_URL` | Optional. Used for metadata base URL (defaults to `http://localhost:3000`). |

Optional NestJS-only copy: `apps/api-cv/.env.example` → `.env`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API (:3001) and Next.js (:3000) together |
| `npm run dev:web` | Next.js only |
| `npm run dev:api` | NestJS only |
| `npm run sync-assets` | Symlink `legacy/photo`, `legacy/certificates`, and HTB transcript into `apps/web-cv/public/` |
| `npm run build:cv-data` | Compile shared CV data package |
| `npm run build` | Build cv-data, web-cv, and api-cv |
| `npm run start:api` | Run NestJS in production |

`npm run dev` and `npm run build` automatically compile `cv-data` and sync assets first.

## Updating CV content

1. Edit markdown drafts in **`data/`** (profile, skills, role-specific variants).
2. Update the typed source in **`libs/cv-data/src/data.ts`** to match.
3. Add new photos or certificates under **`legacy/photo/`** and **`legacy/certificates/`**, then run `npm run sync-assets`.

The Next.js app reads from `cv-data` at build time — it does **not** load `data/*.md` at runtime.

## Contact form & messages

The contact form posts to `/api/contact` (Next.js route). Messages are stored at:

```
apps/api-cv/data/messages.json
```

Session auth for `/messages` uses an httpOnly cookie (8 h). Logic lives in `apps/web-cv/lib/messages-auth.ts`.

## Production build

```bash
npm run sync-assets
npm run build
npm --prefix apps/web-cv run start   # frontend
npm run start:api                    # optional API
```

## Legacy static site

Open **`legacy/index.html`** in a browser, or serve the `legacy/` folder with any static host. Asset paths inside that file are relative to `legacy/`.

The modern app reuses `legacy/photo/` and `legacy/certificates/` via symlinks — run `npm run sync-assets` after adding files.

## Tech stack

- **Frontend:** Next.js 14, React 18, Cyber HUD CSS (matrix rain, terminal, lightbox)
- **Backend:** NestJS (optional in dev — contact form also works via Next.js API routes)
- **Shared data:** TypeScript workspace package `cv-data`

## Troubleshooting

**`ENOSPC: file watchers`** — increase inotify limit or run `dev:web` and `dev:api` in separate terminals:

```bash
sudo sysctl fs.inotify.max_user_watches=524288
```

**Missing images or certificates** — run `npm run sync-assets` so `public/` symlinks point at `legacy/`.

**Broken symlinks after moving the repo** — re-run `npm run sync-assets` from the repo root.
