import { Container } from 'react-bootstrap';
import UserForm from '../components/UserForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Base API URL loaded from Vite environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

function CreateUser() {
  const navigate = useNavigate();

  // Handles form submission for creating a new user.
  // Receives validated formData from UserForm.
  const handleSubmit = async (formData) => {
    await axios.post(`${BASE_URL}/users`, formData);
    navigate('/');
  };

  // Navigates back to the User List page
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container className="mt-4">

      {/* Navigation button to return to the User List */}
      <button className="btn-back mb-3" onClick={handleBack}>
        ← Back to User List
      </button>
      
      {/* Reuse of UserForm component for creating users */}
      <UserForm onSubmit={handleSubmit} />
    </Container>
  );
}

export default CreateUser;
