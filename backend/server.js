import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { seedProducts } from './db/database.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

console.log('[server.js] Iniciando servidor...');
seedProducts();
console.log('[server.js] Seed executado.');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
  console.log(`[server.js] ${req.method} ${req.url}`);
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

app.get('*', (req, res) => {
  console.log('[server.js] Servindo index.html para:', req.url);
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[server.js] Servidor rodando em http://localhost:${PORT}`);
});
