# Lunch Payments

Lunch Payments is a small internal app for tracking who recently paid for company lunches. Each user has a score based on lunch payment history, and the next payer should be the active user with the lowest score.

The app lets the team manage lunch participants, record who paid for a lunch, and see each user's payment score over time.

## Tech Stack

- **Client:** React, Vite, Ant Design, React Query
- **Server:** Fastify, TypeScript, Zod, Swagger UI
- **Database:** SQLite through Knex
- **Shared contracts:** Zod schemas and TypeScript models in the `contracts` workspace package
- **Package manager:** pnpm

## Running Locally

### Prerequisites

- Node.js 24+
- pnpm

If pnpm is not available, enable it through Corepack:

```bash
corepack enable
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

Create `server/.env` with local credentials for the basic-auth users:

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=3000

USER_USERNAME=user
USER_PASSWORD=user-password

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin-password
```

The `user` account can read and create lunch records. The `admin` account can also perform protected management actions such as creating, updating, archiving, and deleting records where required by the API.

### Prepare the Database

Run the database migrations:

```bash
pnpm --filter server knex migrate:latest
```

In development, SQLite data is stored in `server/development.sqlite`.

### Start Development Servers

```bash
pnpm dev
```

This starts:

- Fastify API on `http://localhost:3000`
- Vite client on `http://localhost:5173`

Open `http://localhost:3000` in the browser. In development, the Fastify server redirects frontend routes to the Vite dev server while API requests remain served by Fastify.

Swagger UI is available at:

```text
http://localhost:3000/documentation
```

### Useful Commands

```bash
pnpm lint
pnpm format
pnpm build
pnpm start
```

`pnpm build` builds all workspace packages and copies the client build into `server/public` for production serving. `pnpm start` starts the built server from `server/dist`.

## Architecture

The project is organized as a pnpm workspace with three packages:

```text
.
|-- client      React/Vite frontend
|-- contracts   Shared TypeScript models and Zod schemas
`-- server      Fastify API, authentication, database access, and production static serving
```

### Client

The client is a React app built with Vite. It uses Ant Design for UI components, React Query for server state, Axios for HTTP calls, and React Router for navigation.

API calls use the current browser origin as the base URL, so the same client code works in development and production:

- In development, the app is served by Vite on port `5173`.
- In production, the built client is copied into `server/public` and served by Fastify.

### Server

The server is a Fastify application. It registers:

- application configuration from environment variables
- SQLite/Knex database access
- basic authentication
- Swagger/OpenAPI documentation
- route modules for auth, users, and lunch records

Main API areas:

- `/api/auth/*` returns the authenticated user's role and handles logout behavior.
- `/api/users/*` manages lunch participants and their score state.
- `/api/lunchRecords/*` manages lunch payment records.

### Contracts

The `contracts` package contains shared Zod schemas and TypeScript models for users, lunch records, auth users, and API errors. Both the server and client import these contracts so request and response shapes stay aligned.

### Database

The server uses Knex with SQLite. Migrations live in `server/src/database/migrations`.

Core data concepts:

- **Users** represent people who can participate in lunches.
- **Lunch records** represent a lunch payment event, including the payer, consumers, description, and date.
- **Scores** are stored on users and are used to decide who should pay next. The user with the lowest score is the next expected payer.

### Production Flow

In production, the server serves both the API and the built frontend:

1. `pnpm build` builds `contracts`, `client`, and `server`.
2. The root build script copies `client/dist` into `server/public`.
3. Fastify serves static frontend assets from `server/public`.
4. Unknown non-API routes fall back to `index.html` for client-side routing.

The Dockerfile follows this flow and runs production migrations before starting the server.
