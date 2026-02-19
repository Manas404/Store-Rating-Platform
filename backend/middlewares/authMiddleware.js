const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    console.log("1. verifyToken reached");
    const token = req.headers['authorization'];
    if (!token) {
        console.log("2. No token found");
        return res.status(403).json({ error: "No token provided." });
    }
    console.log("2. Token received:", token.substring(0, 20) + "...");

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized." });
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