import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import ViteExpress from "vite-express";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Database setup
const db = new Database('./database.db', { verbose: console.log });

// Initialize table
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    code INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER,
    unit TEXT
  )
`).run();

// Prepare statements
const insertProduct = db.prepare('INSERT INTO products (name, quantity, unit) VALUES (?, ?, ?)');
const getAllProducts = db.prepare('SELECT * FROM products');
const getProductById = db.prepare('SELECT * FROM products WHERE code = ?');
const updateProduct = db.prepare('UPDATE products SET name = ?, quantity = ?, unit = ? WHERE code = ?');
const deleteProduct = db.prepare('DELETE FROM products WHERE code = ?');

// CRUD Routes
app.post('/api/produtos', (req, res) => {
  try {
    const { nome, quantidade, unidade } = req.body;
    const info = insertProduct.run(nome, quantidade, unidade);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/produtos', (req, res) => {
  try {
    const products = getAllProducts.all();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/produtos/:id', (req, res) => {
  try {
    const product = getProductById.get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/produtos/:id', (req, res) => {
  try {
    const { nome, quantidade, unidade } = req.body;
    const info = updateProduct.run(nome, quantidade, unidade, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ changes: info.changes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/produtos/:id', (req, res) => {
  try {
    const info = deleteProduct.run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

ViteExpress.listen(app, port, () => console.log("Server is listening..."));

// Cleanup on exit
process.on('SIGINT', () => {
  db.close();
  console.log('Database connection closed');
  process.exit(0);
});