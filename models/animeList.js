const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const animeListSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [1, 2, 3, 4, 5],
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  }
});

const AnimeList = mongoose.model('AnimeList', animeListSchema);

module.exports = AnimeList;