const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const googleScriptURL =
    'https://script.google.com/macros/s/AKfycbx4beY10Ko1d_Qd7R5DM-69Uwq89_v5ZHad9gZwPWArpIujtbFuH0iuKRoqDDz9yyPb/exec';

  try {
    // Ensure the body exists
    if (!event.body) {
      throw new Error('No request body received');
    }

    // Parse the incoming request body
    const data = JSON.parse(event.body);
    console.log('Received data:', data);

    // Forward the request to Google Apps Script
    const response = await axios.post(googleScriptURL, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Google Apps Script response:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error:', error.message);

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data || null,
      }),
    };
  }
};
