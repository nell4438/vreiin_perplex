require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable parsing of JSON bodies
app.use(express.json());

// Updated API endpoint to reflect the correct usage pattern
const ANAKIN_API_ENDPOINT = `https://api.anakin.ai/v1/chatbots/${process.env.APP_ID}/messages`;

app.post('/message', async (req, res) => {
    // Extract 'text' from the request body
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Missing "content" in request body.' });
    }

    try {
        const payload = {
            content: content,
            stream: true
        };

        const response = await axios.post(ANAKIN_API_ENDPOINT, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.API_ACCESS_TOKEN}`,
                'X-Anakin-Api-Version': '2024-05-06',
                'Content-Type': 'application/json'
            }
        });

        // Handle the response according to your needs
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
