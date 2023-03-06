import jwt from 'jsonwebtoken';
import config from 'config';

import { composeError } from '../helpers.js';

const auth = (req, res, next) => {
  // Get token from request header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    // Unauthorized status
    return res.status(401).json(composeError('No token, authorization denied'));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;

    next();
  } catch (e) {
    res.status(401).json(composeError('Token is not valid'));
  }
};

export default auth;
