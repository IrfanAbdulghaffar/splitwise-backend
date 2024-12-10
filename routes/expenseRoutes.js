const express = require('express');
const { addExpense, updateExpense } = require('../controllers/expenseController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new expense
router.post('/expense', authenticate, addExpense);

// Update an existing expense
router.put('/expense', authenticate, updateExpense);

module.exports = router;

