const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const app = express();
const port = 5050;

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
  const newPath = path.join(__dirname, "/public/index.html");
  res.sendFile(newPath);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
  res.json(db);
});

app.listen(port);
console.log("⚡️ Server started on port", port);
