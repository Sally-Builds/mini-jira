# taskFlow Backend

This is the backend API for taskFlow, built with [NestJS](https://nestjs.com/) and TypeScript. It provides RESTful endpoints for authentication, user management, and task management.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (or update the config for your DB)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your database connection in `src/config/database.config.ts`.
3. (Optional) Run database migrations if you have any.

## Running the Server

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

The server will start on the port specified in your environment/config (default: 3000).

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

- `src/auth/` — Authentication (JWT, login, register)
- `src/tasks/` — Task CRUD and filtering
- `src/users/` — User management
- `src/common/` — Shared enums, decorators
- `src/config/` — Database config

## API Endpoints

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `GET /tasks` — List tasks (with filters)
- `POST /tasks` — Create a task
- `PATCH /tasks/:id` — Update a task
- `DELETE /tasks/:id` — Delete a task

## License

MIT
