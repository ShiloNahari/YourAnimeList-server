const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const movieSchema = new mongoose.Schema({
    // Define movie schema fields
    posterUrl: String,
    seriesTitle: String,
    releasedYear: Number,
    certificate: String,
    runtime: String,
    genre: String,
    imdbRating: Number,
    overview: String,
    metaScore: Number,
    director: String,
    starFirst: String,
    starSecond: String,
    starThird: String,
    starFourth: String,
    votesCount: Number,
    gross: String,
});

movieSchema.plugin(mongoosePaginate);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;