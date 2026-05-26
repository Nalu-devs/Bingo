export function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  req.userId = Number(userId);
  next();
}
