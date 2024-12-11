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
    name TEXT NOT NULL UNIQUE,
    quantity INTEGER,
    unit TEXT
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS add_log (
    date TEXT,
    product_name TEXT NOT NULL UNIQUE,
    quantity INTEGER,
    sector TEXT,
    person TEXT
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS remove_log (
    date TEXT,
    product_name TEXT NOT NULL UNIQUE,
    quantity INTEGER,
    sector TEXT,
    person TEXT
  );
`).run();

// Prepare statements
const insertProduct = db.prepare('INSERT INTO products (name, quantity, unit) VALUES (?, ?, ?)');
const getAllProducts = db.prepare('SELECT * FROM products');
const getProductById = db.prepare('SELECT * FROM products WHERE code = ?');
const updateProduct = db.prepare('UPDATE products SET name = ?, quantity = ?, unit = ? WHERE code = ?');
const deleteProduct = db.prepare('DELETE FROM products WHERE code = ?');

const getProductByName = db.prepare('SELECT * FROM products WHERE name = ?');
const updateQuantity = db.prepare('UPDATE products SET quantity = ? WHERE name = ?');

const addQuantity = db.prepare('UPDATE products SET quantity = quantity + ? WHERE name = ?');

// CRUD Routes

// Create
app.post('/api/produtos', (req, res) => {
  try {
    const { nome, quantidade, unidade } = req.body;
    const capitalizedNome = nome.charAt(0).toUpperCase() + nome.slice(1);
    const info = insertProduct.run(capitalizedNome, quantidade, unidade);
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/add_log', (req, res) => {
  try {
    const { data, nome_produto, quantidade, setor, responsavel } = req.body;
    db.prepare('INSERT INTO add_log (date, product_name, quantity, sector, person) VALUES (?, ?, ?, ?, ?)').run(data, nome_produto, quantidade, setor, responsavel);
    res.json({ message: 'Log added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/remove_log', (req, res) => {
  try {
    const { data, nome_produto, quantidade, setor, responsavel } = req.body;
    db.prepare('INSERT INTO remove_log (date, product_name, quantity, sector, person) VALUES (?, ?, ?, ?, ?)').run(data, nome_produto, quantidade, setor, responsavel);
    res.json({ message: 'Log added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/produtos/subtract', (req, res) => {
  try {
    const { nome, quantidade } = req.body;
    
    // First get the current product
    const product = getProductByName.get(nome);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate new quantity
    const newQuantity = product.quantity - parseInt(quantidade);
    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Insufficient quantity' });
    }

    // Update the product quantity
    const info = updateQuantity.run(newQuantity, nome);
    if (info.changes === 0) {
      return res.status(500).json({ error: 'Failed to update quantity' });
    }

    res.json({ 
      message: 'Quantity updated successfully',
      newQuantity: newQuantity 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/produtos/add', (req, res) => {
  try {
    const { nome, quantidade } = req.body;
    
    // First get the current product
    const product = getProductByName.get(nome);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product quantity
    const info = addQuantity.run(parseInt(quantidade), nome);
    if (info.changes === 0) {
      return res.status(500).json({ error: 'Failed to update quantity' });
    }

    res.json({ 
      message: 'Quantity updated successfully',
      newQuantity: product.quantity + parseInt(quantidade)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read
app.get('/api/produtos', (req, res) => {
  try {
    const products = getAllProducts.all();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/add_log', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM add_log').all();
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/remove_log', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM remove_log').all();
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Search
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