# CLM-System
A full-stack Client Lead Management System (Mini CRM) built to manage, organize, and track customer leads efficiently. Features include authentication, lead creation and management, admin controls, and a responsive interface for streamlined workflow.

# ⚡ LeadFlow — Mini CRM
### A Full-Stack Client Lead Management System
**College Project | React + Node.js + Express + MongoDB**

---

## 📁 Project Structure

```
mini-crm/
│
├── backend/
│   ├── server.js       ← Express app entry point
│   ├── auth.js         ← JWT login route + middleware
│   ├── routes.js       ← Lead CRUD API routes
│   ├── leadModel.js    ← Mongoose schema for Lead
│   ├── package.json
│   └── .env            ← Admin credentials & secrets
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx    ← React entry point
        ├── App.jsx     ← Auth routing (Login ↔ Dashboard)
        ├── Login.jsx   ← Admin login page
        ├── Dashboard.jsx ← Main dashboard with all features
        ├── api.js      ← All API calls (fetch wrappers)
        └── style.css   ← Full CSS styling
```

---

## 🚀 How to Run Locally in VS Code

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed locally
  - OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster
- VS Code with a terminal

---

### Step 1 — Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (macOS/Linux)
mongod

# On Windows: start it from Services, or run:
# "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

**Option B: MongoDB Atlas (cloud)**
1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/minicrm`)
3. Paste it into `backend/.env` as `MONGO_URI`

---

### Step 2 — Start the Backend

Open a terminal in VS Code (`Ctrl+` ` `):

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Server running at http://localhost:5000
✅ MongoDB connected successfully
```

---

### Step 3 — Start the Frontend

Open a **second terminal** in VS Code:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

---

### Step 4 — Open in Browser

Go to: **http://localhost:3000**

Login with:
- **Username:** `admin`
- **Password:** `admin123`

_(You can change these in `backend/.env`)_

---

## 🔌 API Reference

All routes require `Authorization: Bearer <token>` header (except login).

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | `/api/auth/login`  | Admin login → JWT    |
| GET    | `/api/leads`       | Get all leads        |
| POST   | `/api/leads`       | Add a new lead       |
| PUT    | `/api/leads/:id`   | Update a lead        |
| DELETE | `/api/leads/:id`   | Delete a lead        |

### Example: Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Example: Add Lead
```http
POST http://localhost:5000/api/leads
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "source": "Website",
  "status": "New",
  "notes": "Interested in premium plan. Follow up Monday."
}
```

---

## 🗃️ Database Schema (MongoDB)

**Collection: `leads`**

| Field       | Type     | Required | Values                                                      |
|-------------|----------|----------|-------------------------------------------------------------|
| `name`      | String   | ✅       | Any                                                         |
| `email`     | String   | ✅       | Any email                                                   |
| `source`    | String   | ❌       | Website / Referral / Social Media / Email Campaign / Cold Call / Other |
| `status`    | String   | ❌       | New / Contacted / Converted                                 |
| `notes`     | String   | ❌       | Any text                                                    |
| `createdAt` | Date     | auto     | Auto-set by MongoDB                                         |
| `updatedAt` | Date     | auto     | Auto-set on every update                                    |

---

## 🔒 Authentication Flow

1. Admin submits username + password on Login page
2. Backend checks against `.env` values
3. If valid, backend returns a JWT token (valid 8 hours)
4. Frontend stores token in `localStorage`
5. Every subsequent API call sends `Authorization: Bearer <token>`
6. Backend middleware verifies token before processing each request

---

## 🧰 Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 18 + Vite     |
| Styling    | Pure CSS (no library) |
| Backend    | Node.js + Express   |
| Database   | MongoDB + Mongoose  |
| Auth       | JSON Web Tokens (JWT) |
| Dev Tool   | Nodemon (auto-restart) |
