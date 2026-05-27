import { Router } from 'express';
import { query, findOne } from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search } = req.query;
  console.log('[products.js] Listando produtos. Filtros:', { category, search });

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

  console.log('[products.js] Retornando', products.length, 'produtos');
  res.json(products.reverse());
});

router.get('/categories', (req, res) => {
  console.log('[products.js] Listando categorias');
  const products = query('products');
  const cats = [...new Set(products.map(p => p.category))].sort();
  console.log('[products.js] Categorias encontradas:', cats);
  res.json(cats);
});

router.get('/:id', (req, res) => {
  console.log('[products.js] Buscando produto id:', req.params.id);
  const product = findOne('products', p => p.id === Number(req.params.id));
  if (!product) {
    console.log('[products.js] Produto não encontrado:', req.params.id);
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  console.log('[products.js] Produto encontrado:', product.name);
  res.json(product);
});

export default router;
