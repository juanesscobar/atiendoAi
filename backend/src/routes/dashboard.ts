import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/dashboard/resumen
 * Obtener resumen del dashboard
 */
router.get('/resumen', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Total de clientes
    const clientesResult = await pool.query(
      'SELECT COUNT(*) as total FROM contactos WHERE empresa_id = $1',
      [req.usuario.empresa_id]
    );

    // Total de reservas este mes
    const reservasResult = await pool.query(
      `SELECT COUNT(*) as total FROM reservas 
       WHERE empresa_id = $1 AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM NOW())`,
      [req.usuario.empresa_id]
    );

    // Total de ingresos este mes
    const ingresosResult = await pool.query(
      `SELECT COALESCE(SUM(monto), 0) as total FROM pagos 
       WHERE empresa_id = $1 AND estado = 'completado' 
       AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM NOW())`,
      [req.usuario.empresa_id]
    );

    // Total de conversaciones
    const conversacionesResult = await pool.query(
      'SELECT COUNT(*) as total FROM conversaciones WHERE empresa_id = $1',
      [req.usuario.empresa_id]
    );

    res.json({
      clientes: parseInt(clientesResult.rows[0].total),
      reservas_mes: parseInt(reservasResult.rows[0].total),
      ingresos_mes: parseFloat(ingresosResult.rows[0].total),
      conversaciones: parseInt(conversacionesResult.rows[0].total)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dashboard/ultimos-contactos
 * Últimos contactos
 */
router.get('/ultimos-contactos', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, telefono, email, created_at
       FROM contactos
       WHERE empresa_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [req.usuario.empresa_id]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dashboard/ultimas-reservas
 * Últimas reservas
 */
router.get('/ultimas-reservas', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.fecha, r.estado, s.nombre as servicio, c.nombre as cliente
       FROM reservas r
       LEFT JOIN servicios s ON r.servicio_id = s.id
       LEFT JOIN contactos c ON r.contacto_id = c.id
       WHERE r.empresa_id = $1
       ORDER BY r.fecha DESC
       LIMIT 10`,
      [req.usuario.empresa_id]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
