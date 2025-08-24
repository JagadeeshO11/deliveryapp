import { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import WalletTransaction from "../components/WalletTransaction";
import axios from "axios";

function Wallet() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get("/api/wallet");
        setTransactions(res.data.transactions);
        setBalance(res.data.balance);
      } catch (err) {
        setError("Failed to load wallet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {/* Wallet Balance Card */}
          <Card className="shadow-sm rounded mb-4 text-center">
            <Card.Body>
              <h4 className="fw-bold mb-2">💰 Wallet Balance</h4>
              <h2 className="text-success fw-bold">${balance}</h2>
            </Card.Body>
          </Card>

          {/* Transactions List */}
          <Card className="shadow-sm rounded">
            <Card.Body>
              <h5 className="mb-3">📜 Transactions</h5>
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <WalletTransaction key={txn.id} txn={txn} />
                ))
              ) : (
                <Alert variant="info">No transactions found</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Wallet;
