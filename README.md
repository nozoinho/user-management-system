# User Management System MERN

## Project Overview
This is a simple **User Management System** built with the **MERN stack**:

- **MongoDB**: Database for storing user information
- **Express.js**: Backend API
- **React.js**: Frontend UI
- **Node.js**: Runtime environment

The app allows you to add, edit, view, and delete users with personal and contact information. It uses **Bootstrap 5** for styling and provides **real-time form validation**.

---

## Installation

### Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   MONGODB_URI=<Your MongoDB URI>
   PORT=3000
   ```

### Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:3000
   ```

---

## Running the Application

- **Backend**:
  ```bash
  cd backend
  npm start
  ```
  Runs on [http://localhost:3000](http://localhost:3000)

- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
  Runs on [http://localhost:5173](http://localhost:5173)

> Make sure both servers are running to use the application.

---

## Project Structure (Key Files)

```
project/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── /routes
│   └── /models
├── frontend/
│   ├── main.jsx
│   ├── App.jsx
│   ├── /pages       # Login, UserList, CreateUser, EditUser
│   ├── /components  # Layout, UserForm
│   ├── /styles      # CSS files
│   ├── .env
│   └── package.json
├── eslint.config.js
├── vite.config.js
└── README.md        # This summary file
```

---

**End of README**

