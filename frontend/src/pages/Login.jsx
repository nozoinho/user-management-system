import { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../login.css";

function Login({ onLogin }) {
   // State for username input
  const [username, setUsername] = useState("");

  // State for real-time validation errors
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // Hook to programmatically navigate routes

  // ===== Handle input change with real-time validation =====
  const handleChange = (e) => {
  const value = e.target.value;
  setUsername(value);

   // Validate username as user types
  if (!value) {
      setError("Username is required"); // Ensure input is not empty
    } else if (value.length <= 4) {
      setError("Username must be more than 4 characters"); // Minimum length requirement
    } else {
      setError(""); // Clear error when input is valid
    }
  };

  // ===== Handle form submission =====
  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submitting
    if (!username) {
      setError("Username is required"); // Safety check
      return;
    }
    if (error) return; // Prevent submit if any error exists

    onLogin({ username }); // Call parent handler with username
    navigate("/"); // Redirect to main page after login
  };

  return (
    <div className="login-page">
      <Container>
        {/* Welcome Title */}
        <h1 className="text-center text-info login-welcome-title">
          ⚡ Welcome to the User Management System ⚡
        </h1>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            {/* Card container for login form */}
            <Card className="p-4 shadow-lg login-card">
              <Card.Body>
                {/* Login title */}
                <Card.Title className="mb-4 text-info text-center">
                  ⚡ Login
                </Card.Title>
                {/* Login form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3 text-info" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={handleChange} // Handle real-time input
                      isInvalid={!!error} // Show validation state in UI
                      className="login-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {error} {/* Display error messages */}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Submit button */}
                  <Button type="submit" className="w-100 login-button" disabled={!!error}>
                    Login
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
