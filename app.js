require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json()); //add this line

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

// express 08 //
const isItDwight = (req, res) => {
  if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};


const userHandlers = require("./userHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth"); //express07 et 08 //
// const userHandler = require("./userHandlers"); // express 08 //
const movieHandlers = require("./movieHandlers");

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.post("/api/login", userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
); // express 08 //

app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line

app.post("/api/users", hashPassword, userHandlers.postUser); // express 07 //
app.put("/api/users/:id", userHandlers.updateUser);
app.delete("/api/:id", userHandlers.deleteUser);

app.post("/api/movies", verifyToken, movieHandlers.postMovie);
app.post("/api/movies", verifyToken, movieHandlers.postMovie); //express 08 //
app.put("/api/movies/:id", verifyToken, movieHandlers.updateMovie);
app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);

// app.post("/api/users", userHandlers.postUser);







app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
