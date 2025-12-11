import { Container, Button } from "react-bootstrap";
import UserForm from "../components/UserForm";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Base API URL loaded from Vite environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

function EditUser() {
  const { id } = useParams(); // Extract user ID from route params
  const navigate = useNavigate();

  // State to hold the user data fetched from the API
  const [user, setUser] = useState(null);

  // State to manage loading status while fetching user data
  const [loading, setLoading] = useState(true);

  // ===== Fetch user on component mount or when id changes =====
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`${BASE_URL}/users/${id}`);
        console.log("Fetched user:", res.data);
        setUser(res.data || {}); // Fallback to empty object if data is missing
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser({}); // Fallback safe object on error
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchUser();
  }, [id]);

  // ===== Handle form submission for updating a user =====
  const handleSubmit = async (formData) => {
    if (!id) return;

    try {
      await axios.put(`${BASE_URL}/users/${id}`, formData);
      navigate("/"); // Redirect to the user list after successful update
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Check console for details.");
    }
  };

  // ===== Handle delete action =====
  const handleDelete = async () => {
    if (!id) return;

    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      navigate("/"); // Redirect to the user list after deletion
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Check console for details.");
    }
  };

  // Navigate back to the User List page
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container className="mt-4">
      {/* Back button to return to the user list */}
      <button className="btn-back mb-3" onClick={handleBack}>
        ← Back to User List
      </button>

      {/* Conditional rendering based on loading and user data */}
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <>
          {user ? (
            // Reuse UserForm component in "edit" mode, passing fetched user data
            <UserForm initialData={user} onSubmit={handleSubmit} mode="edit" />
          ) : (
            <p>User not found.</p>
          )}
        </>
      )}
    </Container>
  );
}

export default EditUser;
