const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader ||!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided or invalid format" });
  }

  const parts = authHeader.split(' ');
  if (parts.length!== 2) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
