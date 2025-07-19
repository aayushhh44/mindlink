const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kdsnkjn@434jnfkdsap');
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Invalid token:', token, err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin role check middleware
module.exports.isAdmin = function (req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
}; 