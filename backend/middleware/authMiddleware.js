import jwt from 'jsonwebtoken';
import pool from '../db.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token's ID, including admin flag and status
      const [rows] = await pool.query(
        'SELECT id, username, name, email, avatar_url as avatar, is_premium, is_verified, is_admin, status FROM users WHERE id = ?', 
        [decoded.id]
      );
      
      if (rows.length > 0) {
        const user = rows[0];

        // Check user status
        if (user.status === 'banned' || user.status === 'suspended') {
          return res.status(403).json({ message: `Your account has been ${user.status}. Please contact support.` });
        }

        req.user = user; // Attach user to the request object
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, user not found' });
      }
    } catch (error) {
      console.error('JWT Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminProtect = (req, res, next) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, adminProtect };