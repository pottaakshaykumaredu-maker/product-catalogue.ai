// server.js - Express Web Server for Product Store (Pure Node.js + Express)
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const portArgIndex = process.argv.indexOf('--port');
const PORT = process.env.PORT || (portArgIndex !== -1 ? process.argv[portArgIndex + 1] : 3000);

// Resolve directories whether started from project root or public/assets/aistudio
const HTML_DIR = fs.existsSync(path.join(__dirname, 'index.html'))
  ? __dirname
  : path.join(__dirname, 'public/assets/aistudio');

const ROOT_DIR = fs.existsSync(path.join(__dirname, 'package.json'))
  ? __dirname
  : path.resolve(__dirname, '../../../');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from HTML directory and Root directory
app.use(express.static(HTML_DIR));
app.use(express.static(ROOT_DIR));
app.use('/images', express.static(path.join(ROOT_DIR, 'images')));

// REST APIs
app.get('/api/products', (req, res) => res.json({ success: true, message: 'Catalogue retrieved' }));
app.post('/api/contact', (req, res) => res.json({ success: true, message: 'Inquiry received' }));

// Route clean URLs (e.g. /catalogue -> catalogue.html)
app.get('/:page', (req, res, next) => {
  const file = path.join(HTML_DIR, `${req.params.page}.html`);
  if (fs.existsSync(file)) return res.sendFile(file);
  next();
});

// Fallback all other routes to index.html
app.get('*', (req, res) => res.sendFile(path.join(HTML_DIR, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  Product Store E-Commerce Server Running`);
  console.log(`  ➜  Local:   http://localhost:${PORT}/`);
  console.log(`  ➜  Network: http://127.0.0.1:${PORT}/`);
  console.log(`  ➜  Click or Ctrl+Click http://localhost:${PORT}/ to open in browser`);
  console.log(`======================================================\n`);
});
