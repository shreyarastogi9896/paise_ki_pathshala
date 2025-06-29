const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const sttRoute = require('./routes/stt');
const lessonRoute=require('./routes/lesson');
const parseRoute = require('./routes/parser');
const app = express();
const expenseRoutes = require('./routes/expense');
const connectDB = require('./db/mongo');
const ocrRoutes = require('./routes/ocr');
connectDB();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use('/api/expenses', expenseRoutes);
app.use(bodyParser.json());
app.use('/api', sttRoute);
app.use('/api', parseRoute);
app.use('/api', lessonRoute);
app.use('/api', ocrRoutes);


app.post('/api/sms-check', async (req, res) => {
    const message = req.body.message;
    try {
        const response = await fetch('http://scam_sms_service:8000/detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Microservice error' });
    }
});
app.listen(5000, () => {
  console.log('Backend running on port 5000');
});









