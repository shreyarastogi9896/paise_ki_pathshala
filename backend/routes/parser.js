const express = require('express');
const axios = require('axios');
const router = express.Router();


// POST /parse-text
router.post('/parse-text', async (req, res) => {
  const { text: sentence } = req.body; 

  if (!sentence || sentence.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await axios.post('http://parse_text_service:8003/parse', { sentence });
    res.json(response.data);  // send parsed result back to frontend
  } catch (error) {
    console.error("Error contacting parser service:", error.message);
    res.status(500).json({ error: "Parser service failed" });
  }
});

module.exports = router;
