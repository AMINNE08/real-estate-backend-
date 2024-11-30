const User = require("../models/User");

function authorizeRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id; // User ID from the JWT payload

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next(); // User has sufficient role, proceed
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = { authorizeRole };
