import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new mongoose.Schema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
      },
    },
  ],
  comments: [
    {
      user: {
        ref: 'users',
        type: Schema.Types.ObjectId,
      },
      text: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('post', PostSchema);

export default Post;
