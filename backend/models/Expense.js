const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');


dotenv.config();

const router = express.Router();

router.post('/generate', async (req, res) => {
  const topic = req.body.topic;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a Hindi financial advisor.' },
          { role: 'user', content: `Create a Hindi financial lesson on "${topic}" with analogies and 3 MCQ quiz questions.` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const lessonText = response.data.choices[0].message.content;
    res.json({ lesson: lessonText });
  } catch (err) {
    console.error("Groq API Error:", err.message);
    res.status(500).json({ error: 'Groq API failed' });
  }
});

module.exports = router;