import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import MapView from "../components/MapView";
import axios from "axios";

function Order() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Example current location (delivery partner)
  const [currentLocation] = useState([12.9716, 77.5946]);
  const [customerLocation, setCustomerLocation] = useState([12.9352, 77.6245]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data);
        setStatus(res.data.status);
        setCustomerLocation([res.data.lat, res.data.lng]);
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const pickOrder = async () => {
    setStatus("Picked");
    await axios.post(`/api/orders/${id}/pick`);
  };

  const markDelivered = async () => {
    setStatus("Delivered");
    await axios.post(`/api/orders/${id}/deliver`);
  };

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error)
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!order) return null;

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm rounded mb-4">
            <Card.Body>
              <Card.Title className="mb-3">📦 Order #{order.id}</Card.Title>
              <p>
                <strong>Customer:</strong> {order.customer}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    status === "Delivered"
                      ? "bg-success"
                      : status === "Picked"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {status}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                {status === "Pending" && (
                  <Button onClick={pickOrder} variant="success">
                    Pick Order
                  </Button>
                )}
                {status === "Picked" && (
                  <Button onClick={markDelivered} variant="primary">
                    Mark Delivered
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Map Section */}
          <Card className="shadow-sm rounded">
            <Card.Body>
              <h5 className="mb-3">📍 Delivery Route</h5>
              <MapView start={currentLocation} end={customerLocation} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Order;
