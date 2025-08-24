// components/Navbar.js
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide Navbar on login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm mb-3">
        <Container>
          {/* Brand */}
          <Navbar.Brand as={Link} to="/dashboard">
            🚴 DeliveryApp
          </Navbar.Brand>

          {/* Toggle for mobile */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" />

          {/* Offcanvas Menu for Mobile */}
          <Navbar.Offcanvas id="offcanvasNavbar" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ms-auto gap-3">
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/wallet">
                  Wallet
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default AppNavbar;
