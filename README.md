# DeskLine — IT Service Desk & Ticket Management System

A professional, responsive IT Service Desk and Ticket Management System built with **React + TypeScript**, styled with **Tailwind CSS**, and backed by a **JSON Server** mock API. It implements complete CRUD, role-based access control (RBAC), full ticket lifecycle management, assignment, comments, resolution tracking, search/filter/sort, and role-specific dashboards.

## Project Overview

Three roles share one application, each seeing a different dashboard, navigation, and set of permissions:

- **Admin** — full control: all tickets, user management, category management, assignment, reports.
- **Support Agent** — works assigned tickets end-to-end: status updates, priority, comments, resolution.
- **Employee** — raises tickets, tracks their own tickets, comments, cancels/reopens as allowed.

## Technologies Used

- React 18 + TypeScript
- Vite
- Tailwind CSS
- JSON Server (mock backend)
- Axios
- React Router v6
- lucide-react (icons)

## Project Structure

```
src/
├── components/     # Navbar, Sidebar, Dashboard, Tickets, Users, Categories, Comments, common/
├── pages/          # Login, Dashboard, Tickets, Users, Categories, Reports, Profile
├── services/       # ticketService, userService, categoryService, commentService (API layer)
├── types/          # ticket.ts, user.ts, category.ts, comment.ts
├── context/        # AuthContext (session/RBAC), ToastContext (notifications)
├── hooks/          # useAsync, useTicketFilters
├── utils/          # permissions.ts (centralized RBAC logic)
└── routes/         # ProtectedRoute
```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the JSON Server mock API** (run in one terminal, from the project root)
   ```bash
   npm run server
   ```
   This serves `db.json` at **http://localhost:4000** with `/users`, `/tickets`, `/categories`, `/comments` endpoints.

3. **Start the React app** (run in a second terminal)
   ```bash
   npm run dev
   ```
   The app runs at **http://localhost:5173**.

> Both processes must be running at the same time — the frontend expects the API at `http://localhost:4000` (see `src/services/api.ts`).

## Login Credentials (Demo Accounts)

All demo accounts use the password `password123`.

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@deskline.com` | Full system access |
| Support Agent | `agent1@deskline.com` | Has tickets assigned |
| Support Agent | `agent2@deskline.com` | Has tickets assigned |
| Employee | `employee1@deskline.com` | Has open + resolved tickets |
| Employee | `employee2@deskline.com` | Has open tickets |
| Employee | `employee3@deskline.com` | Account is **deactivated** — use to test the inactive-account flow |

## API Endpoints (JSON Server)

Base URL: `http://localhost:4000`

**Users**
`GET /users` · `GET /users/:id` · `POST /users` · `PUT/PATCH /users/:id` · `DELETE /users/:id`

**Tickets**
`GET /tickets` · `GET /tickets/:id` · `POST /tickets` · `PUT/PATCH /tickets/:id` · `DELETE /tickets/:id`

**Comments**
`GET /comments?ticketId=:id` · `POST /comments` · `DELETE /comments/:id`

**Categories**
`GET /categories` · `POST /categories` · `PUT/PATCH /categories/:id` · `DELETE /categories/:id`

## Role Permission Matrix

| Feature | Admin | Support Agent | Employee |
|---|---|---|---|
| Dashboard | Full | Own data | Own data |
| Create Ticket | Yes | Yes | Yes |
| View All Tickets | Yes | No | No |
| View Assigned Tickets | Yes | Yes | No |
| View Own Tickets | Yes | Yes | Yes |
| Edit Ticket | Yes | Assigned only | Own, while Open |
| Delete Ticket | Yes | No | No |
| Assign / Reassign | Yes | No | No |
| Update Status | Yes | Assigned only | Limited (cancel/reopen) |
| Update Priority | Yes | Assigned only | No |
| Add Comments | Yes | Yes | Own tickets |
| Add Resolution | Yes | Yes | No |
| Manage Users | Yes | No | No |
| Manage Categories | Yes | No | No |

## Ticket Lifecycle

```
Open → Assigned → In Progress → Pending → Resolved → Closed
Open → Cancelled
Pending → In Progress
Resolved → Reopened (→ In Progress)
```

Available actions are computed per-role in `src/utils/permissions.ts` (`availableStatusActions`), so the UI only ever shows transitions the current user is allowed to make.

## Key Features Implemented

- Login with role detection, protected routes, and route-level RBAC (`ProtectedRoute`)
- Role-specific dashboards with live stat cards computed from ticket data
- Full ticket CRUD, lifecycle transitions, priority updates, and assignment/reassignment/unassignment
- Comments with role display, resolution capture (resolution + notes + date)
- Chronological activity timeline auto-logged on every ticket action
- User management: add/edit/delete, activate/deactivate, role assignment
- Category management: add/edit/delete, activate/deactivate
- Search (ID, subject, requester, agent), multi-field filters, sorting, and pagination
- Loading, empty, and error states throughout; toast notifications on create/update/delete/assign/status-change
- Form validation with inline messages across all forms
- Fully responsive layout (collapsible sidebar on mobile)

## Deployment

This project has **two parts that must both be deployed** for a live link to actually work for other people:

1. The React frontend (static site) — Netlify or Vercel
2. The JSON Server mock API — a small Node host like Render or Railway

If you only deploy the frontend, logging in will fail with a network/connection error, because the deployed app is still pointed at `http://localhost:4000` — which refers to *the visitor's own computer*, not a real server, and nothing is listening there.

### Step 1 — Deploy the backend (JSON Server)

Using [Render](https://render.com) (free tier):

1. Push this project to a GitHub repo.
2. In Render, create a **New Web Service** from that repo.
3. Build command: `npm install`
4. Start command: `npm run start` (this runs JSON Server bound to Render's assigned port)
5. Deploy. Render will give you a public URL, e.g. `https://deskline-api.onrender.com`.
6. Confirm it works by visiting `https://deskline-api.onrender.com/users` in your browser — you should see the seeded user list as JSON.

(Railway, Cyclic, or any Node host works the same way — just make sure the start command is `npm run start`.)

### Step 2 — Point the frontend at the deployed backend

In your Netlify (or Vercel) project settings, add an environment variable:

```
VITE_API_BASE_URL=https://deskline-api.onrender.com
```

(Use your actual backend URL from Step 1, no trailing slash.) Then trigger a redeploy — Vite only reads env vars at build time, so a previous deploy won't pick this up automatically.

### Step 3 — Deploy the frontend

```bash
npm run build
```

Deploy the generated `dist/` folder to Netlify or Vercel as usual (or connect the repo and let them build it — just make sure the env var from Step 2 is set on that project before the build runs).

### Local development

For local development only, no env var is needed — `src/services/api.ts` defaults to `http://localhost:4000`, which works as long as you run `npm run server` locally alongside `npm run dev`.

### Why this matters

Since JSON Server is a mock backend, this is fine for demos and coursework, but keep in mind:
- Passwords are stored in plain text in `db.json` — do not use real credentials or deploy this pattern for production use.
- Free-tier Node hosts often "sleep" after inactivity, so the first request after idle time may be slow — this is normal.

## Notes

- Data resets whenever `db.json` is restored from source control — feel free to edit it directly to change seed data.
- Passwords are stored in plain text in `db.json` for demo purposes only; this is a mock backend and not intended for production use as-is.
