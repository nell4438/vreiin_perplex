require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Replace 'your_anakin_api_endpoint' with the actual Anakin API endpoint
const ANAKIN_API_ENDPOINT = `https://api.anakin.ai/v1/chatbots/${process.env.APP_ID}/messages`;

app.get('/message', async (req, res) => {
    const { message } = req.body;
    res.send(message)
    try {
        const response = await axios.get(ANAKIN_API_ENDPOINT, {
            app_id: process.env.APP_ID,
            message: message.text,
            access_token: process.env.API_ACCESS_TOKEN
        });

        // Assuming the API returns a 'response' object with a 'text' property
        const botResponse = response.data.response;

        res.json({ text: botResponse });
    } catch (error) {
        console.error('Error calling Anakin API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
