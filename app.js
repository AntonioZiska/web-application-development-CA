const express = require("express");
const mongoose = require("mongoose");
const Movie = require("./models/movie");

//create the Express app
const app = express();

//instruction with the view engine to be used
app.set("view engine", "ejs");

/* MongoDB connection */
const uri = "mongodb://127.0.0.1:27017/media";
mongoose
  .connect(uri)
  .then((result) => app.listen(3000))
  .catch((error) => console.log(error));

//middleware to allow access to static files
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

//route and response
app.get("/", (request, response) => {
  Movie.find()
    .sort({ createdAt: -1 })
    .then((result) =>
      response.render("index", {
        title: "Home",
        movies: result,
      })
    )
    .catch((error) => console.log(error));
});

app.get("/create", (request, response) => {
  response.render("create", {
    title: "Create new movie",
  });
});

app.get("/:id", (request, response) => {
  const id = request.params.id;
  Movie.findById(id)
    .then((result) =>
      response.render("movie", {
        movie: result,
        title: "Single movie details",
      })
    )
    .catch((error) => console.log(error));
});

app.delete("/:id", (request, response) => {
  const id = request.params.id;
  Movie.findByIdAndDelete(id)
    .then((result) => {
      response.json({ redirect: "/" });
    })
    .catch((error) => console.log(error));
});

app.post("/", (request, response) => {
  //retrieve the new movie details
  const movie = new Movie(request.body);

  movie
    .save()
    .then((result) => {
      response.redirect("/");
    })
    .catch((error) => console.log(error));
});

app.post("/:id", (request, response) => {
  //retrieve the new movie details
  const movie = new Movie(request.body);
  //parse it into two separate objects: the movie new details and the ID
  const newMovieData = {
    title: movie.title,
    shortDesc: movie.shortDesc,
    body: movie.body,
  };
  const id = { _id: movie.id };

  Movie.findOneAndUpdate(id, newMovieData)
    .then((result) => {
      Movie.findById(id).then((result) =>
        response.render("movie", {
          movie: result,
          title: "Single movie details",
        })
      );
    })
    .catch((error) => console.log(error));
});

//404 page
app.use((request, response) => {
  response.status(404).render("404", { title: "Error" });
});
