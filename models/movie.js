const { toInteger } = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  //      "#TITLE": "Halloween",
  //      "#YEAR": 1978,
  //      "#IMDB_ID": "tt0077651",
  //      "#ACTORS": "Donald Pleasence, Jamie Lee Curtis",
  //      "#AKA": "Halloween (1978) ",
  //      "#IMG_POSTER": "https://m.media-amazon.com/images/M/MV5BMzZiNTdiYTgtYjNkMS00MmJmLWEwZGQtNmY0NGJkMGE0YmYzXkEyXkFqcGc@._V1_.jpg",
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

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;

//{
//      "#TITLE": "Halloween",
//      "#YEAR": 1978,
//      "#IMDB_ID": "tt0077651",
//      "#ACTORS": "Donald Pleasence, Jamie Lee Curtis",
//      "#AKA": "Halloween (1978) ",
//      "#IMG_POSTER": "https://m.media-amazon.com/images/M/MV5BMzZiNTdiYTgtYjNkMS00MmJmLWEwZGQtNmY0NGJkMGE0YmYzXkEyXkFqcGc@._V1_.jpg",
//}
