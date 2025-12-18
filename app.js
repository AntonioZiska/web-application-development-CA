const express = require("express");
const mongoose = require("mongoose");
const Movie = require("./models/movie");
const Collection = require("./models/collection");

const app = express();

app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/media")
  .then(() =>
    app.listen(3000, () => console.log("Server running on port 3000"))
  )
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//col nav
app.use(async (req, res, next) => {
  try {
    res.locals.collections = await Collection.find();
    next();
  } catch (err) {
    next(err);
  }
});

//index show 4
app.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(4);
    res.render("index", { title: "Home", movies });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//full history
app.get("/allmedia", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render("allmedia", { title: "All Media", movies });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//create main
app.get("/create", (req, res) => {
  res.render("create", { title: "Create Movie" });
});

//search
app.post("/create", async (req, res) => {
  const { q } = req.body;
  if (!q) return res.status(400).send("Search query required");

  try {
    const resp = await fetch(
      `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(q)}`
    );
    const data = await resp.json();

    if (!data?.description?.length)
      return res.status(404).send("Movie not found");

    res.render("selectmovie", {
      title: "Select Movie",
      choices: data.description.slice(0, 3),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Search failed");
  }
});

//choose
app.post("/create/choose", async (req, res) => {
  try {
    const movie = JSON.parse(req.body.movieData);

    const newMovie = new Movie({
      title: movie["#TITLE"],
      year: movie["#YEAR"],
      imdbID: movie["#IMDB_ID"],
      actors: movie["#ACTORS"],
      aka: movie["#AKA"],
      imgPoster: movie["#IMG_POSTER"],
    });

    await newMovie.save();
    res.redirect(`/movie/${newMovie._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to save movie");
  }
});

//movie details page
app.get("/movie/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");

    const trailerURL = movie.imdbID
      ? `https://imdb.iamidiotareyoutoo.com/media/${movie.imdbID}`
      : null;

    res.render("movie", {
      title: movie.title,
      movie,
      trailerURL,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//favs movies
app.post("/movie/favourite/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");

    movie.favourite = !movie.favourite;
    await movie.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//fav
app.get("/favourites", async (req, res) => {
  try {
    const movies = await Movie.find({ favourite: true }).sort({ year: 1 });
    res.render("favourites", { title: "Favourites", movies });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//chart
app.get("/api/favourites", async (req, res) => {
  try {
    const movies = await Movie.find({ favourite: true }).select("year");
    res.json(movies);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

//create collection
app.post("/collections", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ error: "Collection name required" });

    const collection = new Collection({ name });
    await collection.save();

    res.json(collection);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create collection" });
  }
});

//collection
app.get("/collections/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate(
      "movies"
    );
    if (!collection) return res.status(404).send("Collection not found");

    res.render("collection", {
      title: collection.name,
      collection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//add to coll
app.post("/collections/:collectionId/add/:movieId", async (req, res) => {
  try {
    const { collectionId, movieId } = req.params;
    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).send("Collection not found");

    if (!collection.movies.includes(movieId)) {
      collection.movies.push(movieId);
      await collection.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// del
app.delete("/movie/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ redirect: "/" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// no page found - 404
app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
