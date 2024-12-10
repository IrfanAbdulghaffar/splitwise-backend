const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: 'Invalid token or user not found.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticate;
