import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const usuario = await AuthService.verifyToken(token);
    req.usuario = usuario;
    next();
  } catch (error: any) {
    res.status(error.status || 401).json({ error: error.message });
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Permiso denegado' });
    }

    next();
  };
}
