//The authorizeRole middleware ensures the user has the correct role before allowing access to the route.
function authorizeRole(requiredRole) {
  return (req, res, next) => {
    const user = req.user; // Assume authentication middleware adds `user` to `req`

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next();
  };
}

module.exports = { authorizeRole };


authorizeRole("admin")