const express = require("express");
const uniqid = require("uniqid");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const app = express();
const port = 5050;

app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const newPath = path.join(__dirname, "/public/index.html");
  res.sendFile(newPath);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  console.log("GETTING NOTES");
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    console.log("GETTING - COMPLETED");
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  console.log("POSTING NOTE");
  let dataArray = [];
  if (db && db.length > 0) {
    dataArray = [...db];
  }

  const note = { ...req.body, id: uniqid() };

  dataArray.push(note);

  fs.writeFile("./db/db.json", JSON.stringify(dataArray), (err) => {
    if (err) throw err;
  });

  res.json(dataArray);
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETING NOTE");
  if (req.params.id) {
    let newArray = db.filter((note) => note.id !== req.params.id);
    fs.writeFile("./db/db.json", JSON.stringify(newArray), (err) => {
      if (err) throw err;
      console.log("COMPLETED");
      res.json(newArray);
    });
    console.log("COMPLETED?");
  }
});

app.listen(port);
console.log("⚡️ Server started on port", port);
