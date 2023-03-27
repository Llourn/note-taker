const express = require("express");
const uniqid = require("uniqid");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 5050;

app.use(express.json());

app.use(express.static(__dirname + "/public"));

// serves the main html page
app.get("/", (req, res) => {
  const newPath = path.join(__dirname, "/public/index.html");
  res.sendFile(newPath);
});

// serves the notes html page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// returns all notes as an array
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      res.json("There was an error reading the database.");
      throw err;
    }
    res.json(JSON.parse(data));
  });
});

// adds note the database with a unique id.
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      res.json({
        message: "There was an error reading from database.",
        error: err,
      });
    }
    let currentData = JSON.parse(data);
    let newData = [...currentData];

    const note = { ...req.body, id: uniqid() };

    newData.push(note);

    fs.writeFile("./db/db.json", JSON.stringify(newData), (err) => {
      if (err) {
        res.json({
          message: "There was an error writing to the database.",
          error: err,
        });
      }
    });
    res.json(newData);
  });
});

// delete notes from the database using the id
app.delete("/api/notes/:id", (req, res) => {
  if (req.params.id) {
    fs.readFile("./db/db.json", (err, data) => {
      if (err) {
        res.json("There was an error reading the database.");
        throw err;
      }
      const currentData = JSON.parse(data);
      let newArray = currentData.filter((note) => note.id !== req.params.id);
      fs.writeFile("./db/db.json", JSON.stringify(newArray), (err) => {
        if (err) {
          res.json({
            message: "There was an error deleting item from database.",
            error: err,
          });
        }
        res.json(JSON.stringify(newArray));
      });
    });
  }
});

app.listen(port);
console.log("⚡️ Server started on port", port);
