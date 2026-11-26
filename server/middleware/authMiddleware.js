// server/middleware/authMiddleware.js
// Checks for an Authorization header, and JWT, verifies token

const jwt = require("jsonwebtoken");

// check whether the request contains a valid JWT
function authenticateToken(req, res, next) {
    // get the token from the HttpOnly cookie
    const token = req.cookies.token;

    // check whether a token was provided
    if (!token) {
        return res.status(401).json({
            message: "Authentication required. Please log in."
        });
    }

    try {
        // verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // make the decoded user information available to the route
        req.user = decoded;

        // tells Express to continue to the next step
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
    });
  }
}

module.exports = authenticateToken;