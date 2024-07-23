require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// No need for app.use(express.json()); since we're not expecting JSON in the body

// Adjusted API endpoint to reflect the correct usage pattern
const ANAKIN_API_ENDPOINT = `https://api.anakin.ai/v1/chatbots/${process.env.APP_ID}/messages`;

app.get('/message', async (req, res) => {
    // Extract 'text' from query parameters, not body
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: 'Missing "text" query parameter.' });
    }

    try {
        // Assuming the Anakin API expects a GET request with query parameters
        // Note: This part of the code needs adjustment based on the actual API documentation
        const response = await axios.get(ANAKIN_API_ENDPOINT, {
            params: {
                app_id: 28737,
                message: text,
                access_token: APS-sMS1h8HmNiJRG44lJJzLYvHWEY9CrkCj
            }
        });

        // Assuming the API returns a 'response' object with a 'text' property
        const botResponse = response.data || 'Sorry, I did not receive a valid response from the Anakin API.';

        res.json({ text: botResponse });
    } catch (error) {
        console.error('Error calling Anakin API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
