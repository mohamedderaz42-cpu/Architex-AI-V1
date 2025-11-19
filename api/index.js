
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PI_API_KEY = process.env.PI_API_KEY;
const PI_API_URL = 'https://api.minepi.com';

app.use(cors());
app.use(express.json());

// Initialize Router
const router = express.Router();

/**
 * Endpoint: /api/approve_payment
 */
router.post('/approve_payment', async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  console.log(`[VERCEL API] Processing approval for paymentId: ${paymentId}`);

  if (!PI_API_KEY) {
    console.warn('[VERCEL API] PI_API_KEY is missing. Requests to Pi Network will fail.');
    return res.status(500).json({ error: 'Server configuration error: Missing PI_API_KEY' });
  }

  try {
    // Call Pi Network API to approve the payment
    const response = await axios.post(
      `${PI_API_URL}/v2/payments/${paymentId}/approve`,
      {}, // Body is empty
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[VERCEL API] Payment ${paymentId} approved successfully.`);
    res.json({ success: true, message: 'Payment approved for processing.' });

  } catch (error) {
    console.error('[VERCEL API] Failed to approve payment:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to approve payment on Pi Network',
      details: error.response?.data 
    });
  }
});

/**
 * Endpoint: /api/complete_payment
 */
router.post('/complete_payment', async (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId and txid are required' });
  }
  
  console.log(`[VERCEL API] Completing paymentId: ${paymentId} with txid: ${txid}`);

  if (!PI_API_KEY) {
     return res.status(500).json({ error: 'Server configuration error: Missing PI_API_KEY' });
  }

  try {
    // Call Pi Network API to complete the payment
    const response = await axios.post(
      `${PI_API_URL}/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[VERCEL API] Payment ${paymentId} completed and verified on blockchain.`);
    
    res.json({ success: true, message: 'Payment completed and product delivered.' });

  } catch (error) {
    console.error('[VERCEL API] Failed to complete payment:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to complete payment on Pi Network',
      details: error.response?.data 
    });
  }
});

// Mount the router at /api to match the frontend requests and vercel.json rewrite
app.use('/api', router);

// Fallback for direct matches if Vercel strips prefix (defensive coding)
app.use('/', router);

module.exports = app;
