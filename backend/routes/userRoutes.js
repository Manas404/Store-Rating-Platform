const express = require('express');
const router = express.Router();
const { getStoresForUser, submitRating } = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Apply middleware: Must be logged in and must be a NORMAL USER
router.use(verifyToken, requireRole('USER'));

router.get('/stores', getStoresForUser);
router.post('/ratings', submitRating);

module.exports = router;