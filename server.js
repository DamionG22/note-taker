const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json()); // Parse JSON request bodies

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body; // Get the note from the request body
  newNote.id = notes.length + 1; // Assign a unique ID to the new note

  notes.push(newNote); // Add the new note to the notes array

  // Write the updated notes array to the db.json file
  fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save note' });
    } else {
      res.json(newNote); // Respond with the new note
    }
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
