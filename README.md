# Liwa Menu — Frontend

Single‑page React app (Vite + Tailwind) for the Liwa Menu / admin dashboard. This repository contains the frontend client used to manage restaurants, menus, orders, licenses and payments and to interact with the QR_Menu backend.

## Key features

- Admin dashboard UI for restaurants, users, licenses, packages and payments
- Authentication (login / register / forgot password / verify email)
- Order management and order tags
- License & package management (PayTR integration present in backend)
- Reusable components and icons, Tailwind styling
- Vite dev server for fast local iteration
- Environment configuration via .env

## Repo layout (important folders)

- src/
  - assets/ — images, icons, animations, Lottie
  - components/ — UI components (header, sidebar, restaurants, users, payments, etc.)
  - pages/ — route pages (login, home, restaurants, licenses, profile, etc.)
  - redux/ — API slices and state management
  - hooks/ — custom hooks
  - utils/ — helpers and localStorage wrappers
  - context/ — Popup context
- public/ — static assets
- config/ — small config helpers (toast)
- MenuJson.json — example menu data / seed
- .env — runtime environment values (API base URL, keys)
- vite.config.js, tailwind.config.js — build/tooling config

## Prerequisites

- Node.js 18+ (or the version compatible with Vite)
- npm or pnpm/yarn
- Backend running (QR_Menu.Api) and accessible via API_BASE_URL in .env

## Quick start (macOS)

1. Install dependencies
   ```bash
   cd /Users/ibro/Documents/Real_Projects/liwamenu-abou/user
   npm install
   ```
2. Create or update .env (example)
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_OTHER_KEY=...
   ```
   Note: Vite exposes env variables prefixed with VITE\_. Check existing .env for names.
3. Run dev server
   ```bash
   npm run dev
   ```
4. Build for production
   ```bash
   npm run build
   npm run preview   # local preview of the production build
   ```

## Useful npm scripts (from package.json)

- dev — start Vite dev server
- build — build production assets
- preview — preview production build (local)
- lint / format — if configured

## Integrations & config

- API: update VITE_API_BASE_URL to point to the backend (QR_Menu.Api).
- Authentication flows use the backend endpoints defined in src/redux/api.js.
- PayTR and payment flows are implemented on the backend; frontend calls the payment endpoints.

## Development tips

- Inspect src/redux/api.js to see all backend endpoints and expected DTOs.
- Use MenuJson.json for local mock data or testing menu-related UI.
- Many UI icons are React components under src/assets/icon — reuse them where possible.
- To add a new route page: create page under src/pages and add route entry in the router (check main.jsx / App.jsx).

## Deployment

- This project is configured for Vercel (see vercel.json). To deploy:
  - Build command: npm run build
  - Output directory: dist
  - Ensure VITE_API_BASE_URL points to your production backend.

## Troubleshooting

- Blank UI / broken requests: verify VITE_API_BASE_URL and CORS on the backend.
- Tailwind not picking up styles: confirm tailwind.config.js content paths include src/\*_/_.
- Lottie/animations: check assets paths in components if animations fail to load.

If you want, I can:

- add Docker + docker-compose,
- add CI (GitHub Actions) to run tests/build,
- scaffold a Postman collection from backend endpoints,
- or produce a smaller CONTRIBUTING.md explaining conventions.
