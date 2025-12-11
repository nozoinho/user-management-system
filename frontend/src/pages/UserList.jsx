import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Base AG Grid CSS
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Custom CSS for user list
import "../UserList.css";

function UserList() {
  const [users, setUsers] = useState([]); // List of users from backend
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls delete confirmation modal visibility
  const [userToDelete, setUserToDelete] = useState(null); // Controls delete confirmation modal visibility
  const navigate = useNavigate(); // Router navigation hook

 // API base URL from environment
 const BASE_URL = import.meta.env.VITE_API_URL;

  // ===== Fetch all users from API =====
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`);
      const data = await res.json();
      setUsers(data); // Update state with user list
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Navigate to Edit User page =====
  const handleEdit = (user) => {
    navigate(`/edit/${user._id}`);
  };

  // ===== Open delete confirmation modal =====
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // ===== Delete user from backend =====
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await fetch(`${BASE_URL}/users/${userToDelete._id}`, { method: "DELETE" });
      fetchUsers(); // Refresh list after deletion
      setShowDeleteModal(false);
      setUserToDelete(null);
      navigate("/"); // Redirect back to user list
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // ===== AG Grid column definitions =====
  const columns = [
    { headerName: "First Name", field: "firstName", flex: 1.2 },
    { headerName: "Last Name", field: "lastName", flex: 1.2 },
    { headerName: "Email", field: "email", flex: 2.3 },
    { headerName: "Phone", field: "phoneNumber", flex: 1.4 },
    { headerName: "Address 1", field: "address1", flex: 1 },
    { headerName: "Address 2", field: "address2", flex: 1 },
    { headerName: "City", field: "city", flex: 1 },
    { headerName: "Postal Code", field: "postalCode", flex: 1 },
    { headerName: "Country", field: "country", flex: 1 },
    {
    headerName: "Date of Birth",
    field: "dateOfBirth",
    flex: 1,
    wrapText: true,
    autoHeight: true,
    // Format ISO date to "Apr 15, 1992" format
    valueFormatter: (params) => {
        if (!params.value) return "";
        const [year, month, day] = params.value.split("T")[0].split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }); // Ej: "Apr 15, 1992"
      },
    },
    { headerName: "User Notes", field: "userNotes", flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filter: false,
      width: 130,
      // Render edit and delete buttons
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button
            className="btn-edit"
            onClick={() => handleEdit(params.data)}
            title="Edit User"
          >
            <FaEdit size={16} />
          </button>

          <button
            className="btn-delete"
            onClick={() => confirmDeleteUser(params.data)}
            title="Delete User"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    }
  ];

  return (
    <Container fluid className="px-0 userlist-container">
      {/* ===== Header with title and Add User button ===== */}
      <Row className="mb-3">
        <Col>
          <h2 className="text-info">⚡ User List</h2>
        </Col>
        <Col className="text-end">
          <Button className="btn-add-user-futuristic" onClick={() => navigate("/create")}>
            + Add User
          </Button>
        </Col>
      </Row>

      {/* ===== User table or empty state ===== */}
      {users.length === 0 ? (
        <p className="no-rows">No Users Found</p>
      ) : (
        <div className="ag-theme-quartz userlist-grid">
          <AgGridReact
            rowData={users} // Data for grid
            columnDefs={columns} // Column definitions
            pagination={true}
            paginationPageSize={8}
            domLayout="autoHeight"
            suppressPaginationPanel={false}
            paginationPageSizeSelector={[8, 16, 32, 64]}
            theme="legacy"
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              wrapText: true,
              autoHeight: true
            }}
            animateRows={true} // Smooth row transitions
          />
        </div>
      )}

      {/* ===== Delete Confirmation Modal ===== */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <p>
              Are you sure you want to <strong>delete</strong> user{" "}
              <strong>
                {userToDelete.firstName} {userToDelete.lastName}
              </strong>
              ?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default UserList;
