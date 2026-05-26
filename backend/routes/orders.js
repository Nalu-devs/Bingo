import { Router } from 'express';
import { query, findOne, insert, update, remove } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.post('/checkout', (req, res) => {
  const cartItems = query('cart_items', ci => ci.user_id === req.userId);

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  const items = cartItems.map(ci => {
    const p = findOne('products', prod => prod.id === ci.product_id);
    return { ...ci, price: p?.price || 0, name: p?.name || '', stock: p?.stock || 0 };
  });

  for (const item of items) {
    if (item.stock < item.quantity) {
      return res.status(400).json({ error: `Estoque insuficiente para ${item.name}` });
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = insert('orders', { user_id: req.userId, total, status: 'pending' });

  for (const item of items) {
    insert('order_items', {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    });
    const p = findOne('products', prod => prod.id === item.product_id);
    if (p) update('products', p.id, { stock: p.stock - item.quantity });
  }

  cartItems.forEach(ci => remove('cart_items', ci.id));

  res.status(201).json({
    order_id: order.id,
    total,
    message: 'Pedido realizado com sucesso!',
  });
});

router.get('/', (req, res) => {
  const orders = query('orders', o => o.user_id === req.userId).reverse();

  const result = orders.map(order => {
    const items = query('order_items', oi => oi.order_id === order.id).map(oi => {
      const p = findOne('products', prod => prod.id === oi.product_id);
      return { ...oi, name: p?.name || '', image: p?.image || '' };
    });
    return { ...order, items };
  });

  res.json(result);
});

export default router;
