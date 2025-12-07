// src/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.substring(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, role, email }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function authorize(roles = []) {
    return (req, res, next) => {
        if (!roles.length) return next();
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };
