import config from 'config';
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from request header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    // Unauthorized status
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
