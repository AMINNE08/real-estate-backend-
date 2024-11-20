const User = require("../models/User"); // Import the User model

// Middleware to authorize roles based on user ID
function authorizeRole(requiredRole) {
  return async (req, res, next) => {
    const userId = req.user?.id; // Assuming req.user contains decoded JWT with user ID

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Fetch user from the database
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user's role matches the required role
      if (user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next(); // User has the required role, proceed
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = { authorizeRole };
