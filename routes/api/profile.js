import config from 'config';
import express from 'express';
import request from 'request';
import { check, validationResult } from 'express-validator';

import User from '../../models/User.js';
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
      profile = await new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    // populate - add to response object user object with name and avatar fields
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (e) {
    console.error(e.message);
    // Id isn't valid
    if (e.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile user and posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });
    //Remove user
    await User.findOneAndRemove({
      _id: req.user.id,
    });

    res.json({ msg: 'User deleted' });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    DELETE api/profile/experience/:id
// @desc     Delete profile experience
// @access   Private
router.delete('/experience/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience = profile.experience.filter(
      ({ id }) => id === req.params.id
    );
    await profile.save();

    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(req.body);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    DELETE api/profile/education/:id
// @desc     Delete profile education
// @access   Private
router.delete('/education/:id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education = profile.education.filter(
      ({ id }) => id === req.params.id
    );
    await profile.save();

    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/profile/github/:userName
// @desc     Get user repose from Github
// @access   Public
router.get('/github/:userName', (req, res) => {
  try {
    const options = {
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
      uri: `https://api.github.com/users/${
        req.params.userName
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

export default router;
