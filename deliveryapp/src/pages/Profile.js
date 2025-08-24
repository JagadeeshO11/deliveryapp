import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaPhone, FaCar, FaCity, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <Container className="py-5 text-center"><h4>Loading...</h4></Container>;

  const initials = user.name.split(" ").map(n => n[0]).join("");

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white text-center py-4">
              <div className="d-flex flex-column align-items-center">
                <div className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center mb-3"
                     style={{ width:"80px", height:"80px", fontSize:"28px", fontWeight:"bold" }}>
                  {initials}
                </div>
                <h4>{user.name}</h4>
                <small>{user.email}</small>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <p><FaPhone /> {user.phone || "N/A"}</p>
              <p><FaCar /> {user.vehicle || "N/A"}</p>
              <p><FaCity /> {user.city || "N/A"}</p>
            </Card.Body>

            <Card.Footer className="text-center">
              <Badge bg="info">Active</Badge>
              <Button variant="danger" className="mt-3" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
