import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 * Registrar nuevo usuario y empresa
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, nombre_empresa } = req.body;

    if (!email || !password || !nombre || !nombre_empresa) {
      return res.status(400).json({ error: 'Campos requeridos: email, password, nombre, nombre_empresa' });
    }

    const result = await AuthService.register({ email, password, nombre, nombre_empresa });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Login con email y contraseña
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const result = await AuthService.login({ email, password });
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

/**
 * GET /api/auth/me
 * Obtener datos del usuario actual
 */
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  res.json({
    usuario: req.usuario
  });
});

/**
 * POST /api/auth/change-password
 * Cambiar contraseña
 */
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Contraseña antigua y nueva requeridas' });
    }

    await AuthService.changePassword(req.usuario.id, oldPassword, newPassword);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

export default router;
