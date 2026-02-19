const db = require('../config/db');

// @desc    Get all stores (with searching and user's specific rating)
// @route   GET /api/user/stores
const getStoresForUser = async (req, res) => {
    const { search, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.userId; // From auth middleware

    // We join the ratings table twice: once for the overall average, 
    // and once specifically for the logged-in user's rating.
    let query = `
        SELECT 
            s.id, 
            s.name, 
            s.address, 
            COALESCE(AVG(all_r.rating), 0) AS overallRating,
            user_r.rating AS myRating
        FROM stores s
        LEFT JOIN ratings all_r ON s.id = all_r.store_id
        LEFT JOIN ratings user_r ON s.id = user_r.store_id AND user_r.user_id = ?
        WHERE 1=1
    `;
    const queryParams = [userId];

    if (search) {
        query += ' AND (s.name LIKE ? OR s.address LIKE ?)';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm);
    }

    query += ' GROUP BY s.id, user_r.rating';

    const validSortFields = ['name', 'overallRating'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'name';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${safeSortBy} ${safeOrder}`;

    try {
        const [stores] = await db.query(query, queryParams);
        res.status(200).json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stores.' });
    }
};

// @desc    Submit or modify a rating for a store
// @route   POST /api/user/ratings
const submitRating = async (req, res) => {
    const { store_id, rating } = req.body;
    const userId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    try {
        // This query inserts a new rating. If a rating for this user_id and store_id 
        // already exists (due to the UNIQUE constraint we set in the DB schema), 
        // it simply updates the existing rating instead of crashing.
        const query = `
            INSERT INTO ratings (user_id, store_id, rating) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating)
        `;
        
        await db.query(query, [userId, store_id, rating]);
        
        res.status(200).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit rating.' });
    }
};

module.exports = {
    getStoresForUser,
    submitRating
};