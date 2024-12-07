const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) => {
  const token = req.cookies?.token || (req.headers['authorization']?.split(' ')[1]);
  console.log("Token from cookies:", req.cookies?.token); // Debug log
  console.log("Token from Authorization header:", req.headers['authorization']); // Debug log 

  if (!token) {
    console.log("Token is missing.");
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log decoded token    // Verify the token
    req.user = decoded; // Attach user data to req.user
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Token verification error:", err.message); // Log error
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    }
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = { authenticate };
