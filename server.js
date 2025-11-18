const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory store to simulate database for payments
const payments = {};

// Create a router to namespace the API endpoints
const apiRouter = express.Router();

/**
 * Endpoint for the frontend to call when the Pi SDK is ready for server approval.
 * In a real application, this is where you would:
 * 1. Verify the payment details with Pi Network's API.
 * 2. Check if the payment is for a valid product/service in your database.
 * 3. Submit the payment to the blockchain for processing.
 */
apiRouter.post('/approve_payment', (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  console.log(`[SERVER] Received approval request for paymentId: ${paymentId}`);

  // Simulate storing the payment state
  payments[paymentId] = { status: 'approved' };
  
  // TODO: In a real app, you would make a POST request to:
  // https://api.pi.network/v2/payments/{paymentId}/approve
  // with your server's API key.

  console.log(`[SERVER] Simulated approval for paymentId: ${paymentId}`);
  res.json({ success: true, message: 'Payment approved for processing.' });
});

/**
 * Endpoint for the frontend to call when the Pi SDK is ready for server completion.
 * In a real application, this is where you would:
 * 1. Verify the transaction (txid) on the Pi blockchain.
 * 2. Fulfill the user's order (e.g., grant access to a feature, create the 3D model).
 * 3. Mark the payment as complete in your database.
 */
apiRouter.post('/complete_payment', (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId and txid are required' });
  }
  
  console.log(`[SERVER] Received completion request for paymentId: ${paymentId} with txid: ${txid}`);

  // Check if payment was 'approved' first
  if (!payments[paymentId] || payments[paymentId].status !== 'approved') {
    return res.status(400).json({ error: 'Payment not approved or not found.' });
  }

  // Simulate updating the payment state
  payments[paymentId].status = 'completed';
  payments[paymentId].txid = txid;

  // TODO: In a real app, you would make a POST request to:
  // https://api.pi.network/v2/payments/{paymentId}/complete
  // with your server's API key to finalize the transaction.

  console.log(`[SERVER] Simulated completion for paymentId: ${paymentId}`);
  
  // You can now safely deliver the digital product/service
  console.log(`[SERVER] Product/Service delivered for paymentId: ${paymentId}`);

  res.json({ success: true, message: 'Payment completed and product delivered.' });
});

// Mount the API router at the /api prefix
app.use('/api', apiRouter);


app.listen(port, () => {
  console.log(`Architex backend server listening at http://localhost:${port}`);
});