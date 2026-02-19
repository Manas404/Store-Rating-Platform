const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    addUser, 
    addStore, 
    getUsers, 
    getStores 
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Apply middleware to ALL admin routes:
// 1. Must be logged in (verifyToken)
// 2. Must be an ADMIN (requireRole('ADMIN'))
router.use(verifyToken, requireRole('ADMIN'));

// Admin Endpoints
router.get('/dashboard', getDashboardStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', getUsers);
router.get('/stores', getStores);

module.exports = router;