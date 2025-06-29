console.log("✅ ocr.js route file is loaded");
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/ocr-analyze', upload.single('file'), async (req, res) => {
  console.log("✅ OCR route HIT!");
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, req.file.originalname);

    const response = await axios.post('http://ocr_explain_service:8004/analyze', form, {
      headers: form.getHeaders()
    });

    res.json(response.data);
  } catch (error) {
    console.error('OCR Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze document.' });
  }
});

module.exports = router;
