const express = require("express");
const mongoose = require("mongoose");
const MovieTest = require("./models/movietest");

const app = express();

// Set view engine
app.set("view engine", "ejs");

// Connect to MongoDB
const uri = "mongodb://127.0.0.1:27017/media";
mongoose
  .connect(uri)
  .then(() =>
    app.listen(3000, () => console.log("Server running on port 3000"))
  )
  .catch((error) => console.log(error));

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Home page: list all movies
app.get("/", async (req, res) => {
  try {
    const movies = await MovieTest.find().sort({ createdAt: -1 });

    // Fetch posters from FM-DB API
    const moviesWithPosters = await Promise.all(
      movies.map(async (movie) => {
        let posterURL = null;

        if (movie.imdbID) {
          try {
            const posterResp = await fetch(
              `https://imdb.iamidiotareyoutoo.com/photo/${movie.imdbID}?w=200&h=300`
            );
            const posterData = await posterResp.json();
            posterURL = posterData.url || null;
          } catch (err) {
            console.log("Failed to fetch poster:", err);
          }
        }

        return { ...movie.toObject(), posterURL };
      })
    );

    res.render("indextest", { title: "Home", movies: moviesWithPosters });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// Createtest page
app.get("/createtest", (req, res) => {
  res.render("createtest", { title: "Create new movie" });
});

// Createtest movie from FM-DB search
app.post("/createtest", async (req, res) => {
  const { q } = req.body;

  if (!q) return res.status(400).send("Search query required");

  try {
    const resp = await fetch(
      `https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(q)}`
    );
    const data = await resp.json();

    if (!data || !data.description || data.description.length === 0)
      return res.status(404).send("Movie not found");

    const movie = data.description[0];

    const movieData = {
      title: movie["#TITLE"] || "",
      year: movie["#YEAR"] || null,
      imdbID: movie["#IMDB_ID"] || "",
      actors: movie["#ACTORS"] || "",
      aka: movie["#AKA"] || "",
      imgPoster: movie["#IMG_POSTER"] || "",
    };

    const newMovie = new MovieTest(movieData);
    await newMovie.save();

    res.redirect(`/movietest/${newMovie._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to create movie: " + err.message);
  }
});

// Single movie page
app.get("/movietest/:id", async (req, res) => {
  try {
    const movie = await MovieTest.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");

    // Trailer URL — direct media URL, no JSON parsing
    const trailerURL = movie.imdbID
      ? `https://imdb.iamidiotareyoutoo.com/media/${movie.imdbID}`
      : null;

    res.render("movietest", { title: movie.title, movie, trailerURL });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// Delete a movie
app.delete("/movietest/:id", async (req, res) => {
  try {
    await MovieTest.findByIdAndDelete(req.params.id);
    res.json({ redirect: "/" });
  } catch (err) {
    console.log(err);
  }
});

// Update a movie
app.post("/movietest/:id", async (req, res) => {
  const id = req.body.id;
  const updatedData = {
    title: req.body.title,
    year: req.body.year,
    imdbID: req.body.imdbID,
    actors: req.body.actors,
    aka: req.body.aka,
    imgPoster: req.body.imgPoster,
  };

  try {
    await MovieTest.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect(`/movietest/${id}`);
  } catch (err) {
    console.log(err);
  }
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "Error" });
});
