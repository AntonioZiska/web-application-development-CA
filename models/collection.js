const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  movies: [
    {
      type: Schema.Types.ObjectId,
      ref: "movie",
    },
  ],
});

const Collection = mongoose.model("Collection", collectionSchema);
module.exports = Collection;
