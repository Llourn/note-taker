const express = require("express");
const uniqid = require("uniqid");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050;

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
  fs.readFile("./db/db.json")
    .then((data) => {
      res.json(JSON.parse(data));
    })
    .catch((err) => {
      console.error("There was an error reading the database.", err);
      res.json("There was an error reading the database.");
    });
});

// adds note the database with a unique id.
app.post("/api/notes", async (req, res) => {
  let notesList = [];

  try {
    const data = await fs.readFile("./db/db.json");
    notesList = JSON.parse(data);
  } catch (err) {
    console.error("There was an error reading the database.", err);
  }

  const note = { ...req.body, id: uniqid() };
  notesList.push(note);

  try {
    await fs.writeFile("./db/db.json", JSON.stringify(notesList));
    res.json(notesList);
  } catch (err) {
    console.error("There was an error writing to the database.", err);
    res.json("There was an error writing to the database.");
  }
});

// delete notes from the database using the id
app.delete("/api/notes/:id", async (req, res) => {
  let notesList = [];

  try {
    const data = await fs.readFile("./db/db.json");
    notesList = JSON.parse(data);
  } catch (err) {
    console.error("There was an error reading the database.", err);
  }

  notesList = notesList.filter((note) => note.id !== req.params.id);

  try {
    await fs.writeFile("./db/db.json", JSON.stringify(notesList));
    res.json(notesList);
  } catch (err) {
    console.error("There was an error writing to the database.", err);
    res.json("There was an error writing to the database.");
  }
});

app.listen(PORT, () => {
  console.log("⚡️ Server started on port", PORT);
});
