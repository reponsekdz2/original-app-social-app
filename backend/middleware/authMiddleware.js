import pool from '../db.js';

const protect = async (req, res, next) => {
  if (req.session.user && req.session.user.id) {
    try {
      // Get user from the session's ID
      const [rows] = await pool.query(
        'SELECT id, username, name, email, avatar_url as avatar, is_premium, is_verified, is_admin, status FROM users WHERE id = ?', 
        [req.session.user.id]
      );
      
      if (rows.length > 0) {
        const user = rows[0];

        // Check user status
        if (user.status === 'banned' || user.status === 'suspended') {
          req.session.destroy(); // Log out the suspended/banned user
          return res.status(403).json({ message: `Your account has been ${user.status}. Please contact support.` });
        }

        req.user = user; // Attach user to the request object
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, user not found' });
      }
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      res.status(401).json({ message: 'Not authorized, server error' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no session' });
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