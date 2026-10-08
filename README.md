# ERP Superadmin

## Run with the JSON Server mock API

Install dependencies with `npm install`, then start both processes in separate terminals:

```bash
npm run mock-server
npm run dev
```

The mock API serves `db.json` at `http://localhost:3001`. `.env.example` contains the mock API settings; copy it to `.env.local` if you need to change the local configuration. The app defaults to this API when `NEXT_PUBLIC_API_MODE` is unset or set to `mock`.

Tenant records use the JSON Server REST collection: `GET /tenants`, `GET /tenants/:id`, `POST /tenants`, `PUT /tenants/:id`, and `DELETE /tenants/:id`. The POST/PUT body includes the complete wizard submission in `creationData`, along with the summary fields used by the directory and tenant overview. Editing from the tenant menu loads that record and fills the same wizard screens; save replaces it with a full PUT. Wizard progress between screens is held in Redux memory, not session storage.

## Connect a real backend

Set these environment variables in `.env.local` and restart Next.js:

```dotenv
NEXT_PUBLIC_API_MODE=backend
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

Tenant endpoint paths, request/response schemas, and DTO mapping are centralized in `services/tenants/tenant-api.ts` and `lib/schemas/api.ts`. Update the API adapter and schemas there if the backend differs; the TanStack Query hooks and UI can continue using the same tenant types. Protected backend requests use the shared authenticated `apiFetch` client. Tenant creation and update each send one complete tenant record. Tenant deletion removes associated resource records before deleting the tenant; use backend transactions/cascade behavior or replace that adapter operation to guarantee atomicity in production.

TanStack Query owns remote/server data; Redux Toolkit owns the shared tenant-directory filter and transient multi-route wizard form state without duplicating the API cache. Zod validates API responses and the wizard submission.
