const db = require('../config/db');

// @desc    Get Store Owner Dashboard (Average rating & list of raters)
// @route   GET /api/owner/dashboard
const getOwnerDashboard = async (req, res) => {
    const ownerId = req.userId; // Logged in Store Owner's ID

    try {
        // 1. Find the store owned by this user
        const [stores] = await db.query('SELECT id, name FROM stores WHERE owner_id = ?', [ownerId]);
        
        if (stores.length === 0) {
            return res.status(404).json({ error: 'No store found for this owner.' });
        }
        
        const storeId = stores[0].id;
        const storeName = stores[0].name;

        // 2. Calculate the average rating for this specific store
        const [avgResult] = await db.query(
            'SELECT COALESCE(AVG(rating), 0) AS averageRating FROM ratings WHERE store_id = ?', 
            [storeId]
        );
        const averageRating = avgResult[0].averageRating;

        // 3. Get the list of users who submitted ratings for this store
        const [raters] = await db.query(`
            SELECT u.name, u.email, r.rating, r.updated_at
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.updated_at DESC
        `, [storeId]);

        res.status(200).json({
            storeName,
            averageRating,
            totalRatings: raters.length,
            raters
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch owner dashboard.' });
    }
};

module.exports = {
    getOwnerDashboard
};