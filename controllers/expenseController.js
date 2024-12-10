const Expense = require('../models/Expense');
const User = require('../models/User');

// Add a new expense
const addExpense = async (req, res) => {
    const { payeeEmail, amount, description } = req.body;

    if (!payeeEmail || !amount) {
        return res.status(400).json({ message: 'Payee email and amount are required.' });
    }

    try {
        const payer = await User.findById(req.user.id);
        const payee = await User.findOne({ email: payeeEmail });

        if (!payer || !payee) {
            return res.status(404).json({ message: 'User(s) not found.' });
        }

        const expense = new Expense({
            payer: payer._id,
            payee: payee._id,
            amount,
            description,
        });

        await expense.save();

        res.status(201).json({ message: 'Expense added successfully.', expense });
    } catch (error) {
        console.error('Error in addExpense API:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Update an existing expense
const updateExpense = async (req, res) => {
    const { expenseId, amount, description } = req.body;

    if (!expenseId || !amount) {
        return res.status(400).json({ message: 'Expense ID and amount are required.' });
    }

    try {
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        // Only allow payer to update the expense
        if (expense.payer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this expense.' });
        }

        expense.amount = amount;
        expense.description = description || expense.description;

        await expense.save();

        res.status(200).json({ message: 'Expense updated successfully.', expense });
    } catch (error) {
        console.error('Error in updateExpense API:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { addExpense, updateExpense };