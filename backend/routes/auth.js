import { Router } from 'express';
import { insert, findOne } from '../db/database.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('[auth.js] Tentativa de registro:', { name, email });

  if (!name || !email || !password) {
    console.log('[auth.js] Campos obrigatórios faltando');
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const existing = findOne('users', u => u.email === email);
  if (existing) {
    console.log('[auth.js] Email já cadastrado:', email);
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const user = insert('users', { name, email, password });
  console.log('[auth.js] Usuário registrado com sucesso:', user.id);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('[auth.js] Tentativa de login:', { email });

  const user = findOne('users', u => u.email === email && u.password === password);

  if (!user) {
    console.log('[auth.js] Login falhou - credenciais inválidas');
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  console.log('[auth.js] Login bem-sucedido:', user.id);
  res.json({ id: user.id, name: user.name, email: user.email });
});

export default router;
