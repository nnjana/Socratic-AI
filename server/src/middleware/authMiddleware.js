// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Look for the token in the headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ error: "Access denied. No JWT provided." });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded student data (which includes the UUID) to the request
        req.user = decoded; 
        next(); // Proceed to the next step
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};