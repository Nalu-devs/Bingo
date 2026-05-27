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
  console.log('[cart.js] GET / - userId:', req.userId);
  const items = getCartItems(req.userId);
  console.log('[cart.js] Carrinho tem', items.length, 'itens');
  res.json(items);
});

router.post('/', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  console.log('[cart.js] POST / - userId:', req.userId, 'product_id:', product_id, 'quantity:', quantity);

  const existing = findOne('cart_items', ci =>
    ci.user_id === req.userId && ci.product_id === product_id
  );

  if (existing) {
    console.log('[cart.js] Item já existe no carrinho, atualizando quantidade');
    update('cart_items', existing.id, { quantity: existing.quantity + quantity });
  } else {
    console.log('[cart.js] Novo item no carrinho');
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
  console.log('[cart.js] PUT /:productId - userId:', req.userId, 'productId:', req.params.productId, 'quantity:', quantity);

  if (quantity < 1) {
    console.log('[cart.js] Quantidade inválida');
    return res.status(400).json({ error: 'Quantidade deve ser pelo menos 1' });
  }

  const item = findOne('cart_items', ci =>
    ci.user_id === req.userId && ci.product_id === Number(req.params.productId)
  );

  if (item) {
    console.log('[cart.js] Atualizando item', item.id);
    update('cart_items', item.id, { quantity });
  } else {
    console.log('[cart.js] Item não encontrado no carrinho');
  }

  res.json({ message: 'Carrinho atualizado' });
});

router.delete('/:productId', (req, res) => {
  console.log('[cart.js] DELETE /:productId - userId:', req.userId, 'productId:', req.params.productId);
  const item = findOne('cart_items', ci =>
    ci.user_id === req.userId && ci.product_id === Number(req.params.productId)
  );

  if (item) {
    remove('cart_items', item.id);
    console.log('[cart.js] Item removido');
  } else {
    console.log('[cart.js] Item não encontrado para remover');
  }
  res.json({ message: 'Item removido do carrinho' });
});

router.delete('/', (req, res) => {
  console.log('[cart.js] DELETE / - limpando carrinho do userId:', req.userId);
  const items = query('cart_items', ci => ci.user_id === req.userId);
  items.forEach(item => remove('cart_items', item.id));
  console.log('[cart.js] Carrinho limpo,', items.length, 'itens removidos');
  res.json({ message: 'Carrinho limpo' });
});

export default router;
