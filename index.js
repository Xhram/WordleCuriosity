import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'website' folder
app.use(express.static(path.join(__dirname, 'solver/website')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});