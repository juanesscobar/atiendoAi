import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../index';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  empresa_id: string;
  rol: string;
  activo: boolean;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  nombre: string;
  nombre_empresa: string;
}

export class AuthService {
  /**
   * Registrar nuevo usuario y empresa
   */
  static async register(data: RegisterPayload) {
    try {
      // Verificar si email ya existe
      const emailExists = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1',
        [data.email]
      );

      if (emailExists.rows.length > 0) {
        throw { status: 400, message: 'Email ya registrado' };
      }

      // Hash de contraseña
      const hashedPassword = await bcryptjs.hash(data.password, 10);

      // Iniciar transacción
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // 1. Crear empresa
        const empresaResult = await client.query(
          `INSERT INTO empresas (nombre, created_at) 
           VALUES ($1, NOW()) 
           RETURNING id, nombre`,
          [data.nombre_empresa]
        );
        const empresa_id = empresaResult.rows[0].id;

        // 2. Crear usuario
        const usuarioResult = await client.query(
          `INSERT INTO usuarios (email, password, nombre, empresa_id, rol, activo, created_at) 
           VALUES ($1, $2, $3, $4, $5, true, NOW()) 
           RETURNING id, email, nombre, empresa_id, rol`,
          [data.email, hashedPassword, data.nombre, empresa_id, 'admin']
        );

        await client.query('COMMIT');

        const usuario = usuarioResult.rows[0];

        // Generar JWT
        const token = jwt.sign(
          { id: usuario.id, email: usuario.email, empresa_id: usuario.empresa_id },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
        );

        return {
          usuario: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            empresa_id: usuario.empresa_id,
            rol: usuario.rol
          },
          token,
          empresa: { id: empresa_id, nombre: data.nombre_empresa }
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Login con email y contraseña
   */
  static async login(data: LoginPayload) {
    try {
      // Buscar usuario
      const result = await pool.query(
        `SELECT id, email, password, nombre, empresa_id, rol, activo 
         FROM usuarios 
         WHERE email = $1 AND activo = true`,
        [data.email]
      );

      if (result.rows.length === 0) {
        throw { status: 401, message: 'Email o contraseña incorrectos' };
      }

      const usuario = result.rows[0];

      // Verificar contraseña
      const isPasswordValid = await bcryptjs.compare(data.password, usuario.password);
      if (!isPasswordValid) {
        throw { status: 401, message: 'Email o contraseña incorrectos' };
      }

      // Generar JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, empresa_id: usuario.empresa_id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      // Obtener datos de empresa
      const empresaResult = await pool.query(
        'SELECT id, nombre FROM empresas WHERE id = $1',
        [usuario.empresa_id]
      );

      return {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          empresa_id: usuario.empresa_id,
          rol: usuario.rol
        },
        token,
        empresa: empresaResult.rows[0]
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Verificar JWT y retornar usuario
   */
  static async verifyToken(token: string): Promise<Usuario> {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      const result = await pool.query(
        'SELECT id, email, nombre, empresa_id, rol, activo FROM usuarios WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        throw { status: 401, message: 'Usuario no encontrado' };
      }

      return result.rows[0];
    } catch (error: any) {
      throw { status: 401, message: 'Token inválido o expirado' };
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      const result = await pool.query(
        'SELECT password FROM usuarios WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw { status: 404, message: 'Usuario no encontrado' };
      }

      const isPasswordValid = await bcryptjs.compare(oldPassword, result.rows[0].password);
      if (!isPasswordValid) {
        throw { status: 401, message: 'Contraseña actual incorrecta' };
      }

      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      await pool.query(
        'UPDATE usuarios SET password = $1 WHERE id = $2',
        [hashedPassword, userId]
      );

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error: any) {
      throw error;
    }
  }
}
