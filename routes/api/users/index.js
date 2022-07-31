import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { validationResult } from 'express-validator';
import config from 'config';

import User from '../../../models/User.js';

import { validator } from './config.js';

const router = express.Router();

// @route    POST api/users
// @desc     Register user / sing up user and return token
// @access   Public
router.post('/', validator, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Bad request
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // return if not last res.send
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
});

export default router;
