# MERN Stack To-Do List Application

**Student Name:** Nikhil Krishnan M
**Roll Number:** B23CS1150
**Course:** Web Technology Assignment (MERN Stack)

---

## 1. Project overview

A full-stack To-Do List built with the MERN stack: **M**ongoDB, **E**xpress.js, **R**eact.js and **N**ode.js. Tasks are stored in a MongoDB database and managed through a REST API written with Express and Mongoose. A React (Vite) frontend calls this API with `fetch()` so the screen updates without reloading the page. Tasks persist across page refreshes because they live in the database, not in the browser.

> **All three parts must be running for the app to work:** MongoDB (local or Atlas), the backend server, and the frontend dev server.

## 2. Objectives

- Build a REST API with Node.js, Express and Mongoose.
- Connect to MongoDB using a connection string kept in a `.env` file.
- Build a React interface that reads and writes data through the API.
- Validate input, return meaningful HTTP status codes, and restrict CORS.
- Manage the project with Git and GitHub using feature branches and pull requests, keeping secrets out of version control.

## 3. Features

- Add a task (empty or whitespace-only titles are rejected on both client and server)
- View all tasks, newest first, loaded from MongoDB on page load
- Mark a task complete or incomplete (completed tasks are struck through)
- Edit a task title, with a Cancel option
- Delete a task
- Loading indicator, empty state, error messages and a Retry button if loading fails
- Pending requests disable the relevant buttons to prevent duplicate submissions
- Responsive layout, keyboard accessible, visible focus styles

## 4. Technology stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite, plain CSS, native `fetch()`  |
| Backend   | Node.js, Express 4, `cors`, `dotenv`         |
| Database  | MongoDB with Mongoose 8                      |
| Tooling   | Git and GitHub                               |

## 5. Folder structure

```
B23CS1150_Nikhil_Krishnan_M_Assignment2_MERN_ToDoList/
├── backend/
│   ├── config/db.js            # Mongoose connection (reads MONGO_URI)
│   ├── models/Task.js          # Task schema and model
│   ├── routes/taskRoutes.js    # GET, POST, PUT, DELETE /api/tasks
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── services/taskApi.js # All fetch() calls to the backend
│   │   ├── App.jsx             # State (useState) and actions
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── screenshots/README.md
├── .gitignore
├── README.md
├── GITHUB_WORKFLOW.md
└── REQUIREMENTS_CHECKLIST.md
```

