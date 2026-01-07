# SmartCare360 Backend

This backend provides persistent storage and JWT-protected endpoints for the SmartCare360 frontend. It is the primary API for the application; demo APIs in `../APIs` are optional development helpers and are not required for production.

Quick start:

```bash
cd backend
cp .env.example .env
# edit .env if needed
npm install
npm run start
# or for development with auto-reload
npm run dev
```

Defaults:
- Backend port: `5000` (set `PORT` in `.env`)
- SQLite DB file: `./smartcare360.db`

Postgres on Render
-------------------
To use a managed Postgres instance (e.g., Render), set `DATABASE_URL` in your `.env` to the provided connection string. When `DATABASE_URL` is present the backend will use Postgres instead of SQLite and create the necessary tables automatically on first run.

Example `.env` snippet for Render:

```
DATABASE_URL=postgres://user:password@hostname:5432/dbname
PGSSLMODE=require
```

If your Postgres provider requires SSL, set `PGSSLMODE=require` in your environment. The backend will attempt to connect using SSL when this is set.

Notes:
- On first run the DB will be initialized and a seeded admin user will be created:
  - email: `admin@smartcare360.co.ke`
  - password: `password`
- Newsletter POSTs to `/newsletter` will be stored locally by the backend. The demo `APIs/` server is optional and not required in production.
- Protecting routes with role-based access is possible — currently any valid JWT allows access.

Next steps I can do:
- Add role-based authorization
- Integrate a real DB (Postgres) and migrations
- Add tests and CI
- Wire frontend to call backend instead of the mock APIs

Render deployment (recommended)
-------------------------------
1. Connect your repository to Render and create a Web Service, or let Render pick up `backend/render.yaml` when you add this repo.

2. Environment variables to set in Render (in the service dashboard -> Environment):
  - `DATABASE_URL` = postgres://user:password@host:5432/dbname
  - `PGSSLMODE` = `require` (if using SSL)
  - `JWT_SECRET` = a strong random secret
  - `APIS_URL` = optional (default points to demo API)

3. Build & Start (render.yaml):
  - Build command: `cd backend && npm install`
  - Start command: `cd backend && npm start`

4. Health check: set the health check path to `/health` (Render will use this to verify startup).

5. Logs & first-run: check service logs after deploy — the backend will auto-create database tables and seed an admin user if none exists.

Optional: If you prefer a Docker-based deployment, add a `Dockerfile` at `backend/Dockerfile` and point Render to use Docker.

Docker & local compose
-----------------------
I've added a `Dockerfile` for the backend. There's also a `docker-compose.yml` in the project root to run a local stack (Postgres + backend).

Run the stack locally with:

```bash
docker-compose up --build
```

This exposes:
- backend: http://localhost:5000
- postgres: localhost:5432 (user: `postgres`, password: `password`, db: `smartcare360`)

Render notes for Docker
-----------------------
If you prefer to deploy using Render's Docker support, point Render to the `backend/Dockerfile` or `APIs/Dockerfile` for each service. Alternatively keep using the `render.yaml` files added under `backend/render.yaml` and `APIs/render.yaml` to let Render create two services from the same repo.

Security reminder
-----------------
When deploying, make sure to set a strong `JWT_SECRET` in Render's environment variables and use a secure Postgres password. Remove or rotate any development credentials after initial testing.

If you want, I can also:
- Add a tiny DB migration step using `node-pg-migrate` or `knex`.
- Add a `Dockerfile` for containerized Render deployments.

