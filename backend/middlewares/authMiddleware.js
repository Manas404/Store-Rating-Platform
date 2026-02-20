const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    // console.log("1. verifyToken reached");
    const authHeader = req.headers['authorization']; // Standardized variable name
    
    // Check if token exists and follows the 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log("2. No token or invalid format");
        return res.status(403).json({ error: "Forbidden: No token provided or malformed." });
    }
    
    const token = authHeader.split(' ')[1];
    // console.log("2. Token received:", token.substring(0, 20) + "...");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.userRole !== role) {
            return res.status(403).json({ error: "Forbidden: Insufficient privileges." });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };