import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'entourage-admin-secret-key-2024';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'არაავტორიზებული' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'არასწორი ტოკენი' });
  }
}

export { JWT_SECRET };
