import { useState, useEffect } from "react";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../UserForm.css";

// Base API URL from Vite environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

// Static list of countries used in the country dropdown
const countries = [
  "Canada", "United States", "Mexico", "United Kingdom", "Germany", "France",
  "Italy", "Spain", "Japan", "China", "India", "Brazil", "Argentina",
  "South Africa", "Australia", "New Zealand", "Netherlands", "Sweden",
  "Norway", "Switzerland"
];

// Mapping field keys to display labels for dynamic validation messages
const fieldNames = {
  firstName: "First Name",
  lastName: "Last Name",
  dateOfBirth: "Date of Birth",
  address1: "Address 1",
  address2: "Address 2",
  city: "City",
  postalCode: "Postal Code",
  country: "Country",
  phoneNumber: "Phone Number",
  email: "Email",
  userNotes: "User Notes"
};

// Validation patterns used for input sanitization
const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const phonePattern = /^\+\d{1,3}\s\d{4,14}$/;
const cityPattern = /^[A-Za-z\s'-]+$/;
const namePattern = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
const canadaPostalPattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
const usaPostalPattern = /^\d{5}(-\d{4})?$/;
const genericPostalPattern = /^[A-Za-z0-9\s-]{3,12}$/;

// List of required fields that cannot be empty
const requiredFields = [
    "firstName", "lastName", "dateOfBirth", "address1",
    "city", "postalCode", "country", "phoneNumber", "email"
  ];

// Debounce helper to delay execution of a function (used for API validation)
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function validatePostalByCountry(country, postalCode) {
  if (!postalCode) return false;
  const trimmed = postalCode.trim();

  // Canada strict
  if (country === "Canada") {
    return canadaPostalPattern.test(trimmed);
  }

  // USA strict
  if (country === "United States") {
    return usaPostalPattern.test(trimmed);
  }

  // Generic for all other countries
  return genericPostalPattern.test(trimmed);
}

function UserForm({ initialData, submitButtonLabel, onSubmit, onDelete, buttonClass, mode = "create" }) {
  const navigate = useNavigate(); 
  // Local form state. Pre-filled with initialData when editing.
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    email: "",
    userNotes: "",
    ...initialData
  });
  
  // Validation error messages
  const [errors, setErrors] = useState({});
  
  // Controls visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // When editing, populate the form with initial user data
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData,
        _id: initialData._id || null,
        dateOfBirth: initialData.dateOfBirth
          ? initialData.dateOfBirth.split("T")[0] // YYYY-MM-DD
          : ""
      }));
    }
  }, [initialData]);

  // Validates a single field and updates error messages
  const validateField = (name, value) => {
    let error = "";
    if (!value && requiredFields.includes(name)) {
      error = `${fieldNames[name]} is required`;
    } else if ((name === "firstName" || name === "lastName") && value && !namePattern.test(value)) {
      error = `${fieldNames[name]} can only contain letters, spaces, hyphens or apostrophes`;
    } else if (name === "email" && value && !emailPattern.test(value)) {
      error = "Email format is invalid";
    } else if (name === "phoneNumber" && value && !phonePattern.test(value)) {
      error = "Phone number must be in format +<country code> <number>";
    } else if (name === "city" && value && !cityPattern.test(value)) {
      error = "City can contain letters, spaces, apostrophes and hyphens only";
    } else if (name === "postalCode" && value) {
      if (!validatePostalByCountry(form.country, value)) {
        error = form.country
          ? `Postal code format is invalid for ${form.country}`
          : "Postal code format is invalid";
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Checks for uniqueness of email/phone using debounce to reduce server calls
  const checkUnique = debounce(async (name, value) => {
    if (!value) return;
    try {
      const response = await axios.post(`${BASE_URL}/users/check`, {
        email: name === "email" ? value : form.email,
        phoneNumber: name === "phoneNumber" ? value : form.phoneNumber,
        userId: form._id // Prevents false positives during edit mode
      });

      const { emailExists, phoneExists } = response.data;

      setErrors(prev => ({
        ...prev,
        email: name === "email" && emailExists ? "This email is already in use" : prev.email,
        phoneNumber: name === "phoneNumber" && phoneExists ? "This phone number is already in use" : prev.phoneNumber
      }));

    } catch (err) {
      console.error("Error checking uniqueness:", err);
    }
  }, 500);

  // Updates form state on input change and validates field immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);

    // Trigger uniqueness check for email/phone
    if (name === "email" || name === "phoneNumber") {
      checkUnique(name, value);
    }
  };

  // Full form validation before submitting
  const validate = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = `${fieldNames[field]} is required`;
    });
    if (form.firstName && !namePattern.test(form.firstName)) {
      newErrors.firstName = "First Name can only contain letters, spaces, hyphens or apostrophes";
    }
    if (form.lastName && !namePattern.test(form.lastName)) {
      newErrors.lastName = "Last Name can only contain letters, spaces, hyphens or apostrophes";
    }
    if (form.email && !emailPattern.test(form.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (form.phoneNumber && !phonePattern.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in format +<country code> <number>";
    }
    if (form.city && !cityPattern.test(form.city)) {
      newErrors.city = "City can contain letters, spaces, apostrophes and hyphens only";
    }
    if (form.postalCode && !validatePostalByCountry(form.country, form.postalCode)) {
      newErrors.postalCode = form.country
        ? `Postal code format is invalid for ${form.country}`
        : "Postal code format is invalid";
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handles form submission, including a final uniqueness check
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${BASE_URL}/users/check`, {
        email: form.email,
        phoneNumber: form.phoneNumber,
        userId: form._id
      });
      const { emailExists, phoneExists } = response.data;
      const newErrors = {};
      if (emailExists) newErrors.email = "This email is already in use";
      if (phoneExists) newErrors.phoneNumber = "This phone number is already in use";

      if (Object.keys(newErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...newErrors }));
        return;
      }

      // Submit form data to parent component
      onSubmit({
        ...form,
        dateOfBirth: form.dateOfBirth
      });

    } catch (err) {
      console.error("Error checking uniqueness on submit:", err);
    }
  };

  // Opens delete confirmation modal
  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  // Closes delete modal
  const cancelDelete = () => setShowDeleteModal(false);

  // Executes user deletion via API call
  const confirmDelete = async () => {
    if (!form._id) return;
    try {
      await axios.delete(`${BASE_URL}/users/${form._id}`);
      if (typeof onDelete === "function") {
        onDelete(form._id);
      }
      setShowDeleteModal(false);
      navigate("/");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };
  

  return (
    <>
    {/* Main form container - dynamic styling based on mode (create/edit) */}
    <Form onSubmit={handleSubmit} className={`userform-container ${mode === "edit" ? "form-edit" : "form-create"}`}>
      <h2 className={`form-title ${mode === "edit" ? "text-yellow" : "text-cyan"} mb-4`}>
        {mode === "edit" ? "⚡ Edit User" : "⚡ Create User"}
      </h2>

      {/* First Row */}
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className={`${mode}-input`}
              isInvalid={!!errors.dateOfBirth}
            />
            <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Second Row */}
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Address 1</Form.Label>
            <Form.Control
              name="address1"
              value={form.address1}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.address1}
            />
            <Form.Control.Feedback type="invalid">{errors.address1}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              name="address2"
              value={form.address2}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Third Row */}
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.city}
            />
            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.postalCode}
            />
            <Form.Control.Feedback type="invalid">{errors.postalCode}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className={`${mode}-input`}
              isInvalid={!!errors.country}
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Fourth Row */}
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`futuristic-input ${mode}-mode`}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* User Notes */}
      <Form.Group className="mb-3">
        <Form.Label>User Notes</Form.Label>
        <Form.Control
          as="textarea"
          name="userNotes"
          value={form.userNotes}
          onChange={handleChange}
          className={`futuristic-input ${mode}-mode`}
          rows={4}
        />
      </Form.Group>

      {/* Submit / Delete Buttons */}
      <Form.Group className="mt-3 text-center">
      <button type="submit" className={mode === "edit" ? "btn-edit-user" : "btn-add-user"}>
        {mode === "edit" ? "Edit User" : "Add User"}
      </button>

      {mode === "edit" && (
        <button
          type="button"
          className="btn-delete-user ms-3"
          onClick={handleDelete}
        >
          Delete User
        </button>
      )}
    </Form.Group>
    </Form>

    {/* Delete Confirmation Modal */}
    <Modal
      show={showDeleteModal}
      onHide={cancelDelete}
      centered
      className={mode === "edit" ? "edit-modal" : "create-modal"}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>{form.firstName} {form.lastName}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
        <Button variant="danger" onClick={confirmDelete}>Yes, Delete</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default UserForm;
