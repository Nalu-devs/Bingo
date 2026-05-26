import { Router } from 'express';
import { query, findOne } from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search } = req.query;

  let products = query('products');

  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (search) {
    const term = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  res.json(products.reverse());
});

router.get('/categories', (req, res) => {
  const products = query('products');
  const cats = [...new Set(products.map(p => p.category))].sort();
  res.json(cats);
});

router.get('/:id', (req, res) => {
  const product = findOne('products', p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

export default router;
