require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // Import axios for API calls
const app = express();
const port = process.env.PORT || 3000;

// IMPORTANT: You must set this environment variable in your deployment platform (e.g., Render, Heroku)
// Get this key from the Pi Developer Portal (develop.pi)
const PI_API_KEY = process.env.PI_API_KEY; 
const PI_API_URL = 'https://api.minepi.com';

app.use(cors());
app.use(express.json());

// In-memory store is useful for development, but use a real DB in production
const payments = {};

const apiRouter = express.Router();

/**
 * Endpoint: /api/approve_payment
 * Handles the Server-Side Approval logic required by Pi Network.
 */
apiRouter.post('/approve_payment', async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  console.log(`[SERVER] Processing approval for paymentId: ${paymentId}`);

  // 1. If no API Key is configured, we fallback to simulation mode for local dev without keys
  if (!PI_API_KEY) {
    console.warn('[SERVER] WARNING: PI_API_KEY is missing. Simulating approval.');
    payments[paymentId] = { status: 'approved' };
    return res.json({ success: true, message: 'Payment approved (SIMULATION MODE).' });
  }

  try {
    // 2. Call Pi Network API to approve the payment
    const response = await axios.post(
      `${PI_API_URL}/v2/payments/${paymentId}/approve`,
      {}, // Body is empty for approval
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 3. Update local state
    payments[paymentId] = { status: 'approved' };
    console.log(`[SERVER] Payment ${paymentId} approved successfully on Pi Network.`);
    
    res.json({ success: true, message: 'Payment approved.' });

  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error('[SERVER] Failed to approve payment. Details:', JSON.stringify(errorData, null, 2));
    // Return more details to the client for debugging
    res.status(500).json({ 
      error: 'Failed to approve payment on Pi Network',
      details: errorData
    });
  }
});

/**
 * Endpoint: /api/complete_payment
 * Handles the Server-Side Completion logic after the transaction is submitted to the blockchain.
 */
apiRouter.post('/complete_payment', async (req, res) => {
  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId and txid are required' });
  }
  
  console.log(`[SERVER] Completing paymentId: ${paymentId} with txid: ${txid}`);

  // 1. If no API Key, fallback to simulation
  if (!PI_API_KEY) {
    console.warn('[SERVER] WARNING: PI_API_KEY is missing. Simulating completion.');
    if (payments[paymentId]) {
        payments[paymentId].status = 'completed';
        payments[paymentId].txid = txid;
    }
    return res.json({ success: true, message: 'Payment completed (SIMULATION MODE).' });
  }

  try {
    // 2. Call Pi Network API to complete the payment
    const response = await axios.post(
      `${PI_API_URL}/v2/payments/${paymentId}/complete`,
      { txid }, // Pass the transaction ID
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 3. Update local state and Deliver the product
    if (payments[paymentId]) {
        payments[paymentId].status = 'completed';
        payments[paymentId].txid = txid;
    }
    
    console.log(`[SERVER] Payment ${paymentId} completed successfully on Pi Network.`);
    console.log(`[SERVER] ASSET DELIVERED TO USER.`);

    res.json({ success: true, message: 'Payment completed and verified.' });

  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error('[SERVER] Failed to complete payment. Details:', JSON.stringify(errorData, null, 2));
    res.status(500).json({ 
      error: 'Failed to complete payment on Pi Network',
      details: errorData
    });
  }
});

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Architex backend server listening on port ${port}`);
  if (!PI_API_KEY) {
      console.log("NOTE: Server running in SIMULATION MODE. Set PI_API_KEY env var for real Pi Network connection.");
  } else {
      console.log("NOTE: Server running in LIVE MODE with Pi Network API.");
  }
});