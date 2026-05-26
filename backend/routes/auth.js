import { Router } from 'express';
import { insert, findOne } from '../db/database.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const existing = findOne('users', u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const user = insert('users', { name, email, password });
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findOne('users', u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  res.json({ id: user.id, name: user.name, email: user.email });
});

export default router;
