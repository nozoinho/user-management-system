import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../layout.css"; // Custom layout styles

/**
 * Layout component
 * ----------------
 * This component wraps all protected pages of the application.
 * It provides a consistent UI structure using:
 *  - A top navigation bar
 *  - A main content area
 *  - A footer
 *
 * Props:
 *  - user: object containing the logged-in user's data
 *  - onLogout: function triggered when the user clicks "Logout"
 *  - children: content of the current page rendered inside the layout
 */
function Layout({ user, onLogout, children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-app text-light">
      
      {/* Top Navigation Bar */}
      <Navbar
        expand="lg"               // Mobile responsive collapse
        className="custom-navbar shadow-sm"
        variant="dark"            // Dark text and background theme
      >
        <Container>
          {/* Application brand / title */}
          <Navbar.Brand className="brand-glow">⚡ User Management</Navbar.Brand>
          {/* Mobile toggle button (hamburger) */}
          <Navbar.Toggle aria-controls="navbar-nav" className="toggle-custom" />
          {/* Collapsible container for nav links */}
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav className="align-items-center nav-links-futuristic">
              {/* Display navigation items only when user is logged in */}
              {user && (
                <>
                  {/* Navigation link to Home (User List) */}
                  <Nav.Link as={Link} to="/" className="text-info me-3">
                    Home
                  </Nav.Link>
                  {/* Greeting message with username */}
                  <span className="me-3">
                    Welcome, <strong>{user.username}</strong>
                  </span>
                </>
              )}
              {/* Logout button, shown only when user is authenticated */}
              {user && (
                <Button variant="outline-info" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main page content */}
      <main className="p-2 app-content">{children}</main>

      {/* Footer at bottom of layout */}
      <footer className="footer-futuristic">
        &copy; {new Date().getFullYear()} User Management System
      </footer>
    </div>
  );
}

export default Layout;
