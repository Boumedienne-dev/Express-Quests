require("dotenv").config();

const express = require("express");


const app = express();

app.use(express.json()); //add this line

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const movieHandlers = require("./movieHandlers");
const { validateMovie } = require("./validators.js");

const userHandlers = require("./userHandlers");
const { validateUser } = require("./validators.js");

//GET Movies

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

//POST Movies
app.post("/api/movies", movieHandlers.postMovie);

//POST ValidateMovie
app.post("/api/movies", validateMovie, movieHandlers.postMovie);

//PUT Movies
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/movies/:id",validateMovie, movieHandlers.updateMovie);

//DELETE Movies
app.delete("/api/movies/:id", movieHandlers.deleteMovie);


//GET Users
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);


//POST validateUser
app.post("/api/users", validateUser, userHandlers.postUser)
app.post("/api/users", validateUser, userHandlers.postUser);


//POST Users
app.post("/api/users", userHandlers.postUser);

//PUT Users
app.put("/api/users/:id", userHandlers.updateUser);
app.put("/api/users/:id",validateUser, userHandlers.updateUser); //...

//DELETE Users
app.delete("/api/users/:id", userHandlers.deleteUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
