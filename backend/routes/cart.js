import { Router } from 'express';
import { query, findOne, insert, update, remove } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

function getCartItems(userId) {
  const items = query('cart_items', ci => ci.user_id === userId);
  return items.map(ci => {
    const p = findOne('products', prod => prod.id === ci.product_id);
    return {
      id: ci.id,
      product_id: ci.product_id,
      quantity: ci.quantity,
      name: p?.name || '',
      price: p?.price || 0,
      image: p?.image || '',
      stock: p?.stock || 0,
    };
  });
}

router.get('/', (req, res) => {
  res.json(getCartItems(req.userId));
});

router.post('/', (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  const existing = findOne('cart_items', ci =>
    ci.user_id === req.userId && ci.product_id === product_id
  );

  if (existing) {
    update('cart_items', existing.id, { quantity: existing.quantity + quantity });
  } else {
    insert('cart_items', {
      user_id: req.userId,
      product_id: product_id,
      quantity,
    });
  }

  res.status(201).json({ message: 'Item adicionado ao carrinho' });
});

router.put('/:productId', (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantidade deve ser pelo menos 1' });
  }

  const item = findOne('cart_items', ci =>
    ci.user_id === req.userId && ci.product_id === Number(req.params.productId)
  );

  if (item) {
    update('cart_items', item.id, { quantity });
  }

  res.json({ message: 'Carrinho atualizado' });
});

router.delete('/:productId', (req, res) => {
  const item = findOne('cart_items', ci =>
    ci.user_id === req.userId && ci.product_id === Number(req.params.productId)
  );

  if (item) remove('cart_items', item.id);
  res.json({ message: 'Item removido do carrinho' });
});

router.delete('/', (req, res) => {
  const items = query('cart_items', ci => ci.user_id === req.userId);
  items.forEach(item => remove('cart_items', item.id));
  res.json({ message: 'Carrinho limpo' });
});

export default router;
