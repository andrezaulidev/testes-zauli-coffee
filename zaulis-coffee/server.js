const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // max 100 requests
    message: 'Muitas requisições, tente mais tarde'
});

const checkoutLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10, // max 10 checkouts
    message: 'Muitos pedidos, aguarde um minuto'
});

app.use('/api/', limiter);

// Serve static site (project root)
app.use(express.static(path.join(__dirname, '..')));

// Cache headers middleware
app.use((req, res, next) => {
    // Cache estáticos por 1 ano
    if (req.url.match(/\.(js|css|png|jpg|gif|svg|woff2|ttf)$/i)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // HTML nunca cachear
    else if (req.url.endsWith('.html') || req.url === '/') {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
});

// SQLite setup
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    total REAL,
    customer TEXT,
    createdAt TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT,
    product_id INTEGER,
    nome TEXT,
    preco REAL,
    quantidade INTEGER
  )`);
});

// Produtos (carregados do db.json)
let produtos = [];
try {
    const fs = require('fs');
    const dbJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    produtos = dbJson.products || [];
} catch (err) {
    console.warn('Erro ao carregar db.json, usando array vazio:', err.message);
    produtos = [];
}

// API: get products
app.get('/api/products', (req, res) => {
  res.json(produtos.length > 0 ? produtos : []);
});

// API: checkout - persist to SQLite
app.post('/api/checkout', checkoutLimiter, (req, res) => {
  const { cart, customer } = req.body || {};
  
  // Validação
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }
  
  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({ error: 'Dados do cliente incompletos' });
  }
  
  // Validar telefone
  const cleanPhone = customer.phone.replace(/\D/g, '');
  if (!/^\d{10,11}$/.test(cleanPhone)) {
    return res.status(400).json({ error: 'Telefone inválido (10-11 dígitos)' });
  }
  
  // Validar preços para evitar tampering
  const validCart = cart.every(item => {
    const realProd = produtos.find(p => p.id === item.id);
    if (!realProd || Math.abs(realProd.preco - item.preco) > 0.01) {
      return false;
    }
    return item.quantidade > 0 && item.quantidade <= 100;
  });
  
  if (!validCart) {
    return res.status(400).json({ error: 'Carrinho contém dados inválidos' });
  }
  
  const id = String(Date.now());
  const total = cart.reduce((s, it) => s + (it.preco * it.quantidade), 0);
  const createdAt = new Date().toISOString();

  db.serialize(() => {
    const insertOrder = db.prepare('INSERT INTO orders (id, total, customer, createdAt) VALUES (?, ?, ?, ?)');
    insertOrder.run(id, total, JSON.stringify(customer), createdAt, function(err) {
      insertOrder.finalize();
      if (err) return res.status(500).json({ error: 'Erro ao salvar pedido' });
      
      const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, nome, preco, quantidade) VALUES (?, ?, ?, ?, ?)');
      let itemsProcessed = 0;
      
      cart.forEach((item, idx) => {
        insertItem.run(id, item.id, item.nome, item.preco, item.quantidade, (err) => {
          itemsProcessed++;
          if (itemsProcessed === cart.length) {
            insertItem.finalize();
            res.json({ success: true, orderId: id });
          }
        });
      });
    });
  });
});

// API: get order (from DB)
app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  
  // Validar que o ID é um timestamp válido
  if (!/^\d+$/.test(orderId)) {
    return res.status(400).json({ error: 'ID de pedido inválido' });
  }
  
  db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao consultar pedido' });
    if (!row) return res.status(404).json({ error: 'Pedido não encontrado' });
    
    db.all('SELECT * FROM order_items WHERE order_id = ?', [orderId], (err2, items) => {
      if (err2) return res.status(500).json({ error: 'Erro ao consultar itens' });
      const order = { 
        id: row.id, 
        total: row.total, 
        customer: JSON.parse(row.customer || '{}'), 
        createdAt: row.createdAt, 
        items: items || [] 
      };
      res.json(order);
    });
  });
});

// Payment: generate QR code for amount or order
app.post('/api/payment/qr', async (req, res) => {
  try {
    // QR code generation removed - use external payment provider
    res.status(501).json({ error: 'QR generation not available in this version' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar QR code' });
  }
});

app.listen(PORT, () => {
  console.log(`Zauli's demo server running on http://localhost:${PORT}`);
});
