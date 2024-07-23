require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ANAKIN_API_ENDPOINT = `https://api.anakin.ai/v1/chatbots/${process.env.APP_ID}/messages`;

app.post('/message', async (req, res) => {
    console.log(req.body);

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

        const eventData = response.data;

        const events = eventData.split('\n');

        const messageEvents = events.filter(line => line.startsWith('event: thread.message.delta').map(line => {
            const jsonPart = line.split('data: ')[1];
            try {
                const { content } = JSON.parse(jsonPart);
                return content;
            } catch (e) {
                console.error('Error parsing event:', e);
                return '';
            }
        }));

        const totalResponse = messageEvents.join('');

        res.json({ text: totalResponse });
    } catch (error) {
        console.error('Error calling Anakin API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
