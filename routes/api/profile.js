import express from 'express';
import { check, validationResult } from 'express-validator';

import auth from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';

const router = express.Router();

// @route    GET api/profile/me
// @desc     Get current user profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    // populate - get fields to profile object from user object
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

const socialFieldsNames = Object.keys(Profile.schema.paths)
  .filter((fieldName) => fieldName.includes('social'))
  .map((fieldName) => fieldName.split('.')[1]);

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Build profile object

    const profileFields = Object.entries(req.body).reduce(
      (fields, [key, value]) => {
        if (key === 'skills') {
          fields.skills = value.split(',').map((skill) => skill.trim());
        } else if (socialFieldsNames.includes(key)) {
          fields.social[key] = value;
        } else {
          fields[key] = value;
        }

        return fields;
      },
      { social: {} }
    );
    profileFields.user = req.user.id;

    try {
      const filter = { user: req.user.id };

      let profile = await Profile.findOne(filter);

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          filter,
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
