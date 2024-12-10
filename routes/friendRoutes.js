const express = require('express');
const router = express.Router();
const { addFriend, listFriends } = require('../controllers/friendController');
const authenticate = require('../middleware/authMiddleware');

router.post('/add', authenticate,addFriend);  // Add a friend
router.get('/list', authenticate,listFriends);  // List friends and expenses

module.exports = router;