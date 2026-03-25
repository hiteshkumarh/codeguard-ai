# CodeGuard AI

CodeGuard AI is a full-stack, AI-powered static code analysis tool that helps developers instantly identify bugs, security vulnerabilities, and code quality issues entirely locally or optionally via cloud LLMs.

## 🚀 Tech Stack

* **Frontend:** Angular, TypeScript, HTML/CSS
* **Backend:** FastAPI (Python 3.12)
* **Database:** SQLite (Auto-generated locally and stateless within Docker)
* **Containerization:** Docker

---

## 📸 Screenshots

*(Add your application screenshots here)*
* [Dashboard Screenshot Placeholder]
* [Analysis Results Placeholder]

---

## 🛠️ Setup & Run Instructions

This repository is built to be **100% clone-and-run ready**. There is exactly zero manual path configuration required.

### 1. Backend (Docker Run)
The backend is completely containerized. You do not need Python installed locally.

1. Navigate to the backend directory:
   ```bash
   cd codeguard-backend
   ```
2. Build the Docker image:
   ```bash
   docker build -t codeguard-backend .
   ```
3. Run the container:
   ```bash
   docker run -p 8080:8080 codeguard-backend
   ```
*The API is now running on `http://localhost:8080`!* (Swagger documentation is available at `http://localhost:8080/docs`)

### 2. Frontend (Local Development)
The frontend uses standard Angular tooling. You need Node.js and NPM installed.

1. Navigate to the frontend directory:
   ```bash
   cd codeguard-frontend
   ```
2. Install all UI dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
*The Angular UI is now running locally on `http://localhost:4200`!*

---

## ⚙️ Configuration (Optional)

### Environment Variables
`.env` files are fully excluded from Git for strict security. If you wish to use the **optional AI-analysis features**, create a `.env` file in the `codeguard-backend` directory:

```env
GROQ_API_KEY=your_actuall_key_here
```
If you start the backend without this file, AI-analysis will gracefully skip itself without aggressively crashing, falling back to local static analysis execution!

### Git Tracking Exclusions
The provided `.gitignore` files forcefully exclude:
* `node_modules/` and `/dist` (Frontend)
* `__pycache__`, `*.pyc`, `.env` and `codeguard.db` (Backend sqlite artifacts)
This strictly enforces a fresh clean slate every time this repository is seamlessly cloned!
