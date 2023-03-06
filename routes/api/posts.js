import express from 'express';
import { check, validationResult } from 'express-validator';

import Post from '../../models/Post.js';
import User from '../../models/User.js';
import auth from '../../middleware/auth.js';
import { composeError } from '../../helpers.js';

const router = express.Router();

// @route    GET api/posts
// @desc     Get posts
// @access   Private
router.get('/', auth, async (req, res, next) => {
  try {
    // .sort({ date: -1 }) - newest first
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (e) {
    next(e);
  }
});

// @route    GET api/posts
// @desc     Get post by id
// @access   Private
router.get('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json(composeError('Post not found'));
    }

    res.json(post);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(400).json(composeError('Post not found'));
    }
    next(e);
  }
});

// @route    POST api/posts
// @desc     Create post
// @access   Private
router.post(
  '/',
  [auth, [check('text').not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(composeError(errors.array()));
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = {
        name: user.name,
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
      };

      const post = await new Post(newPost);
      await post.save();

      res.json(post);
    } catch (e) {
      next(e);
    }
  }
);

// @route    DELETE api/posts
// @desc     Delete post
// @access   Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json(composeError('Post not found'));
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json(composeError('User not authorised'));
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(400).json(composeError('Post not found'));
    }
    next(e);
  }
});

// @route    POST api/posts/like/:id
// @desc     Update post likes
// @access   Private
router.put('/like/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json(composeError('Post not found'));
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json(composeError('User not authorised'));
    }

    // Check if post already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json(composeError('Post already liked'));
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(400).json(composeError('Post not found'));
    }
    next(e);
  }
});

// @route    POST api/posts/unlike/:id
// @desc     Unlike post
// @access   Private
router.put('/unlike/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json(composeError('Post not found'));
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json(composeError('User not authorised'));
    }

    // Check if post already been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json(composeError('Post has not been liked yet'));
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    await post.save();
    res.json(post.likes);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' });
    }
    next(e);
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on post
// @access   Private
router.post(
  '/comment/:id',
  [auth, [check('text').not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(composeError(errors.array()));
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        name: user.name,
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (e) {
      next(e);
    }
  }
);

// @route    DELETE api/posts/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const commentIndex = post.comments.findIndex(
      ({ id }) => id.toString() === req.params.comment_id
    );

    if (commentIndex === -1) {
      return res.status(404).json(composeError('Comment not found'));
    }

    // Check user
    if (post.comments[commentIndex].user.toString() !== req.user.id) {
      return res.status(401).json(composeError('User not authorised'));
    }

    post.comments.splice(commentIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (e) {
    next(e);
  }
});

export default router;
