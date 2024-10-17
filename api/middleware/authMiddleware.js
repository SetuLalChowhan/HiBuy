const jwt = require('jsonwebtoken');
const AppError = require('../error/AppError.js');
const User = require("../model/user.model.js");

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
 

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new AppError('Token is not valid', 401));
        }
        req.user = decoded; // Attach the user payload to the request

        next(); // Call the next middleware
    });
}

// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(new AppError("Unauthorized access", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isAdmin) {
            return next(new AppError("Admin privileges required", 403));
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        return next(new AppError("Invalid token", 401));
    }
};

// Middleware to allow either authenticated user or admin
const authOrAdmin = async (req, res, next) => {
    try {
        // Attempt to authenticate the user
        await authenticate(req, res, async (err) => {
            if (err) {
                // If authentication fails, check if user is an admin
                await isAdmin(req, res, next);
            } else {
                // If authenticated successfully, proceed to the next middleware
                return next();
            }
        });
    } catch (error) {
        return next(new AppError("Authorization failed", 401));
    }
};

module.exports = {
    authenticate,
    isAdmin,
    authOrAdmin // Export the new middleware
};
