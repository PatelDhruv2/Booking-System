// middleware/authenticate.js
import jwt from 'jsonwebtoken';
import prisma from '../config/db.config.js';

/**
 * Protect routes by checking for a valid JWT in Authorization header.
 * On success, sets req.user = { id, role, ... }.
 */
export const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // 3. Fetch user from DB (optional but ensures user still exists)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, name: true, email: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // 4. Attach to request and move on
    req.user = user; 
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    // TokenExpiredError or JsonWebTokenError both come here
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
