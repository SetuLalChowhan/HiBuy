const jwt = require('jsonwebtoken');
const AppError = require('../error/AppError.js');
const User = require("../model/user.model.js");
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

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};

module.exports = {
  isAdmin,
};

module.exports = {authenticate,isAdmin};