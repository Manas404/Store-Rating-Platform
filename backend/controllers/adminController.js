const bcrypt = require('bcrypt');
const db = require('../config/db');

// @desc    Get Dashboard Statistics
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const [stores] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
        const [ratings] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');

        res.status(200).json({
            totalUsers: users[0].totalUsers,
            totalStores: stores[0].totalStores,
            totalRatings: ratings[0].totalRatings
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics.' });
    }
};

// @desc    Add a new user (Admin or Normal)
// @route   POST /api/admin/users
const addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ error: 'Email already exists.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ensure only valid roles are assigned
        const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

        await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, userRole]
        );

        res.status(201).json({ message: `${userRole} created successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user.' });
    }
};

// @desc    Add a new store
// @route   POST /api/admin/stores
const addStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
        // First, check if the owner exists
        const [owners] = await db.query('SELECT id, role FROM users WHERE id = ?', [owner_id]);
        if (owners.length === 0) return res.status(404).json({ error: 'Owner user not found.' });

        // If the assigned owner is currently a 'USER', upgrade them to 'STORE_OWNER'
        if (owners[0].role === 'USER') {
            await db.query('UPDATE users SET role = "STORE_OWNER" WHERE id = ?', [owner_id]);
        }

        await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id]
        );

        res.status(201).json({ message: 'Store created successfully.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Store email already exists.' });
        }
        res.status(500).json({ error: 'Failed to add store.' });
    }
};

// @desc    Get all users with filtering and sorting
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    const { search, role, sortBy = 'name', order = 'ASC' } = req.query;
    
    // Build query dynamically based on filters
    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const queryParams = [];

    if (search) {
        query += ' AND (name LIKE ? OR email LIKE ? OR address LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (role) {
        query += ' AND role = ?';
        queryParams.push(role);
    }

    // Protect against SQL injection on ORDER BY clause
    const validSortFields = ['name', 'email', 'role'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${safeSortBy} ${safeOrder}`;

    try {
        const [users] = await db.query(query, queryParams);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

// @desc    Get all stores with average ratings, filtering, and sorting
// @route   GET /api/admin/stores
const getStores = async (req, res) => {
    const { search, sortBy = 'name', order = 'ASC' } = req.query;

    let query = `
        SELECT s.id, s.name, s.email, s.address, 
               COALESCE(AVG(r.rating), 0) as averageRating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
        query += ' AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' GROUP BY s.id';

    const validSortFields = ['name', 'email', 'averageRating'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${safeSortBy} ${safeOrder}`;

    try {
        const [stores] = await db.query(query, queryParams);
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stores.' });
    }
};

module.exports = {
    getDashboardStats,
    addUser,
    addStore,
    getUsers,
    getStores
};