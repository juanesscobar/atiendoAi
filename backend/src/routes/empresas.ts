import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/empresas/mi-empresa
 * Obtener datos de la empresa del usuario autenticado
 */
router.get('/mi-empresa', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, descripcion, logo_url, telefono, email, direccion, ciudad, pais, 
              contexto_negocio, created_at, updated_at
       FROM empresas 
       WHERE id = $1`,
      [req.usuario.empresa_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/empresas/mi-empresa
 * Actualizar datos de la empresa
 */
router.put('/mi-empresa', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, logo_url, telefono, email, direccion, ciudad, pais, contexto_negocio } = req.body;

    const result = await pool.query(
      `UPDATE empresas 
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           logo_url = COALESCE($3, logo_url),
           telefono = COALESCE($4, telefono),
           email = COALESCE($5, email),
           direccion = COALESCE($6, direccion),
           ciudad = COALESCE($7, ciudad),
           pais = COALESCE($8, pais),
           contexto_negocio = COALESCE($9, contexto_negocio),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [nombre, descripcion, logo_url, telefono, email, direccion, ciudad, pais, contexto_negocio, req.usuario.empresa_id]
    );

    res.json({
      message: 'Empresa actualizada correctamente',
      empresa: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/empresas/contexto
 * Obtener contexto de la empresa para el bot IA
 */
router.get('/contexto', authenticateToken, async (req: Request, res: Response) => {
  try {
    const empresaResult = await pool.query(
      'SELECT nombre, descripcion, contexto_negocio FROM empresas WHERE id = $1',
      [req.usuario.empresa_id]
    );

    const productosResult = await pool.query(
      'SELECT nombre, descripcion, precio FROM productos WHERE empresa_id = $1 AND activo = true',
      [req.usuario.empresa_id]
    );

    const serviciosResult = await pool.query(
      'SELECT nombre, descripcion, precio FROM servicios WHERE empresa_id = $1 AND activo = true',
      [req.usuario.empresa_id]
    );

    const pagosResult = await pool.query(
      'SELECT metodo, alias, numero_cuenta, datos_adicionales FROM medios_pago WHERE empresa_id = $1 AND activo = true',
      [req.usuario.empresa_id]
    );

    const empresa = empresaResult.rows[0];

    res.json({
      empresa: {
        nombre: empresa.nombre,
        descripcion: empresa.descripcion,
        contexto: empresa.contexto_negocio
      },
      productos: productosResult.rows,
      servicios: serviciosResult.rows,
      medios_pago: pagosResult.rows
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
