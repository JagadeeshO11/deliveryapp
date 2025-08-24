import { Card } from 'react-bootstrap';

function WalletTransaction({ txn }) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Text>
          {txn.date} - {txn.description} - <strong>${txn.amount}</strong>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default WalletTransaction;
