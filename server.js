const express = require('express');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

const db = new sqlite3.Database('users.db'); // Persistent storage
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)");

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err) => {
        if (err) return res.status(400).send("Username taken");
        res.send("Registered!");
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Invalid credentials");
        }
        res.send("Logged in!");
    });
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000; // Render uses PORT env variable
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
