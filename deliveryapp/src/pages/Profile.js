import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaPhone, FaCar, FaCity, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  // Generate initials if no avatar
  const initials = user.name?.split(" ").map((n) => n[0]).join("") || "U";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // clear token if stored
    navigate("/login");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Header with Avatar */}
            <Card.Header className="bg-primary text-white text-center py-4">
              <div className="d-flex flex-column align-items-center">
                <div
                  className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  {initials}
                </div>
                <h4 className="mb-0">{user.name || "Guest User"}</h4>
                <small className="text-light">
                  {user.email || "No email provided"}
                </small>
              </div>
            </Card.Header>

            {/* Body */}
            <Card.Body className="p-4">
              <Row className="mb-3">
                <Col xs={12}>
                  <p className="mb-1 text-muted">
                    <FaPhone className="me-2 text-success" /> Phone
                  </p>
                  <h6 className="fw-bold">{user.phone || "N/A"}</h6>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12}>
                  <p className="mb-1 text-muted">
                    <FaCar className="me-2 text-warning" /> Vehicle Number
                  </p>
                  <h6 className="fw-bold">{user.vehicle || "N/A"}</h6>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <p className="mb-1 text-muted">
                    <FaCity className="me-2 text-secondary" /> City / Place
                  </p>
                  <h6 className="fw-bold">{user.city || "N/A"}</h6>
                </Col>
              </Row>
            </Card.Body>

            {/* Footer */}
            <Card.Footer className="bg-light text-center">
              <Badge bg="info" pill className="px-3 py-2">
                Active User
              </Badge>
              <p
                className="mt-2 mb-3 text-muted"
                style={{ fontSize: "0.85rem" }}
              >
                Last updated just now
              </p>

              {/* Logout Button */}
              <Button
                variant="danger"
                className="d-flex align-items-center justify-content-center mx-auto"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" /> Logout
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
