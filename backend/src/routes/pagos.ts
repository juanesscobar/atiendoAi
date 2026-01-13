import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/pagos
 * Listar medios de pago de la empresa
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, metodo, alias, numero_cuenta, banco, tipo_cuenta, nombre_titular, activo, created_at
       FROM medios_pago
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
 * POST /api/pagos
 * Agregar medio de pago
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { metodo, alias, numero_cuenta, banco, tipo_cuenta, nombre_titular } = req.body;

    if (!metodo || !alias) {
      return res.status(400).json({ error: 'Método y alias son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO medios_pago (empresa_id, metodo, alias, numero_cuenta, banco, tipo_cuenta, nombre_titular, activo, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
       RETURNING id, metodo, alias, numero_cuenta, banco, tipo_cuenta, nombre_titular, activo, created_at`,
      [req.usuario.empresa_id, metodo, alias, numero_cuenta, banco, tipo_cuenta, nombre_titular]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/pagos/:id
 * Actualizar medio de pago
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { alias, numero_cuenta, banco, tipo_cuenta, nombre_titular, activo } = req.body;

    const result = await pool.query(
      `UPDATE medios_pago
       SET alias = COALESCE($1, alias),
           numero_cuenta = COALESCE($2, numero_cuenta),
           banco = COALESCE($3, banco),
           tipo_cuenta = COALESCE($4, tipo_cuenta),
           nombre_titular = COALESCE($5, nombre_titular),
           activo = COALESCE($6, activo),
           updated_at = NOW()
       WHERE id = $7 AND empresa_id = $8
       RETURNING id, metodo, alias, numero_cuenta, banco, tipo_cuenta, nombre_titular, activo`,
      [alias, numero_cuenta, banco, tipo_cuenta, nombre_titular, activo, id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medio de pago no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/pagos/:id
 * Eliminar medio de pago (soft delete)
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE medios_pago
       SET activo = false, updated_at = NOW()
       WHERE id = $1 AND empresa_id = $2
       RETURNING *`,
      [id, req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medio de pago no encontrado' });
    }

    res.json({ message: 'Medio de pago eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
