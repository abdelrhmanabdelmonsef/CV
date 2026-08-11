# Legacy static CV site

Original single-file **Cyber HUD** portfolio before the NestJS + Next.js rewrite.

| Item | Description |
|------|-------------|
| `index.html` | Full static site (matrix, terminal, sections, print styles) |
| `photo/` | Profile image (`pic.jpg`) |
| `certificates/` | PDF/PNG certificate assets |
| `good resources/` | Reference links, resume PDF, HTB transcript |

Open `index.html` locally or deploy this folder as a static site. Asset paths are relative to `legacy/`.

The modern app reuses `photo/` and `certificates/` via `npm run sync-assets` from the repo root (symlinks into `apps/web-cv/public/`).