## 6. Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes npm). Check with `node -v`.
- A MongoDB database: either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or MongoDB Community Server installed locally.
- [Git](https://git-scm.com/) and a GitHub account (for the GitHub part of the assignment).

## 7. Database setup (choose one)

### Option A: MongoDB Atlas

1. Create a free account and a free (M0) cluster at https://www.mongodb.com/atlas.
2. **Database Access:** create a database user with a username and password.
3. **Network Access:** add your current IP address (for quick testing, `0.0.0.0/0` allows all IPs but is less secure).
4. Click **Connect -> Drivers** on your cluster and copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>`, and add a database name before the `?`, for example `.../todo-app?retryWrites=...`.
6. If the password has special characters (`@`, `:`, `/`), URL-encode them.

### Option B: Local MongoDB

1. Install MongoDB Community Server and make sure the service is running (default port 27017).
2. Use this connection string: `mongodb://127.0.0.1:27017/todo-app`
   The `todo-app` database is created automatically on first write.

## 8. Environment setup

### Backend

```bash
cd backend
cp .env.example .env        # Windows (Command Prompt): copy .env.example .env
```

Edit `backend/.env`:

```
MONGO_URI=<your Atlas or local connection string>
PORT=5000
FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` is the only origin CORS will allow.

### Frontend

```bash
cd frontend
cp .env.example .env
```

`frontend/.env` should contain:

```
VITE_API_URL=http://localhost:5000/api
```

Do not add a trailing `/tasks`; the app appends paths itself. **Never commit `.env` files.** Only `.env.example` is tracked by Git.

## 9. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 10. Run the application

Use two terminals.

**Terminal 1: backend**

```bash
cd backend
npm start          # or: npm run dev   (auto-restarts on file changes)
```

Expected output:

```
MongoDB connected: <host>
Server running on http://localhost:5000
```

If the database connection fails the server prints an error and exits instead of starting.

**Terminal 2: frontend**

```bash
cd frontend
npm run dev        # npm start does the same
```

### URLs

| What          | URL                                 |
|---------------|-------------------------------------|
| Frontend app  | http://localhost:5173               |
| Backend API   | http://localhost:5000/api/tasks     |
| Health check  | http://localhost:5000/api/health    |

Production build check for the frontend: `cd frontend && npm run build`.

## 11. API documentation

Base URL: `http://localhost:5000/api`. All bodies and responses are JSON. Errors have the form `{ "error": "message" }`.

### Task object

```json
{
  "_id": "665f1c2e9b1e8a0012a4b7c1",
  "title": "Buy milk",
  "completed": false,
  "createdAt": "2026-10-10T09:30:00.000Z",
  "__v": 0
}
```

### GET `/api/tasks`
Returns all tasks, newest first. **200**

```json
[
  { "_id": "665f...c2", "title": "Write report", "completed": true,  "createdAt": "2026-10-10T10:00:00.000Z", "__v": 0 },
  { "_id": "665f...c1", "title": "Buy milk",     "completed": false, "createdAt": "2026-10-10T09:30:00.000Z", "__v": 0 }
]
```

### POST `/api/tasks`
Request:
```json
{ "title": "  Buy milk  " }
```
The title is converted with `String()` and trimmed. **201** with the created task (`completed` is `false`). **400** if the title is empty:
```json
{ "error": "Title is required and cannot be empty." }
```

### PUT `/api/tasks/:id`
Send either or both fields:
```json
{ "completed": true }
```
```json
{ "title": "Buy oat milk" }
```
- **200**: returns the updated task.
- **400**: invalid id, empty title, `completed` that is not a boolean, or no updatable fields.
- **404**: `{ "error": "Task not found." }`

### DELETE `/api/tasks/:id`
- **200**: `{ "message": "Task deleted successfully.", "id": "665f...c1" }`
- **400**: invalid id
- **404**: task not found

### GET `/api/health`
**200** `{ "status": "ok" }`

## 12. How React, Express and MongoDB work together

1. The browser loads the React app from the Vite dev server (port 5173).
2. On load, `App.jsx` calls `getTasks()` (in `services/taskApi.js`) inside `useEffect`. This sends `fetch()` to `http://localhost:5000/api/tasks`.
3. Express receives the request. CORS allows it because the origin matches `FRONTEND_URL`. The route in `routes/taskRoutes.js` asks Mongoose to query MongoDB.
4. MongoDB returns documents, Express sends them as JSON, and React stores them with `useState`, which re-renders the list.
5. Adding, completing, editing and deleting follow the same path (POST, PUT, DELETE). React updates its state using the task returned by the server (or removes the task after a successful delete), so the page never reloads.

## 13. Testing the CRUD operations

With MongoDB, the backend and the frontend running:

1. **Create:** type "Test task" and click **Add Task**. It appears at the top and the input clears.
2. **Persistence:** refresh the browser. The task is still there (it was read from MongoDB).
3. **Validation:** submit an empty or spaces-only title. An error message appears and nothing is added.
4. **Complete / uncomplete:** tick the checkbox (strikethrough appears); untick it (back to normal).
5. **Edit:** click **Edit**, change the text, click **Save**. Try **Cancel**, and try saving an empty title.
6. **Delete:** click **Delete**. The task disappears; refresh to confirm it is gone.
7. **Error handling:** stop the backend and reload the page. A message and **Retry** button appear. Restart the backend and click **Retry**.

Optional API checks from a terminal:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/tasks
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"From curl"}'
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"title":"   "}'   # expect 400
```

## 14. Troubleshooting

| Problem | Likely cause and fix |
|---------|----------------------|
| `MONGO_URI is not set` | You did not create `backend/.env`. Copy `.env.example` and fill in the connection string. |
| `Could not connect to MongoDB` | Local: MongoDB service is not running. Atlas: wrong username/password, IP not in Network Access, or special characters in the password not URL-encoded. |
| Frontend shows "Cannot reach the server" | Backend is not running, or `VITE_API_URL` is wrong. Restart the frontend after editing `.env` (Vite reads it at start-up). |
| Browser console shows a CORS error | `FRONTEND_URL` in `backend/.env` must exactly match the address in the browser (`http://localhost:5173`, no trailing slash). Restart the backend after changing it. |
| `EADDRINUSE` on port 5000 or 5173 | Another process is using the port. Stop it or change `PORT` (and update `VITE_API_URL`). The Vite config uses `strictPort`, so it will not silently switch ports. |
| 404 on API calls | `VITE_API_URL` should end in `/api` and not include `/tasks`. |
| `npm: command not found` | Install Node.js and reopen the terminal. |

## 15. GitHub workflow

See **`GITHUB_WORKFLOW.md`** for step-by-step commands to create the public repository, make meaningful commits, use `feature/backend` and `feature/frontend`, and merge both through pull requests. The repository, commits and pull requests have **not** been created by this project; you must perform those steps yourself.

## 16. Screenshots

See **`screenshots/README.md`**. The required screenshots are currently pending and must be captured from your own running application and GitHub account.

## 17. Final submission checklist

- [ ] MongoDB, backend and frontend run together without console errors
- [ ] All CRUD operations tested in the browser
- [ ] No `.env` or `node_modules` in the ZIP (`.env.example` files are included)
- [ ] Public GitHub repository with at least 5 meaningful commits
- [ ] `feature/backend` and `feature/frontend` branches pushed and merged into `main` via pull requests; no direct commits to `main`
- [ ] 2-3 application screenshots and 1 merged pull request screenshot saved in `screenshots/`
- [ ] ZIP named `B23CS1150_Nikhil_Krishnan_M_Assignment2_MERN_ToDoList.zip` uploaded to Google Classroom and showing "Turned in"
- [ ] GitHub repository URL pasted into the file attached to the assignment
- [ ] Repository kept public until marks are published
