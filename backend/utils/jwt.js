const jwt = require('jsonwebtoken');
require('dotenv').config()

// Create JWT token
const generateAccessToken = (username) => {
  const payload = {         // Subject (unique identifier)
    username: username      // Optional - add other non-sensitive fields
  };

  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secret);
  return token;
}

const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    // Verify and decode token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    

    // Attach decoded user data to request object
    req.user = {
      userid: payload.username,
    };

    

    next(); // Proceed to the route handler
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = {
    generateAccessToken,
    authenticateToken
}
