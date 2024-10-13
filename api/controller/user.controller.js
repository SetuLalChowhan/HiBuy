const User = require("../model/user.model.js");
const AppError = require("../error/AppError.js");

// Admin: Update user role
const updateUserRole = async (req, res, next) => {
  const { userId, isAdmin } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${isAdmin ? "Admin" : "User"}`,
    });
  } catch (error) {
    next(new AppError("Server error", 500));
  }
};

// Admin: Delete a user
const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(new AppError("Server error", 500));
  }
};


const getAllUsers = async (req, res, next) => {
    try {
      // Extract query parameters: search query, pagination (page, limit)
      const { query } = req.query; // Search query (name or email)
      const startIndex= parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip =startIndex
  
      // Build the search/filter query
      let searchQuery = {};
      if (query) {
        searchQuery = {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        };
      }
  
      // Get total number of users (with search filter if query is present)
      const totalUsers = await User.countDocuments(searchQuery);
      const total = await User.countDocuments();
  
      // Fetch users with pagination and optional filtering based on the query
      const users = await User.find(searchQuery).skip(skip).limit(limit);
  
      // Handle case where no users are found
      if (!users.length) {
        return next(new AppError('No users found', 404));
      }
  
      // Remove passwords from the response
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      // Send back the paginated and filtered results
      res.status(200).json({
        success: true,
        totalUsers, 
        total,
        users: usersWithoutPassword, // Users data (without passwords)
      });
    } catch (error) {
      console.log(error);
      next(new AppError('Server error', 500));
    }
  };
  
module.exports = {
  updateUserRole,
  deleteUser,
  getAllUsers,
};
