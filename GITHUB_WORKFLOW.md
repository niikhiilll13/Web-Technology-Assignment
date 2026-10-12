# GitHub Workflow Guide

This guide gives the exact steps to meet the GitHub requirements: a public repository, at least 5 meaningful commits, `feature/backend` and `feature/frontend` branches, pull requests merged into `main`, and no direct commits to `main`.

> **Status:** none of these steps have been carried out. No repository, commits, branches or pull requests exist yet. Do them yourself, and capture the screenshot only from real merged pull requests.

Replace `YOUR-USERNAME` and `YOUR-REPO` with your own values. Use the project folder name `B23CS1150_Nikhil_Krishnan_M_Assignment2_MERN_ToDoList` or a shorter repo name such as `mern-todo-list`.

## Why the repo must start with one commit on `main`

A pull request needs a base branch with history. If you create an empty repository, `main` does not exist yet, so there is nothing to merge into. Creating the repository with GitHub's **"Add a README file"** option gives `main` its first commit without you committing to it directly.

## 1. Create a public GitHub repository

1. On GitHub click **New repository**.
2. Name it (for example `mern-todo-list`).
3. Set visibility to **Public**.
4. Tick **Add a README file**.
5. Leave `.gitignore` and licence as "None" (the project already has a `.gitignore`).
6. Click **Create repository**, then copy the HTTPS clone URL.

## 2. Get the repository onto your machine

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
```

Unzip the project and copy its **contents** (`backend/`, `frontend/`, `screenshots/`, `.gitignore`, `README.md`, `GITHUB_WORKFLOW.md`, `REQUIREMENTS_CHECKLIST.md`) into this cloned folder. Overwrite the placeholder `README.md`. Do not copy `node_modules` or any real `.env`.

If you prefer `git init` instead, run `git init -b main`, then `git remote add origin <URL>` and `git pull origin main`. The result is the same as cloning.

Confirm you are on `main` and have not committed anything to it:

```bash
git branch --show-current     # should print: main
git log --oneline             # only GitHub's "Initial commit"
```

## 3. Temporary working branch: project setup

```bash
git checkout -b chore/project-setup

git add .gitignore
git commit -m "Add root .gitignore for node_modules, env files and build output"

git add README.md GITHUB_WORKFLOW.md REQUIREMENTS_CHECKLIST.md screenshots/README.md
git commit -m "Add project documentation and screenshot instructions"

git push -u origin chore/project-setup
```

On GitHub open the **Compare & pull request** banner, create the pull request into `main`, and **merge** it. Then update local `main`:

```bash
git checkout main
git pull origin main
```

(Avoid `git add .` until you have checked `git status`, so no `.env` or `node_modules` is staged by accident.)

## 4. Backend branch: `feature/backend`

```bash
git checkout -b feature/backend
git push -u origin feature/backend      # optional early push; also done at the end
```

Commit the backend in logical stages:

```bash
git add backend/package.json backend/package-lock.json backend/.gitignore backend/.env.example
git commit -m "Initialize backend Node.js project and environment template"

git add backend/config/db.js
git commit -m "Add MongoDB connection using Mongoose and MONGO_URI"

git add backend/models/Task.js
git commit -m "Add Task model with title, completed and createdAt"

git add backend/routes/taskRoutes.js
git commit -m "Add GET, POST, PUT and DELETE task endpoints with validation"

git add backend/server.js
git commit -m "Add Express server with restricted CORS and health endpoint"

git push origin feature/backend
```

Intermediate commits do not each have to run on their own; they only need to be logical and clearly described.

Before pushing, check that no secret is tracked:

```bash
git ls-files | grep -E "(^|/)\.env$"    # must print nothing
git status                               # no node_modules, no .env
```

## 5. Open and merge the backend pull request

1. On GitHub open **Pull requests -> New pull request**.
2. Base: `main`, compare: `feature/backend`.
3. Title: "Add backend: Express API with MongoDB and Mongoose". Add a short description.
4. Click **Create pull request**, then **Merge pull request** and choose **Create a merge commit** (it keeps your individual commits visible; "Squash" would collapse them). Confirm the merge.

```bash
git checkout main
git pull origin main
```

## 6. Frontend branch: `feature/frontend`

Create it from the **updated** `main`:

```bash
git checkout -b feature/frontend

git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/.gitignore frontend/.env.example frontend/public frontend/src/main.jsx
git commit -m "Scaffold React app with Vite and environment template"

git add frontend/src/services/taskApi.js
git commit -m "Add API service for task requests using fetch"

git add frontend/src/components
git commit -m "Add TaskForm, TaskList and TaskItem components"

git add frontend/src/App.jsx
git commit -m "Add App state management with useState and useEffect"

git add frontend/src/index.css
git commit -m "Add responsive styling with loading, empty and error states"

git push -u origin feature/frontend
```

Add any screenshots you capture on this branch as well, for example:

```bash
git add screenshots
git commit -m "Add application screenshots"
git push
```

(The merged-pull-request screenshot can only be taken after both merges, so commit it afterwards through a small extra branch and pull request, or include it only in the ZIP. Do not commit to `main` directly.)

## 7. Open and merge the frontend pull request

Repeat step 5 with base `main`, compare `feature/frontend`, title "Add frontend: React interface connected to the API". Merge it, then:

```bash
git checkout main
git pull origin main
```

## 8. Verify `main` holds the complete application

```bash
git log --oneline --graph
git ls-files
```

You should see `backend/`, `frontend/`, the documentation and both `.env.example` files, but no `.env`. For a fresh check, clone the repository into a new folder, follow the README, and confirm the app runs.

## 9. Capture the merged pull requests screenshot

1. On GitHub open your repository and click **Pull requests**.
2. Click the **Closed** tab.
3. Capture the page showing the merged backend and frontend pull requests (purple "Merged" icon).
4. Save it as `screenshots/04-merged-pull-requests.png` and add it to the ZIP.

## 10. Submission reminders

- Keep the repository **public** until marks are published.
- Commits made after the deadline will not be considered.
- Paste the repository URL into the file attached to the assignment.
- Do not commit directly to `main`.
