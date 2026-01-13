import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/horarios
 * Listar horarios de la empresa
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, dia_semana, hora_apertura, hora_cierre, servicio_id, activo
       FROM horarios
       WHERE empresa_id = $1
       ORDER BY dia_semana, hora_apertura`,
      [req.usuario.empresa_id]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/horarios
 * Crear nuevo horario
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { dia_semana, hora_apertura, hora_cierre, servicio_id } = req.body;

    if (!dia_semana || !hora_apertura || !hora_cierre) {
      return res.status(400).json({ error: 'Día, hora apertura y hora cierre son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO horarios (empresa_id, dia_semana, hora_apertura, hora_cierre, servicio_id, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING *`,
      [req.usuario.empresa_id, dia_semana, hora_apertura, hora_cierre, servicio_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/horarios/:id
 * Actualizar horario
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { hora_apertura, hora_cierre, activo } = req.body;

    const result = await pool.query(
      `UPDATE horarios
       SET hora_apertura = COALESCE($1, hora_apertura),
           hora_cierre = COALESCE($2, hora_cierre),
           activo = COALESCE($3, activo),
           updated_at = NOW()
       WHERE id = $4 AND empresa_id = $5
       RETURNING *`,
      [hora_apertura, hora_cierre, activo, id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/horarios/:id
 * Eliminar horario
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE horarios
       SET activo = false, updated_at = NOW()
       WHERE id = $1 AND empresa_id = $2
       RETURNING *`,
      [id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
