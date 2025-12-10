const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/movie");

//create the Express app
const app = express();

//instruction with the view engine to be used
app.set("view engine", "ejs");

/* MongoDB connection (local) */
const dbURI = "mongodb://127.0.0.1:27017/simple-blog";
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((error) => console.log(error));

//middleware to allow access to static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//route and response
app.get("/", (request, response) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) =>
      response.render("index", { title: "Home", blogs: result })
    )
    .catch((error) => console.log(error));
});

app.get("/create", (request, response) => {
  response.render("create", { title: "Create new blog" });
});

app.get("/:id", (request, response) => {
  const id = request.params.id;
  Blog.findById(id)
    .then((result) =>
      response.render("blog", { blog: result, title: "Single blog details" })
    )
    .catch((error) => console.log(error));
});

app.delete("/:id", (request, response) => {
  const id = request.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      response.json({ redirect: "/" });
    })
    .catch((error) => console.log(error));
});

app.post("/", (request, response) => {
  //retrieve the new blog details
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.redirect("/");
    })
    .catch((error) => console.log(error));
});

app.post("/:id", (request, response) => {
  //retrieve the new blog details
  const blog = new Blog(request.body);
  //parse it into two separate objects: the blog new details and the ID
  const newBlogData = {
    title: blog.title,
    shortDesc: blog.shortDesc,
    body: blog.body,
  };
  const id = { _id: blog.id };

  Blog.findOneAndUpdate(id, newBlogData)
    .then((result) => {
      Blog.findById(id).then((result) =>
        response.render("blog", { blog: result, title: "Single blog details" })
      );
    })
    .catch((error) => console.log(error));
});

//404 page
app.use((request, response) => {
  response.status(404).render("404", { title: "Error" });
});
