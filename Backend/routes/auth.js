const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate.middleware.js');

router.post('/register', register);
router.post('/login', login);


// secured routes
router.post('/logout', authenticate, logout);

module.exports = router; 