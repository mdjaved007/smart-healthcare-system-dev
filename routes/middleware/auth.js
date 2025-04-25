const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, 'your-jwt-secret'); // Replace with your actual secret key
    req.user = decoded;
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Example protected route (remove or adjust as needed)
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

module.exports = router;
