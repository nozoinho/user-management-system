# 🧑‍💼 User Management System

## 📘 Project Description
This is a simple **User Management System** built with **Node.js**, **Express**, **Handlebars**, and **MongoDB**.  

It allows you to:
- Add new users with personal and contact information.  
- Edit existing users.  
- Delete users.  
- View a list of all users with their details.  

The app uses **Bootstrap 5** for styling and provides **client-side validation** for form inputs.

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
Make sure you have **Node.js** installed.  
Then, in your project directory, run:

```bash
npm install
```

---

### 2. Create a `.env` File
In the project root, create a file named `.env` with the following content:

```
MONGODB_URI=<Your MongoDB Cluster URI>
PORT=3000
```

Ensure MongoDB is accessible using the provided URI.  
If you are using **MongoDB Atlas**, make sure your IP address is **whitelisted**.

---

### 3. Environment Variables

| Variable       | Description                                             |
|----------------|---------------------------------------------------------|
| `MONGODB_URI`  | MongoDB connection string for your database             |
| `PORT`         | Port where the app will run (default: `3000`)           |

```

---

## 🚀 How to Run the App

### Start the Server
In the project directory, run one of the following commands:

```bash
node server.js
```

Or, if you have **nodemon** installed:

```bash
nodemon server.js
```

---

### Access the App
Once the server is running, open your browser and go to:

👉 [http://localhost:3000/users](http://localhost:3000/users)

---

## 🧭 Using the App
1. Click **“Add New User”** to create a new user.  
2. Fill in the form with valid inputs.  
3. Click **“Add User”** or **“Update User”** to save changes.  
4. Use the **Edit** and **Delete** buttons in the users list to modify or remove users.

---
