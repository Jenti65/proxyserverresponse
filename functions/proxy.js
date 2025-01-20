const axios = require('axios');
const cors = require('cors');

const corsOptions = {
  origin: '*', // Replace '*' with your Shopify domain for stricter security
  methods: 'POST, OPTIONS',
  allowedHeaders: 'Content-Type',
};

const corsMiddleware = cors(corsOptions);

exports.handler = async (event, context) => {
  // Handle preflight (OPTIONS) request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Replace '*' with your Shopify domain if needed
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: 'OK',
    };
  }

  // Apply CORS headers to the POST request (without using res.setHeader)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*', // Replace '*' with your Shopify domain if needed
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const googleScriptURL = 'https://script.google.com/macros/s/AKfycbx4beY10Ko1d_Qd7R5DM-69Uwq89_v5ZHad9gZwPWArpIujtbFuH0iuKRoqDDz9yyPb/exec';

  try {
    const data = JSON.parse(event.body);

    const response = await axios.post(googleScriptURL, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Replace '*' with your Shopify domain if needed
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true, data: response.data }),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Replace '*' with your Shopify domain if needed
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
