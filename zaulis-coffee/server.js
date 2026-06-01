const express = require('express');
const path = require('path');
const fs = require('fs');
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
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000', 'http://localhost:8080'],
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

// Armazenamento em memória de pedidos
let orders = [];

// Carregar produtos do db.json
let produtos = [];
try {
    const dbJsonPath = path.join(__dirname, 'db.json');
    const dbJson = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
    produtos = dbJson.products || [];
    console.log(`✅ ${produtos.length} produtos carregados de db.json`);
} catch (err) {
    console.warn('⚠️  Erro ao carregar db.json:', err.message);
    produtos = [];
}

// API: get products
app.get('/api/products', (req, res) => {
    res.json(produtos.length > 0 ? produtos : []);
});

// API: checkout - armazenar em memória
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

    // Validar email
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
        return res.status(400).json({ error: 'Email inválido' });
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

    // Salvar pedido em memória
    const order = {
        id,
        total,
        customer,
        createdAt,
        items: cart,
        status: 'pending'
    };

    orders.push(order);

    console.log(`📦 Novo pedido #${id} - Total: R$ ${total.toFixed(2)}`);

    res.json({
        success: true,
        orderId: id,
        message: 'Pedido recebido! Aguardando confirmação via WhatsApp.'
    });
});

// API: get order (da memória)
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;

    // Validar que o ID é um timestamp válido
    if (!/^\d+$/.test(orderId)) {
        return res.status(400).json({ error: 'ID de pedido inválido' });
    }

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(order);
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        produtos: produtos.length,
        pedidos: orders.length
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`\n☕ Zauli's Coffee Server rodando em http://localhost:${PORT}\n`);
    console.log(`   Produtos: /api/products`);
    console.log(`   Checkout: POST /api/checkout`);
    console.log(`   Pedidos: GET /api/orders/:id`);
    console.log(`   Health: GET /health\n`);
});
