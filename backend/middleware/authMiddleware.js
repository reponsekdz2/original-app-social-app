export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized: You must be logged in to access this resource.' });
  }
};
