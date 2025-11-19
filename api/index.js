
require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
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

  console.log(`[API] Processing approval for paymentId: ${paymentId}`);

  // CRITICAL CHANGE: Fail if no API key is present. Do not fake success.
  if (!PI_API_KEY) {
    console.error('[API] Error: PI_API_KEY is missing in Netlify Environment Variables.');
    return res.status(500).json({ 
      error: 'Server Configuration Error: PI_API_KEY is missing. Please add it in Netlify Site Settings.' 
    });
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

    console.log(`[API] Payment ${paymentId} approved successfully.`);
    res.json({ success: true, message: 'Payment approved for processing.' });

  } catch (error) {
    console.error('[API] Failed to approve payment:', error.response?.data || error.message);
    // Return the specific error from Pi Network to the frontend
    res.status(500).json({ 
      error: 'Pi Network Approval Failed',
      details: error.response?.data || error.message
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
  
  console.log(`[API] Completing paymentId: ${paymentId} with txid: ${txid}`);

  if (!PI_API_KEY) {
    console.error('[API] Error: PI_API_KEY is missing.');
     return res.status(500).json({ 
       error: 'Server Configuration Error: PI_API_KEY is missing. Please add it in Netlify Site Settings.' 
     });
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

    console.log(`[API] Payment ${paymentId} completed and verified on blockchain.`);
    
    res.json({ success: true, message: 'Payment completed and product delivered.' });

  } catch (error) {
    console.error('[API] Failed to complete payment:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Pi Network Completion Failed',
      details: error.response?.data || error.message
    });
  }
});

// Mount the router to handle both /api prefix (from frontend) and root (from redirects)
app.use('/api', router);
app.use('/', router);

// Export the handler for Netlify Functions
module.exports.handler = serverless(app);
