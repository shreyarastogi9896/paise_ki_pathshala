const express = require("express");
const router = express.Router();
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

router.post("/stt", upload.single("audio"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const form = new FormData();
    form.append("audio", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://whisper_stt_service:8001/speech-to-text",
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(filePath); // Cleanup
    res.json({ text: response.data.text });
  } catch (err) {
    res.status(500).json({ error: "Whisper STT failed" });
  }
});

module.exports = router;
