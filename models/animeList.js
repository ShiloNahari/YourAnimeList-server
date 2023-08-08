const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const animeListSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: ObjectId,
    ref: 'Anime',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['watching','completed','on hold', 'plan to watch', 'dropped'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  }
});

const MovieList = mongoose.model('MovieList', animeListSchema);

module.exports = MovieList;