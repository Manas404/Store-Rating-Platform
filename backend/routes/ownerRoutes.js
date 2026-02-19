const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/storeController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Apply middleware: Must be logged in and must be a STORE OWNER
router.use(verifyToken, requireRole('STORE_OWNER'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;