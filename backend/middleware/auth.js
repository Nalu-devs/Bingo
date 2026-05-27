export function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  console.log('[authMiddleware] Verificando auth, x-user-id:', userId);
  if (!userId) {
    console.log('[authMiddleware] Usuário não autenticado, bloqueando');
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  req.userId = Number(userId);
  console.log('[authMiddleware] Usuário autenticado: id =', req.userId);
  next();
}
