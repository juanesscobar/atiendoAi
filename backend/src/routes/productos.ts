import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/productos
 * Listar productos de la empresa
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, imagen_url, activo, created_at
       FROM productos
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
 * POST /api/productos
 * Crear nuevo producto
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, precio, imagen_url } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO productos (empresa_id, nombre, descripcion, precio, imagen_url, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING *`,
      [req.usuario.empresa_id, nombre, descripcion, precio, imagen_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/productos/:id
 * Actualizar producto
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen_url, activo } = req.body;

    const result = await pool.query(
      `UPDATE productos
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           precio = COALESCE($3, precio),
           imagen_url = COALESCE($4, imagen_url),
           activo = COALESCE($5, activo),
           updated_at = NOW()
       WHERE id = $6 AND empresa_id = $7
       RETURNING *`,
      [nombre, descripcion, precio, imagen_url, activo, id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/productos/:id
 * Eliminar producto (soft delete)
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE productos
       SET activo = false, updated_at = NOW()
       WHERE id = $1 AND empresa_id = $2
       RETURNING *`,
      [id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
