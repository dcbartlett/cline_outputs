const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from parent directory (for index.html)
app.use(express.static(path.join(__dirname, '..')));

const lyricsDir = path.join(__dirname, 'lyrics');
let cachedSongs = [];

// Function to read and cache songs
const cacheSongs = () => {
    fs.readdir(lyricsDir, (err, files) => {
        if (err) {
            console.error('Error reading lyrics directory:', err);
            return;
        }
        cachedSongs = files.filter(file => file.endsWith('.json')).map(file => path.basename(file, '.json'));
        console.log('Cached songs:', cachedSongs);
    });
};

// Call cacheSongs on startup
cacheSongs();

// Endpoint to get the list of songs
app.get('/songs', (req, res) => {
    res.json(cachedSongs);
});

// Endpoint to get lyrics for a specific song
app.get('/lyrics/:songTitle', (req, res) => {
    const { songTitle } = req.params;
    const lyricsFile = path.join(lyricsDir, `${songTitle}.json`);

    fs.readFile(lyricsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading lyrics file:', err);
            return res.status(404).send('Lyrics not found');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
