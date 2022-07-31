import config from 'config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

import User from '../../models/User.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

// @route    GET api/auth
// @desc     Get authed user
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    // Finding user in db by id that we pass in auth middleware, then remove password field from user object
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth
// @desc     Login user
// @access   Public
router.post(
  '/',
  check('email', 'Include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Bad request
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        // return if not last res.send
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Compare plain text pass from req and bcrypted pass from db
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (e) {
      console.error(e.message);
      return res.status(500).send('Server error');
    }
  }
);

export default router;
