const express = require('express');
const path = require('path');
const fs = require('fs');
// links const notes with db that collects user data
const notes = require('./db/db.json');
// listening port id
const PORT = 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json()); // Parse JSON request bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body; // Gets the note from the request body
  newNote.id = notes.length + 1; // Assigns an ID to the new note

  notes.push(newNote); // Adds the new note to the notes array

  // Writes the updated notes array to the db.json file
  fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save note' });
    } else {
      res.json(newNote); // Respond with the new note
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id); // Get the note ID from the request parameters

  // Find the index of the note with the matching ID in the notes array
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex === -1) {
    res.status(404).json({ error: 'Note not found' });
  } else {
    notes.splice(noteIndex, 1); // Remove the note from the notes array

    // Write the updated notes array to the db.json file
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete note' });
      } else {
        res.sendStatus(204); // Respond with a success status code (No Content)
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
