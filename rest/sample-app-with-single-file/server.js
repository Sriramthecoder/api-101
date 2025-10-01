import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../.env');

if (!existsSync(envPath)) {
  console.error('.env file missing');
  process.exit(1);
}

dotenv.config({ path: envPath });
const PORT = process.env.REST_PORT || 3000;
const ENABLE_TRACE = process.env.ENABLE_TRACE === 'true';

const app = express();
app.use(express.json());

// ─── Simple routes for all methods ─────

app.get('/', (req, res) => {
  res.send('REST API with all methods!');
});

app.get('/api', (req, res) => {
  res.json({ message: 'GET response' });
});

app.head('/api', (req, res) => {
  res.status(200).end();
});

app.post('/api', (req, res) => {
  res.status(201).json({ message: 'POST received', data: req.body });
});

app.put('/api', (req, res) => {
  res.json({ message: 'PUT received', data: req.body });
});

app.patch('/api', (req, res) => {
  res.json({ message: 'PATCH received', data: req.body });
});

app.delete('/api', (req, res) => {
  res.status(204).end();
});

app.options('/api', (req, res) => {
  res.set('Allow', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE');
  res.status(204).end();
});

// TRACE
if (ENABLE_TRACE) {
  app.trace('/api', (req, res) => {
    // Build echoed request 
    let echo = `TRACE /api HTTP/1.1\r\n`;
    for (const [key, value] of Object.entries(req.headers)) {
      echo += `${key}: ${value}\r\n`;
    }
    echo += '\r\n';
    res.set('Content-Type', 'message/http');
    res.send(echo);
  });
}

// ─── Start server ───────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (ENABLE_TRACE) {
    console.log('TRACE method is ENABLED (for learning only)');
  }
});