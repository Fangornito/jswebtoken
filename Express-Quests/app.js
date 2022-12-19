require("dotenv").config();
const express = require("express");
const database = require("./database");
const app = express();
app.use(express.json());
const port = process.env.APP_PORT;
const welcome = (req, res) => {
  res.send("Welcome to my favourite users list");
};
const userHandlers = require("./userHandlers");

const { hashPassword, verifyPassword, verifyToken  } = require("./auth");

app.get("/", welcome);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, userHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

app.use(verifyToken);

app.delete("/api/users/:id", userHandlers.deleteUser)
app.put("/api/users/:id", userHandlers.updateUser)

