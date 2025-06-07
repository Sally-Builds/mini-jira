# TaskFlow

TaskFlow is a full-stack task management application inspired by Jira, designed for teams and individuals to manage tasks efficiently. It features user authentication, task creation, filtering, updating, and deletion, with a modern UI and robust backend.

## Features

- **User Authentication:** Secure registration and login using JWT.
- **Task Management:** Create, read, update, and delete tasks.
- **Task Filtering:** Filter tasks by status, priority, and search keywords.
- **User Management:** Register and manage users.
- **Responsive UI:** Built with React, Vite, and Tailwind CSS.
- **RESTful API:** Powered by NestJS and TypeORM.

## Application Structure

- `backend/` — NestJS API server (TypeScript, PostgreSQL, JWT Auth)
- `frontend/` — React client (Vite, TypeScript, Tailwind CSS)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (or update the backend config for your DB)

---

## Backend Setup

See [`backend/README.md`](./backend/README.md) for full details.

1. `cd backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database in `src/config/database.config.ts`.
4. Run migrations if needed.
5. Start the server:
   ```bash
   npm run start:dev
   ```

---

## Frontend Setup

See [`frontend/README.md`](./frontend/README.md) for full details.

1. `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage

1. Register a new user or log in.
2. Create, update, or delete tasks from the dashboard.
3. Filter tasks by status or priority.
4. Log out when done.

---

## API Endpoints

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `GET /tasks` — List tasks (with filters)
- `POST /tasks` — Create a task
- `PATCH /tasks/:id` — Update a task
- `DELETE /tasks/:id` — Delete a task

---

## License

MIT
