import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";

function App() {
  // ===== Global user state =====
  const [user, setUser] = useState(null); // Stores logged-in user info
  const [loading, setLoading] = useState(true); // Prevents premature redirects before session check

   const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  // ===== Check session on app load =====
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const { username, expiry } = JSON.parse(session);
      if (Date.now() < expiry) {
        setUser({ username });
      } else {
        localStorage.removeItem("userSession"); // Session expired
        setUser(null);
      }
    }
    setLoading(false); // Done checking session
  }, []);

  // ===== Refresh session expiry on user interaction =====
  useEffect(() => {
    const refreshExpiry = () => {
      const session = localStorage.getItem("userSession");
      if (session) {
        const { username } = JSON.parse(session);
        const newExpiry = Date.now() + SESSION_DURATION;
        localStorage.setItem(
          "userSession",
          JSON.stringify({ username, expiry: newExpiry })
        );
      }
    };

    // Refresh on click or keypress events
    window.addEventListener("click", refreshExpiry);
    window.addEventListener("keypress", refreshExpiry);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("click", refreshExpiry);
      window.removeEventListener("keypress", refreshExpiry);
    };
  }, []);

  // ===== Periodically check for session expiration =====
  useEffect(() => {
    const interval = setInterval(() => {
      const session = localStorage.getItem("userSession");
      if (session) {
        const { expiry } = JSON.parse(session);
        if (Date.now() > expiry) {
          // Session expired
          localStorage.removeItem("userSession");
          setUser(null);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // ===== Handle Login =====
  const handleLogin = (loginUser) => {
    const expiry = Date.now() + SESSION_DURATION;
    localStorage.setItem(
      "userSession",
      JSON.stringify({ ...loginUser, expiry })
    );
    setUser(loginUser);
  };

  // ===== Handle Logout =====
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userSession");
  };

  // ===== Protected Route Component =====
  // Prevents access to protected pages if not logged in
  const ProtectedRoute = ({ children }) => {
    if (loading) return null; // Prevent redirect to login while checking session
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <UserList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <CreateUser />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <EditUser />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
