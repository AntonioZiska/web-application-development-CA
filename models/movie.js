const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
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
    favourite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("movie", movieSchema);
module.exports = Movie;
