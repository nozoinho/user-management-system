# 👥 User Management System

<p align="center">
  <a href="https://user-management-system-6hwy.onrender.com">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-OPEN%20APPLICATION-2ea44f?style=for-the-badge&logo=render&logoColor=white" alt="Open Live Demo">
  </a>
</p>

<p align="center">
  <strong>Full-stack MERN application for managing user records through a responsive web interface</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB Atlas">
  <img src="https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7">
  <img src="https://img.shields.io/badge/Render-Deployed-000000?logo=render&logoColor=white" alt="Render">
</p>

<p align="center">
  <a href="https://user-management-system-6hwy.onrender.com"><strong>https://user-management-system-6hwy.onrender.com</strong></a>
</p>

---

## Overview

**User Management System** is a full-stack MERN application for creating, viewing, editing, and deleting user records.

The project separates the React frontend from the Node.js and Express REST API while using MongoDB Atlas for cloud persistence. The interface includes responsive Bootstrap styling, reusable React components, client-side validation, and data management through API requests.

### Highlights

- Complete CRUD workflow for user records
- REST API built with Node.js and Express
- MongoDB persistence using Mongoose
- React frontend built with Vite
- Responsive UI with Bootstrap and React Bootstrap
- Client-side form validation
- Data requests through Axios
- AG Grid integration for structured data presentation
- Environment-based frontend and backend configuration
- Separate cloud deployments for frontend and API
- MongoDB Atlas cloud database

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite 7, JavaScript |
| **UI** | Bootstrap 5, React Bootstrap, React Icons |
| **Data Grid** | AG Grid |
| **HTTP Client** | Axios |
| **Routing** | React Router |
| **Backend** | Node.js, Express.js |
| **Persistence** | MongoDB Atlas, Mongoose |
| **Configuration** | dotenv, environment variables |
| **Development** | Nodemon, ESLint |
| **Deployment** | Render Web Service, Render Static Site |

---

## Architecture

```text
                         Browser
                            |
                            v
                +-----------------------+
                | React + Vite Frontend |
                | Render Static Site    |
                +-----------+-----------+
                            |
                         HTTPS API
                            |
                            v
                +-----------------------+
                | Node.js + Express API |
                | Render Web Service    |
                +-----------+-----------+
                            |
                         Mongoose
                            |
                            v
                +-----------------------+
                |     MongoDB Atlas     |
                +-----------------------+
```

The repository uses a monorepo structure with independent frontend and backend applications.

---

## Core Features

### User Management

The application provides the main CRUD operations required to manage user records:

- Create users
- View users
- Edit existing users
- Delete users

### REST API

The Express backend exposes user-related endpoints under:

```text
/users
```

The API receives and returns JSON and communicates with MongoDB through Mongoose.

### Responsive Frontend

The React interface uses Bootstrap-based components and custom styling to provide a responsive browser experience.

### Form Validation

User forms include client-side validation to help prevent incomplete or invalid data from being submitted.

### Data Presentation

AG Grid is included in the frontend stack for structured presentation and interaction with user data.

---

## Repository Structure

```text
user-management-system/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Environment Configuration

Sensitive values and environment-specific URLs are kept outside the source code.

### Backend

Create:

```text
backend/.env
```

with:

```env
MONGODB_URI=<your MongoDB connection string>
PORT=3000
```

### Frontend

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://localhost:3000
```

> Do not commit `.env` files or credentials to the repository.

---

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/nozoinho/user-management-system.git
cd user-management-system
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The API runs locally at:

```text
http://localhost:3000
```

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs by default at:

```text
http://localhost:5173
```

Both applications must be running for the full local experience.

---

## Production Deployment

The project is deployed on Render as two independent services.

### Frontend

**Live Application**

[https://user-management-system-6hwy.onrender.com](https://user-management-system-6hwy.onrender.com)

The React/Vite frontend is deployed as a **Render Static Site**.

### Backend API

**Production API**

[https://user-management-system-api-srd8.onrender.com](https://user-management-system-api-srd8.onrender.com)

The Node.js/Express backend is deployed as a **Render Web Service**.

### Deployment Flow

```text
GitHub main branch
       |
       +-----------------------+
       |                       |
       v                       v
Render Static Site      Render Web Service
React + Vite            Node.js + Express
       |                       |
       +----------+------------+
                  |
                  v
             MongoDB Atlas
```

The frontend receives the production API URL through:

```text
VITE_API_URL
```

The backend receives the database connection securely through:

```text
MONGODB_URI
```

> The hosting service may require a short startup period after inactivity.

---

## Security Practices

- MongoDB credentials are stored in environment variables
- `.env` files are excluded from version control
- The public repository does not contain the MongoDB connection string
- Production environment values are configured directly in Render
- Frontend and backend configuration are separated by environment

---

## Future Improvements

- Authentication and authorization
- Role-based access control
- Automated backend and frontend tests
- Pagination and server-side filtering for larger datasets
- More granular API validation and error handling
- CI/CD quality checks before deployment
- Production monitoring and health checks

---

## Author

**Fernando Ferreyra**

[GitHub Profile](https://github.com/nozoinho)

---

<p align="center">
  <strong>Built with MongoDB, Express, React, Node.js, Vite, and Render.</strong>
</p>
