const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const commentSchema = new mongoose.Schema({
  user: {
    type: {
      id: String,
      userName: String,
      role: String,
      profilePicture: String
    },
    ref: 'User',
    required: true,
  },
  animeId: {
    type: Number,
    required: true,
    index: true,
  },
  time: {
    type: Date,
    required: true,
    default: new Date()
  },
  comment: {
    type: String,
    required: true,
  }
});

const Comments = mongoose.model('comments', commentSchema);

module.exports = Comments;