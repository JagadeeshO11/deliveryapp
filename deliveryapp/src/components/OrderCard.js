import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function OrderCard({ order }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Order #{order.id}</Card.Title>
        <Card.Text>
          Customer: {order.customer}<br/>
          Status: {order.status}<br/>
          Amount: ${order.amount}
        </Card.Text>
        <Link to={`/orders/${order.id}`}>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default OrderCard;
