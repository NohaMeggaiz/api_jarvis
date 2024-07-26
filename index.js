const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Define the base path for searching
const BASE_PATH = 'C:\\Users\\hp\\Documents\\servers';

app.use(bodyParser.json());

app.post('/new', (req, res) => {
    const { command, siteName, serverName } = req.body;

    if (!command || !siteName || !serverName) {
        return res.status(400).send('Missing command, siteName, or serverName');
    }

    const serverDir = path.join(BASE_PATH, serverName);
    const siteDir = path.join(serverDir, siteName);

    if (!fs.existsSync(siteDir) || !fs.lstatSync(siteDir).isDirectory()) {
        return res.status(404).send('Site not found');
    }

    // Path to the commands file
    const commandsFile = path.join(siteDir, 'commands');

    // Ensure the commands file exists
    if (!fs.existsSync(commandsFile)) {
        fs.writeFileSync(commandsFile, '');
    }

    // Register the new command
    fs.appendFileSync(commandsFile, `${command}\n`);

    res.status(201).send('Command registered successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
