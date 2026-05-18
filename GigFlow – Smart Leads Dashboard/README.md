# GigFlow – Smart Leads Dashboard

GigFlow is a secure, high-performance, full-stack lead management system designed with **TypeScript**, **Node.js (Express)**, **MongoDB (Mongoose)**, **React**, and **Tailwind CSS**. It incorporates Role-Based Access Control (RBAC), cumulative multi-parameter filtering, debounced text search, backend pagination, and filtered CSV exports.

---

## 🌟 Core Features

1.  **Authentication & Security**: Secure user registration and login utilizing hashed passwords (`bcryptjs`) and stateless JWT authorization middleware.
2.  **Role-Based Access Control (RBAC)**:
    *   **Admin**: Complete CRUD capabilities for leads, customized filtered CSV export, and user management.
    *   **Sales User**: Add and update leads, view dashboard. Cannot delete leads or access CSV exports.
3.  **Lead Management**: Track leads with attributes like name, email, acquisition source (`Website`, `Instagram`, `Referral`), status (`New`, `Contacted`, `Qualified`, `Lost`), and timestamps.
4.  **Advanced Search & Filtering**: Cumulative combined searches:
    *   Fuzzy case-insensitive search (name/email).
    *   Filter by status.
    *   Filter by source.
    *   Sort by latest/oldest.
5.  **Mandatory Optimizations**:
    *   **Backend Pagination**: Page results in chunks of 10 (`skip` and `limit`).
    *   **Debounced Search**: Restricts typing keystroke API floods to 450ms.
    *   **Secure CSV Export**: Admin-only filtered list compilation returned directly from node as a download stream.
6.  **High-Fidelity Aesthetics**: Sleek modern layout including glassmorphism, tailored status indicator badges, and progress visual lifecycle tracks.

---

## 👥 Evaluator Demo Accounts

To quickly test the application without registration:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gigflow.com` | `Admin@123` | Full access + CSV Export + Deletions |
| **Sales User** | `sales@gigflow.com` | `Sales@123` | Add & Edit leads. No delete / No CSV |

---

## ⚙️ Project Setup & Installation

You can run the application **locally** or through **Docker**.

### Method 1: Local Setup

#### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (running locally on port `27017`)

#### 1. Setup Backend
1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (copied from `.env.example`):
    ```bash
    cp .env.example .env
    ```
4.  Seed the database with the demo users and 20 sample leads:
    ```bash
    npm run seed
    ```
5.  Launch the development server:
    ```bash
    npm run dev
    ```
    *The server runs on http://localhost:5000.*

#### 2. Setup Frontend
1.  Navigate into the `frontend/` directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (copied from `.env.example`):
    ```bash
    cp .env.example .env
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *The frontend runs on http://localhost:3000.*

---

### Method 2: Docker Setup (Recommended)

To spin up all services (MongoDB, Backend, and Frontend) instantly in isolated containers:

1.  Make sure Docker and Docker Compose are installed on your machine.
2.  From the root directory, run:
    ```bash
    docker-compose up --build
    ```
3.  Seed the DB in the running docker container (open another terminal in the root folder):
    ```bash
    docker exec -it gigflow-backend npm run seed
    ```
4.  Open the application in your browser:
    *   **Frontend**: http://localhost:3000
    *   **Backend API**: http://localhost:5000

---

## 📁 Repository Structure

```text
GigFlow – Smart Leads Dashboard/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers (CRUD, Auth)
│   │   ├── middleware/       # Token validation & RBAC rules
│   │   ├── models/           # User & Lead Mongoose models
│   │   ├── routes/           # Routing directories
│   │   └── utils/            # DB Seeding script
│   └── Dockerfile
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Layouts, Modals, Protected routes
│   │   ├── context/          # Auth Context State Provider
│   │   ├── pages/            # Login, Register, Dashboard, Details
│   │   └── index.css         # Tailwind & custom glass themes
│   └── Dockerfile
└── docker-compose.yml        # Orchestration script
```
