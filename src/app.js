const express = require("express");
const app = express();
const morgan = require("morgan");

const pastesRouter = require("./pastes/pastes.router");
const usersRouter = require("./users/users.router")
app.use(express.json());
app.use(morgan("dev"));

//----DATA---
const pastes = require("./data/pastes-data");

//-----ROUTE LEVEL MIDDLEWARE-----
app.use("/pastes", pastesRouter);
app.use("/users", usersRouter);

//---NOT FOUND HANDLER---
app.use((req, res, next) => {
  next({ status: 404, message: `Path "${req.originalUrl}" does not exist`});
});

//---ERROR HANDLER---
app.use((err, req, res, next) => {
  const { status = 500, message = "Oh no! Something went wrong!" } = err
  console.error(`Error: ${status}; ${message}`);
  res.status(status).json({error: message});
});

module.exports = app;