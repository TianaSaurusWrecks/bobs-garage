// server/middleware/adminMiddleware.js

// check whether the authenticated user has admin privileges
const requireAdmin = (req, res, next) => {

    // check whether the user's role is admin
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required."
        });
    }

    // allow the request to continue
    next();
};

module.exports = requireAdmin;