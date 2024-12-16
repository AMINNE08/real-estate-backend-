function authorizeRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized: User data is missing in request" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: `Forbidden: Requires one of the following roles: ${allowedRoles.join(", ")}` });
      }

      next(); 
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error during role authorization" });
    }
  };
}
module.exports = { authorizeRole };