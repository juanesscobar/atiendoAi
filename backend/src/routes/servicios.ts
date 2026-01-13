import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/servicios
 * Listar servicios de la empresa
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, duracion_minutos, categoria, activo, created_at
       FROM servicios
       WHERE empresa_id = $1
       ORDER BY created_at DESC`,
      [req.usuario.empresa_id]
    );

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/servicios
 * Crear nuevo servicio
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, precio, duracion_minutos, categoria } = req.body;

    if (!nombre || !precio || !duracion_minutos) {
      return res.status(400).json({ error: 'Nombre, precio y duración son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO servicios (empresa_id, nombre, descripcion, precio, duracion_minutos, categoria, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
       RETURNING *`,
      [req.usuario.empresa_id, nombre, descripcion, precio, duracion_minutos, categoria]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/servicios/:id
 * Actualizar servicio
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, duracion_minutos, categoria, activo } = req.body;

    const result = await pool.query(
      `UPDATE servicios
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           precio = COALESCE($3, precio),
           duracion_minutos = COALESCE($4, duracion_minutos),
           categoria = COALESCE($5, categoria),
           activo = COALESCE($6, activo),
           updated_at = NOW()
       WHERE id = $7 AND empresa_id = $8
       RETURNING *`,
      [nombre, descripcion, precio, duracion_minutos, categoria, activo, id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/servicios/:id
 * Eliminar servicio (soft delete)
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE servicios
       SET activo = false, updated_at = NOW()
       WHERE id = $1 AND empresa_id = $2
       RETURNING *`,
      [id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
