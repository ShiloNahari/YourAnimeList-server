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
    index:true,
  },
  status: {
    type: String,
    required: true,
    enum: [1, 2, 3, 4, 5],
  },
  episodesSeen:{
    required:true,
    type:Number,
    default:0,
    min:0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default:0,
    required:true,
  },
  title:{type:String, required:true,},
  thumb:{type:String, required:true,},
  type:{type:String,}
});

const AnimeList = mongoose.model('AnimeList', animeListSchema);

module.exports = AnimeList;