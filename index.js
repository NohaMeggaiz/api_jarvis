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
    const { line, siteName, serverName, type } = req.body;

    if (!line || !siteName || !serverName || !type) {
        return res.status(400).send('Missing line, siteName, serverName, or type');
    }

    const serverDir = path.join(BASE_PATH, serverName);
    const siteDir = path.join(serverDir, siteName);

    if (!fs.existsSync(siteDir) || !fs.lstatSync(siteDir).isDirectory()) {
        return res.status(404).send('Site not found');
    }

    let filePath;
    if (type === 'command') {
        filePath = path.join(siteDir, 'commands');
    } else if (type === 'crontab') {
        filePath = path.join(siteDir, 'crontabs');
    } else {
        return res.status(400).send('Invalid type. Must be "command" or "crontab".');
    }

    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }

    // Register the new line
    fs.appendFileSync(filePath, `${line}\n`);

    res.status(201).send(`${type} registered successfully`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
