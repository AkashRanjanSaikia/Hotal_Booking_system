const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  console.log("Cookies:", req.cookies);
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_key_here");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
