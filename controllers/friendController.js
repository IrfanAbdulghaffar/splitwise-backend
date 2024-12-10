const User = require('../models/User');
const Expense = require('../models/Expense');

const addFriend = async (req, res) => {
    const { friendEmail } = req.body;

    // Validate request body
    if (!friendEmail) {
        return res.status(400).json({ message: 'Friend email is required.' });
    }

    try {
        // Retrieve the logged-in user using the ID from req.user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Logged-in user not found.' });
        }

        // Retrieve the friend by their email
        const friend = await User.findOne({ email: friendEmail });

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found.' });
        }

        // Check if the friend is already in the user's friend list
        const isAlreadyFriend = user.friends.some(
            (friendId) => friendId.toString() === friend._id.toString()
        );

        if (isAlreadyFriend) {
            return res.status(400).json({ message: 'This user is already your friend.' });
        }

        // Add each user to the other's friend list
        user.friends.push(friend._id);
        friend.friends.push(user._id);

        // Save changes to both users
        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend added successfully.' });
    } catch (error) {
        console.error('Error in addFriend API:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



const listFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends');
        const friendsWithExpenses = [];

        for (let friend of user.friends) {
            let totalOwes = 0;
            let totalOwed = 0;

            const expenses = await Expense.find({
                $or: [{ createdBy: req.user.id, friends: friend._id }, { createdBy: friend._id, friends: req.user.id }]
            });

            expenses.forEach(expense => {
                if (expense.createdBy.toString() === req.user.id.toString()) {
                    totalOwes += expense.amount;
                } else {
                    totalOwed += expense.amount;
                }
            });

            friendsWithExpenses.push({
                name: friend.name,
                email: friend.email,
                totalOwed,
                totalOwes
            });
        }
        const temp = {
            "list":friendsWithExpenses
        }

        res.status(200).json(temp);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addFriend, listFriends };
