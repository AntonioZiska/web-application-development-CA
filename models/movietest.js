const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  imdbID: {
    type: String,
  },
  actors: {
    type: String,
  },
  aka: {
    type: String,
  },
  imgPoster: {
    type: String,
  },
});

const MovieTest = mongoose.model("movietest", movieSchema);
module.exports = MovieTest;
