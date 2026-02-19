const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateSignup } = require('../middlewares/validationMiddleware');

// Public Routes
router.post('/register', validateSignup, registerUser);
router.post('/login', loginUser);

// Protected Route (Any logged-in user can update their password)
router.put('/update-password', verifyToken, updatePassword);

module.exports = router;