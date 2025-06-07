# mini-jira Frontend

This is the frontend for mini-jira, built with React, Vite, and TypeScript. It provides a modern, responsive UI for managing tasks and users.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Configure API base URL in `src/api/index.ts` if your backend is not running on `localhost:3000`.

## Running the App

```bash
npm run dev
```

The app will start on [http://localhost:5173](http://localhost:5173) by default.

## Project Structure

- `src/pages/` — Main pages (Dashboard, Login, Register, etc.)
- `src/components/` — UI components and widgets
- `src/api/` — API calls (auth, tasks, users)
- `src/contexts/` — React context for auth and tasks
- `src/types/` — TypeScript types

## Usage

1. Register a new user or log in.
2. Create, update, or delete tasks from the dashboard.
3. Filter tasks by status or priority.
4. Log out when done.

## Customization

- Update theme and styles in `src/App.css` and `tailwind.config.ts`.
- Update API endpoints in `src/api/` as needed.

## License

MIT
