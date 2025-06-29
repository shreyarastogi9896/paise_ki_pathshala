const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// POST /api/expenses
router.post('/', async (req, res) => {
  const { amount, category, date } = req.body;

  try {
    const expense = new Expense({ amount, category, date });
    await expense.save();
    res.status(201).json({ success: true, expense });
  } catch (err) {
    console.error("❌ Error saving expense:", err.message);
    res.status(500).json({ success: false, error: "Failed to save expense" });
  }
});

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Failed to fetch expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

module.exports = router;
