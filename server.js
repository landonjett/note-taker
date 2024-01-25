
// Server.js


const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // UUID for unique note IDs

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./Develop/public')); // Serve static files from 'public' directory

// API Routes

// GET /api/notes - Return all saved notes from db.json as JSON
app.get('/api/notes', (req, res) => {
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error reading notes" });
        }
        res.json(JSON.parse(data));
    });
});

// POST /api/notes - Receive a new note and add it to db.json
app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };

    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error saving note" });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile('./Develop/db/db.json', JSON.stringify(notes), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error writing note" });
            }
            res.json(newNote);
        });
    });
});

// Bonus: DELETE /api/notes/:id - Delete the note with given id
// Uncomment and implement if needed

// HTML Routes

// GET /notes - Return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

// GET * - Return the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});