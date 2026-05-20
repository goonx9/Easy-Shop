import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Log incoming requests for dev debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Explicit routes for major HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/scanner', (req, res) => {
  res.sendFile(path.join(__dirname, 'scanner.html'));
});

app.get('/scanner.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'scanner.html'));
});

app.get('/jumpstarter', (req, res) => {
  res.sendFile(path.join(__dirname, 'jumpstarter.html'));
});

app.get('/jumpstarter.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'jumpstarter.html'));
});

app.get('/carjack', (req, res) => {
  res.sendFile(path.join(__dirname, 'carjack.html'));
});

app.get('/carjack.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'carjack.html'));
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Fallback to index.html for any other unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
