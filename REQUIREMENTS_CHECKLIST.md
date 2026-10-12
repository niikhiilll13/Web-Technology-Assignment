# Requirements Checklist

Maps each requirement of the assignment brief to the project and its current status.

**Status legend**

- **Implemented**: the code or file exists in this project.
- **Checked in sandbox**: verified here by the means stated. The sandbox had **no MongoDB server and no browser**.
- **Pending (you)**: must be done or confirmed by you on your own machine or GitHub account.

What was actually run: syntax checks on all backend files; `npm run build` for the frontend (succeeded); the real Mongoose schema loaded and validated without a database; and the real Express server and routes exercised over HTTP with the database layer replaced by an in-memory stand-in (22 checks passed). These are **not** database integration tests: nothing was run against real MongoDB, and the React UI was not opened in a browser.

## Part A: Backend (24 marks)

| # | Requirement | Marks | Implemented | Checked in sandbox | Pending (you) |
|---|-------------|-------|-------------|--------------------|---------------|
| A1 | Node.js project, Express server, `express.json()` | - | Yes (`backend/server.js`, `package.json`) | Server started and parsed JSON bodies (stubbed DB); malformed JSON returned 400 | |
| A2 / Row 1 | MongoDB connection via Mongoose; string from `.env` via `process.env.MONGO_URI` (dotenv) | 4 | Yes (`config/db.js`); server starts only after connect succeeds | Startup with no `MONGO_URI` exits with a clear message. Code reviewed for `process.env.MONGO_URI` | Real connection to Atlas/local MongoDB |
| A3 / Row 2 | Task model: `title` String required, `completed` Boolean default false, `createdAt` Date default now | 6 | Yes (`models/Task.js`) | Loaded real schema: exactly these 3 fields, defaults correct, missing title fails validation | |
| A4 / Row 3 | `GET /api/tasks`, `POST /api/tasks` (201 on create) | 6 | Yes (`routes/taskRoutes.js`) | Status codes, newest-first sort and trimming checked against stubbed DB | Run against real MongoDB |
| A4 / Row 4 | `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` (404 when missing) | 6 | Yes | 200/400/404 paths checked against stubbed DB | Run against real MongoDB |
| A5 / Row 5 | Title via `String()`, trimmed, empty -> 400 (POST and PUT) | 2 (shared) | Yes | POST/PUT with empty, whitespace, missing and numeric titles checked (stubbed DB) | |
| A6 / Row 5 | CORS only for the frontend address | (in row 5) | Yes: `cors({ origin: FRONTEND_URL })`, default `http://localhost:5173` | Allowed origin received the header; another origin did not; never `*` | |

Note: the brief's CORS example uses port 3000 (Create React App). Vite uses 5173, so `FRONTEND_URL` is set to 5173 as you specified.

Extra: `GET /api/health`, invalid ObjectId -> 400, non-boolean `completed` -> 400, JSON error responses.

## Part B: Frontend (14 marks)

| # | Requirement | Marks | Implemented | Checked in sandbox | Pending (you) |
|---|-------------|-------|-------------|--------------------|---------------|
| B1 | React app (Vite) split into TaskForm, TaskList, TaskItem | - | Yes | Production build succeeded | |
| B2 / Row 7 | Fetch all tasks on load with `useEffect`; keep in `useState` | 4 | Yes (`App.jsx`) | Build only | Confirm in browser |
| B3 / Row 6 | Add form -> POST, add to list, clear input | 4 | Yes (`TaskForm.jsx`, `App.jsx`) | Build only | Confirm in browser |
| B4 + B5 / Row 8 | Checkbox for complete/incomplete via PUT with strikethrough; Delete via DELETE | 4 | Yes (`TaskItem.jsx`) | Build only | Confirm in browser |
| B6 / Row 9 | All actions call the API; screen updates without page reload | 2 | Yes (state updated from server responses) | Build only | Confirm in browser |

Extra: edit title with Cancel, loading/empty/error states with Retry, duplicate-submit protection, responsive layout, accessible labels, visible focus.

## Part C: GitHub and documentation (12 marks)

| # | Requirement | Marks | Implemented | Checked in sandbox | Pending (you) |
|---|-------------|-------|-------------|--------------------|---------------|
| C1 / Row 10 | Public repository, at least 5 meaningful commits | 2 | Instructions and commit messages in `GITHUB_WORKFLOW.md` | Not applicable | **Create the repo and commits** |
| C2 + C3 / Row 11 | `feature/backend` and `feature/frontend` pushed; PRs merged into `main`; no direct commits to `main` | 2 | Instructions in `GITHUB_WORKFLOW.md` | Not applicable | **Branches, PRs and merges** |
| C4 / Row 12 | `.gitignore` excluding `node_modules` and `.env`; `.env.example` committed | 2 | Yes: root, `backend/` and `frontend/` `.gitignore`; both `.env.example` files | ZIP inspected: no `.env`, no `node_modules` | Confirm `git ls-files` shows no `.env` before pushing |
| Row 13 | Code organisation, README, screenshots | 6 | Structure, comments, README, this checklist, GitHub guide | Structure matches imports; build passes | **Screenshots are pending** |

## Submission requirements

| Requirement | Status |
|-------------|--------|
| ZIP of backend and frontend, without `node_modules` and `.env` | Implemented (ZIP generated, contents inspected) |
| ZIP contains code, screenshots (or instructions) and README only | Implemented; screenshots folder holds instructions only |
| README explains running the project (`npm install`, `npm start`, env variables) | Implemented |
| File named `RollNo_Name_Assignment2_MERN_ToDoList.zip` | Implemented: `B23CS1150_Nikhil_Krishnan_M_Assignment2_MERN_ToDoList.zip` |
| Upload to Google Classroom and confirm "Turned in" | **Pending (you)** |
| Paste GitHub repository URL into the attached file | **Pending (you)** |
| 2-3 application screenshots (add, complete, delete) | **Pending (you)** |
| 1 screenshot of merged PRs (Pull requests -> Closed) | **Pending (you)** |
| Keep repository public until marks are published | **Pending (you)** |
| Test with backend and frontend running; no console errors | **Pending (you)** |
