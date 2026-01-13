# 🏗️ ARQUITECTURA TÉCNICA - IMPLEMENTACIÓN DETALLADA

**Fecha:** 13 de enero de 2026  
**Versión:** 1.0  
**Objetivo:** Guía paso-a-paso para implementar la plataforma SaaS

---

## 1. ESTRUCTURA DEL PROYECTO

```
chatbot-saas/
│
├── backend/                          # API Node.js
│   ├── src/
│   │   ├── main.ts                  # Entry point
│   │   ├── app.ts                   # Express app setup
│   │   ├── config/                  # Configuración
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   ├── openai.ts
│   │   │   └── environment.ts
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── empresas.routes.ts
│   │   │   │   ├── contactos.routes.ts
│   │   │   │   ├── conversaciones.routes.ts
│   │   │   │   ├── reservas.routes.ts
│   │   │   │   ├── pagos.routes.ts
│   │   │   │   ├── servicios.routes.ts
│   │   │   │   ├── whatsapp.routes.ts
│   │   │   │   ├── analytics.routes.ts
│   │   │   │   └── integraciones.routes.ts
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── empresas.controller.ts
│   │   │   │   └── ... (uno por ruta)
│   │   │   │
│   │   │   └── middleware/
│   │   │       ├── auth.middleware.ts
│   │   │       ├── rateLimit.middleware.ts
│   │   │       ├── errorHandler.middleware.ts
│   │   │       └── logging.middleware.ts
│   │   │
│   │   ├── services/                # Lógica de negocio
│   │   │   ├── auth.service.ts      # JWT, registro, login
│   │   │   ├── empresa.service.ts   # Gestión empresas
│   │   │   ├── contacto.service.ts  # CRUD contactos
│   │   │   ├── whatsapp.service.ts  # Conexión WhatsApp
│   │   │   ├── ia.service.ts        # OpenAI integration
│   │   │   ├── reserva.service.ts   # Gestión reservas
│   │   │   ├── pago.service.ts      # Stripe/MercadoPago
│   │   │   ├── analytics.service.ts # Métricas
│   │   │   ├── email.service.ts     # SendGrid
│   │   │   └── sms.service.ts       # Twilio
│   │   │
│   │   ├── models/
│   │   │   ├── usuario.model.ts
│   │   │   ├── empresa.model.ts
│   │   │   ├── contacto.model.ts
│   │   │   └── ... (uno por tabla)
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── encryption.ts
│   │   │
│   │   ├── jobs/                    # Tareas programadas
│   │   │   ├── recalcularMetricas.job.ts
│   │   │   ├── enviarRecordatorios.job.ts
│   │   │   └── syncWhatsApp.job.ts
│   │   │
│   │   └── types/                   # TypeScript interfaces
│   │       └── index.ts
│   │
│   ├── database/
│   │   ├── schema.sql               # Schema (ya creado)
│   │   ├── migrations/
│   │   │   ├── 001_initial.sql
│   │   │   └── 002_add_column.sql
│   │   └── seeds/
│   │       └── demo-data.sql
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── Dockerfile
│
├── frontend/                         # React/Next.js Dashboard
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── registro/page.tsx
│   │   │   └── olvide-password/page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # Sidebar + Header
│   │   │   ├── page.tsx             # Dashboard principal
│   │   │   ├── clientes/page.tsx
│   │   │   ├── conversaciones/page.tsx
│   │   │   ├── reservas/page.tsx
│   │   │   ├── pagos/page.tsx
│   │   │   ├── servicios/page.tsx
│   │   │   ├── reportes/page.tsx
│   │   │   └── configuracion/page.tsx
│   │   │
│   │   └── api/
│   │       └── webhooks/[...slug]/route.ts
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DataTable.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MetricasCard.tsx
│   │   │   ├── GraficoTendencias.tsx
│   │   │   └── ConversacionesWidget.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── FormClienteEditar.tsx
│   │   │   ├── FormServicioAgregar.tsx
│   │   │   └── FormReservaCrear.tsx
│   │   │
│   │   └── modals/
│   │       ├── ModalConectarWhatsApp.tsx
│   │       └── ModalConfirmar.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEmpresa.ts
│   │   └── useFetch.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   │
│   ├── store/
│   │   └── index.ts                 # Redux Toolkit
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── .env.local.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── nginx.conf
└── .github/
    └── workflows/
        ├── test.yml
        └── deploy.yml
```

---

## 2. CONFIGURACIÓN INICIAL

### 2.1 Variables de Entorno Backend

```bash
# .env.backend
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_saas
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=tu_super_secret_key_32_caracteres_minimo
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.xxxx...
SENDGRID_FROM_EMAIL=noreply@tudominio.com

# Twilio (SMS)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# AWS S3 (archivos)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=chatbot-saas-files

# Sentry (error tracking)
SENTRY_DSN=https://...@sentry.io/...

# WhatsApp
WHATSAPP_SESSION_PATH=./sessions
WHATSAPP_HEADLESS=true
```

### 2.2 Variables Frontend

```bash
# .env.local.frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChatBot SaaS
NEXT_PUBLIC_SENTRY_DSN=https://...
```

---

## 3. ESTRUCTURA DE ENDPOINTS API

```
# AUTENTICACIÓN
POST   /api/auth/registro                 # Crear nueva empresa + usuario
POST   /api/auth/login                    # Login
POST   /api/auth/refresh                  # Refresh token
POST   /api/auth/logout                   # Logout
POST   /api/auth/2fa/setup                # Activar 2FA
POST   /api/auth/2fa/verify               # Verificar 2FA
POST   /api/auth/olvide-password          # Solicitar reset
POST   /api/auth/reset-password           # Reset password

# EMPRESAS
GET    /api/empresas/mi-empresa           # Datos empresa actual
PUT    /api/empresas/:id                  # Actualizar datos
PUT    /api/empresas/:id/plan             # Cambiar plan
GET    /api/empresas/:id/uso              # Uso de límites

# USUARIOS
GET    /api/usuarios                      # Listar usuarios empresa
POST   /api/usuarios                      # Crear usuario
PUT    /api/usuarios/:id                  # Editar usuario
DELETE /api/usuarios/:id                  # Eliminar usuario
PUT    /api/usuarios/:id/rol              # Cambiar rol

# CONTACTOS
GET    /api/contactos                     # Listar con filtros
POST   /api/contactos                     # Crear
GET    /api/contactos/:id                 # Obtener detalle
PUT    /api/contactos/:id                 # Actualizar
DELETE /api/contactos/:id                 # Eliminar
POST   /api/contactos/importar            # Importar CSV
GET    /api/contactos/exportar            # Exportar CSV

# CONVERSACIONES
GET    /api/conversaciones                # Listar
GET    /api/conversaciones/:id            # Detalle + mensajes
PUT    /api/conversaciones/:id            # Actualizar estado
POST   /api/conversaciones/:id/asignar    # Asignar agente
POST   /api/conversaciones/:id/cerrar     # Cerrar
POST   /api/conversaciones/:id/notas      # Agregar nota

# MENSAJES
GET    /api/conversaciones/:id/mensajes   # Listar mensajes
POST   /api/conversaciones/:id/mensaje    # Enviar mensaje
GET    /api/mensajes/buscar               # Buscar en mensajes

# SERVICIOS
GET    /api/servicios                     # Listar
POST   /api/servicios                     # Crear
PUT    /api/servicios/:id                 # Actualizar
DELETE /api/servicios/:id                 # Eliminar
PUT    /api/servicios/:id/estado          # Activar/desactivar

# HORARIOS
GET    /api/horarios                      # Obtener horarios
PUT    /api/horarios/:id                  # Actualizar
POST   /api/horarios/feriados/agregar     # Agregar feriado

# RESERVAS
GET    /api/reservas                      # Listar con filtros
POST   /api/reservas                      # Crear
GET    /api/reservas/:id                  # Obtener
PUT    /api/reservas/:id                  # Actualizar
DELETE /api/reservas/:id                  # Cancelar
POST   /api/reservas/:id/confirmar        # Cliente confirma
GET    /api/reservas/calendario/mes       # Vista calendario

# PAGOS
GET    /api/pagos                         # Listar transacciones
POST   /api/pagos/crear-sesion-stripe     # Crear checkout
POST   /api/webhooks/stripe               # Webhook Stripe (público)
GET    /api/pagos/:id                     # Detalle pago
POST   /api/pagos/:id/reembolsar          # Crear reembolso

# FACTURAS
GET    /api/facturas                      # Listar
GET    /api/facturas/:id                  # Descargar PDF
POST   /api/facturas/:id/enviar           # Enviar por email

# WHATSAPP
POST   /api/whatsapp/generar-qr           # Generar QR
GET    /api/whatsapp/estado               # Estado conexión
POST   /api/whatsapp/desconectar          # Desconectar
POST   /api/webhooks/whatsapp             # Webhook recibir mensajes (público)
GET    /api/whatsapp/contactos            # Sincronizar contactos

# ESTADÍSTICAS
GET    /api/analytics/dashboard           # Métricas principales
GET    /api/analytics/conversaciones      # Gráficos conversaciones
GET    /api/analytics/ingresos            # Gráficos ingresos
GET    /api/analytics/satisfaccion        # NPS + CSAT
GET    /api/analytics/export              # Exportar reporte

# CONFIGURACIÓN
GET    /api/configuracion                 # Obtener config
PUT    /api/configuracion                 # Actualizar config
POST   /api/configuracion/notificaciones  # Guardar preferencias

# INTEGRACIONES
GET    /api/integraciones                 # Listar
POST   /api/integraciones/google-calendar # Conectar Google
POST   /api/integraciones/slack           # Conectar Slack
POST   /api/integraciones/zapier          # Conectar Zapier
DELETE /api/integraciones/:id             # Desconectar

# WEBHOOKS PERSONALIZADOS
GET    /api/webhooks                      # Listar webhooks
POST   /api/webhooks                      # Crear webhook
DELETE /api/webhooks/:id                  # Eliminar
POST   /api/webhooks/:id/test             # Probar webhook

# REPORTES
GET    /api/reportes/conversaciones       # Exportar conversaciones
GET    /api/reportes/clientes             # Exportar clientes
GET    /api/reportes/ventas               # Reportes ventas
GET    /api/reportes/comparativa          # Período a período

# ADMIN (solo super_admin)
GET    /api/admin/empresas                # Listar todas empresas
PUT    /api/admin/empresas/:id/plan       # Cambiar plan
GET    /api/admin/uso-recursos            # Monitoreo recursos
```

---

## 4. MODELOS TYPESCRIPT

```typescript
// types/index.ts

// USUARIO
export interface Usuario {
  id: string;
  empresa_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'super_admin' | 'admin' | 'owner' | 'agent' | 'client';
  estado: 'active' | 'inactive' | 'blocked';
  avatar_url?: string;
  ultimo_login?: Date;
  creado_en: Date;
}

// EMPRESA
export interface Empresa {
  id: string;
  nombre: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  estado: 'active' | 'trial' | 'suspended';
  limite_contactos: number;
  limite_mensajes_mes: number;
  uso_contactos: number;
  uso_mensajes_mes: number;
}

// CONTACTO
export interface Contacto {
  id: string;
  empresa_id: string;
  nombre: string;
  numero_whatsapp: string;
  email?: string;
  tipo: 'cliente' | 'prospecto' | 'cliente_vip';
  total_conversaciones: number;
  total_gastos: number;
  ultima_compra_fecha?: Date;
  creado_en: Date;
}

// CONVERSACIÓN
export interface Conversacion {
  id: string;
  empresa_id: string;
  contacto_id: string;
  numero_whatsapp: string;
  tema: 'venta' | 'soporte' | 'consulta';
  estado: 'abierta' | 'en_progreso' | 'cerrada';
  agente_asignado_id?: string;
  mensajes_count: number;
  compra_realizada: boolean;
  creado_en: Date;
}

// MENSAJE
export interface Mensaje {
  id: string;
  conversacion_id: string;
  remitente_tipo: 'cliente' | 'bot' | 'agente';
  contenido: string;
  intension_detectada: string;
  confianza_intencion: number;
  creado_en: Date;
}

// SERVICIO
export interface Servicio {
  id: string;
  empresa_id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_minutos: number;
  activo: boolean;
}

// RESERVA
export interface Reserva {
  id: string;
  contacto_id: string;
  servicio_id: string;
  fecha_reserva: Date;
  duracion_minutos: number;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  agente_asignado_id?: string;
}

// PAGO
export interface Pago {
  id: string;
  contacto_id: string;
  monto: number;
  metodo_pago: 'stripe' | 'mercadopago' | 'efectivo';
  estado: 'pendiente' | 'completado' | 'fallido';
  creado_en: Date;
}

// REQUEST/RESPONSE
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  mensaje?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagina: number;
  paginas_total: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  usuario: Usuario;
  empresa: Empresa;
}

export interface RegistroRequest {
  empresa_nombre: string;
  usuario_email: string;
  usuario_nombre: string;
  usuario_apellido: string;
  password: string;
}
```

---

## 5. SERVICIOS PRINCIPALES

### 5.1 Auth Service

```typescript
// services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  
  async registro(datos: RegistroRequest) {
    // 1. Validar email único
    const existente = await db.usuarios.findOne({ email: datos.usuario_email });
    if (existente) throw new Error('Email ya registrado');
    
    // 2. Crear empresa
    const empresa = await db.empresas.create({
      nombre: datos.empresa_nombre,
      plan: 'free',
      estado: 'active'
    });
    
    // 3. Crear usuario
    const password_hash = await bcrypt.hash(datos.password, 10);
    const usuario = await db.usuarios.create({
      empresa_id: empresa.id,
      email: datos.usuario_email,
      nombre: datos.usuario_nombre,
      apellido: datos.usuario_apellido,
      password_hash,
      rol: 'owner',
      estado: 'active'
    });
    
    // 4. Enviar email de confirmación
    await this.emailService.enviarVerificacion(usuario);
    
    // 5. Generar tokens
    return this.generarTokens(usuario, empresa);
  }
  
  async login(email: string, password: string) {
    // 1. Buscar usuario
    const usuario = await db.usuarios.findOne({ email });
    if (!usuario) throw new Error('Credenciales inválidas');
    
    // 2. Validar contraseña
    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) throw new Error('Credenciales inválidas');
    
    // 3. Obtener empresa
    const empresa = await db.empresas.findById(usuario.empresa_id);
    
    // 4. Actualizar último login
    await db.usuarios.update(usuario.id, { ultimo_login: new Date() });
    
    // 5. Generar tokens
    return this.generarTokens(usuario, empresa);
  }
  
  private generarTokens(usuario: Usuario, empresa: Empresa) {
    const accessToken = jwt.sign(
      {
        sub: usuario.id,
        empresa_id: empresa.id,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    const refreshToken = jwt.sign(
      { sub: usuario.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
    
    return { accessToken, refreshToken, usuario, empresa };
  }
}
```

### 5.2 WhatsApp Service

```typescript
// services/whatsapp.service.ts
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import redis from './redis';

export class WhatsAppService {
  private clients: Map<string, Client> = new Map();
  
  async generarQR(empresaId: string) {
    const sessionId = `empresa_${empresaId}`;
    
    // Crear cliente
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionId,
        dataPath: process.env.WHATSAPP_SESSION_PATH
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    
    return new Promise((resolve, reject) => {
      client.on('qr', async (qr) => {
        // Generar QR en formato PNG
        const qrImg = await qrcode.toDataURL(qr);
        
        // Guardar en Redis (expira en 5 minutos)
        await redis.setex(
          `whatsapp_qr_${empresaId}`,
          300,
          qrImg
        );
        
        resolve(qrImg);
      });
      
      client.on('ready', async () => {
        // Guardar conexión
        this.clients.set(empresaId, client);
        
        // Actualizar BD
        await db.whatsapp_conexiones.update({
          empresa_id: empresaId
        }, {
          estado: 'activa',
          fecha_conexion: new Date()
        });
        
        // Escuchar mensajes
        this.setupMessageListener(empresaId, client);
      });
      
      client.on('auth_failure', reject);
      client.on('disconnected', () => {
        this.clients.delete(empresaId);
      });
      
      client.initialize();
    });
  }
  
  private setupMessageListener(empresaId: string, client: Client) {
    client.on('message', async (msg) => {
      try {
        // Filtrar grupos
        const chat = await msg.getChat();
        if (chat.isGroup) return;
        
        // Obtener contacto
        const numero = msg.from;
        let contacto = await db.contactos.findOne({
          empresa_id: empresaId,
          numero_whatsapp: numero
        });
        
        // Crear si no existe
        if (!contacto) {
          contacto = await db.contactos.create({
            empresa_id: empresaId,
            nombre: msg.author || 'Desconocido',
            numero_whatsapp: numero,
            tipo: 'prospecto'
          });
        }
        
        // Crear/obtener conversación
        let conversacion = await db.conversaciones.findOne({
          empresa_id: empresaId,
          numero_whatsapp: numero,
          estado: { $in: ['abierta', 'en_progreso'] }
        });
        
        if (!conversacion) {
          conversacion = await db.conversaciones.create({
            empresa_id: empresaId,
            contacto_id: contacto.id,
            numero_whatsapp: numero,
            tema: 'consulta',
            estado: 'abierta'
          });
        }
        
        // Guardar mensaje
        const mensaje = await db.mensajes.create({
          conversacion_id: conversacion.id,
          empresa_id: empresaId,
          remitente_tipo: 'cliente',
          contenido: msg.body,
          creado_en: new Date()
        });
        
        // Procesar con IA
        const respuestaIA = await this.procesarConIA(
          empresaId,
          msg.body,
          contacto,
          conversacion
        );
        
        // Enviar respuesta
        await client.sendMessage(numero, respuestaIA);
        
        // Registrar respuesta del bot
        await db.mensajes.create({
          conversacion_id: conversacion.id,
          empresa_id: empresaId,
          remitente_tipo: 'bot',
          contenido: respuestaIA,
          creado_en: new Date()
        });
        
      } catch (error) {
        console.error('Error procesando mensaje:', error);
      }
    });
  }
  
  private async procesarConIA(
    empresaId: string,
    mensaje: string,
    contacto: any,
    conversacion: any
  ) {
    try {
      // Obtener contexto del negocio
      const empresa = await db.empresas.findById(empresaId);
      const servicios = await db.servicios.find({ empresa_id: empresaId });
      
      // Llamar a OpenAI
      const respuesta = await openaiService.getResponse({
        userMessage: mensaje,
        businessContext: {
          nombre_empresa: empresa.nombre,
          servicios: servicios,
          horarios: empresa
        },
        contactoInfo: {
          nombre: contacto.nombre,
          historial_compras: contacto.total_gastos
        }
      });
      
      return respuesta;
    } catch (error) {
      return 'Lo siento, estoy experimentando un problema. Por favor intenta más tarde.';
    }
  }
}
```

### 5.3 Analytics Service

```typescript
// services/analytics.service.ts
export class AnalyticsService {
  
  async getDashboardMetrics(empresaId: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const metricas = await db.query(`
      SELECT
        COUNT(DISTINCT CASE WHEN remitente_tipo = 'cliente' THEN conversacion_id END) as conversaciones_hoy,
        COUNT(CASE WHEN remitente_tipo = 'cliente' THEN 1 END) as mensajes_recibidos,
        COUNT(CASE WHEN remitente_tipo = 'bot' THEN 1 END) as mensajes_bot,
        AVG(EXTRACT(EPOCH FROM (actualizado_en - creado_en))) as tiempo_respuesta_promedio
      FROM mensajes
      WHERE empresa_id = $1 AND DATE(creado_en) = $2
    `, [empresaId, hoy]);
    
    const ventas = await db.query(`
      SELECT
        COUNT(*) as reservas_total,
        COUNT(CASE WHEN estado = 'confirmada' THEN 1 END) as reservas_confirmadas,
        COALESCE(SUM(CASE WHEN p.estado = 'completado' THEN p.monto ELSE 0 END), 0) as ingresos_hoy
      FROM reservas r
      LEFT JOIN pagos p ON r.id = p.reserva_id
      WHERE r.empresa_id = $1 AND DATE(r.fecha_reserva) = $2
    `, [empresaId, hoy]);
    
    const satisfaccion = await db.query(`
      SELECT
        COUNT(*) as calificaciones,
        AVG(calificacion_cliente)::decimal(3,2) as promedio
      FROM conversaciones
      WHERE empresa_id = $1 
        AND calificacion_cliente IS NOT NULL
        AND DATE(actualizado_en) = $2
    `, [empresaId, hoy]);
    
    return {
      conversaciones: metricas[0],
      ventas: ventas[0],
      satisfaccion: satisfaccion[0],
      fecha: hoy
    };
  }
  
  async getGraficoTendencias(empresaId: string, dias: number = 30) {
    return await db.query(`
      SELECT
        DATE(fecha) as fecha,
        mensajes_recibidos,
        conversaciones_nuevas,
        ingresos_dia,
        satisfaccion_promedio
      FROM metricas_diarias
      WHERE empresa_id = $1
        AND fecha >= CURRENT_DATE - INTERVAL '$2 days'
      ORDER BY fecha ASC
    `, [empresaId, dias]);
  }
}
```

---

## 6. FLUJO DE MENSAJES

```
┌─────────────────────────────────────────────────────────┐
│  CLIENTE ENVÍA MENSAJE POR WHATSAPP                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Recibir en servidor  │
        │ (whatsapp-web.js)    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ 1. Crear/obtener contacto    │
        │ 2. Crear/obtener conversación│
        │ 3. Guardar mensaje cliente   │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Detectar intención (IA)      │
        │ - Pricing                    │
        │ - Reserva                    │
        │ - Info                       │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Construir contexto negocio   │
        │ - Servicios                  │
        │ - Horarios                   │
        │ - Historial cliente          │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Llamar a OpenAI API          │
        │ (system + historial + user)  │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Recibir respuesta IA         │
        │ Guardar en BD                │
        │ Registrar tokens utilizados  │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Enviar respuesta por WhatsApp│
        │ Guardar mensaje bot          │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Actualizar métricas          │
        │ - Tokens utilizados          │
        │ - Tiempo respuesta           │
        │ - Intent detectado           │
        └──────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Disparar webhooks            │
        │ - Notificar a agentes        │
        │ - Sincronizar CRM            │
        └──────────────────────────────┘
```

---

## 7. SEGURIDAD: CHECKLIST

```
AUTENTICACIÓN
☑ JWT con firma RS256
☑ Refresh token con rotación
☑ 2FA email obligatorio para admins
☑ Rate limiting: 5 intentos fallidos = bloqueo 15 min
☑ Hashing bcrypt con salt 10

AUTORIZACIÓN  
☑ RBAC (5 roles: super_admin, admin, owner, agent, client)
☑ Row Level Security en PostgreSQL
☑ Validar empresa_id en cada request
☑ No exponer datos entre empresas

ENCRIPTACIÓN
☑ HTTPS/TLS 1.3 obligatorio
☑ API keys encriptadas en DB (AES-256)
☑ Tokens WhatsApp encriptados
☑ Contraseñas con bcrypt (nunca plain)

VALIDACIÓN
☑ Zod schemas en todas las requests
☑ Sanitizar inputs (XSS prevention)
☑ CSRF tokens para cambios críticos
☑ Rate limiting por IP y usuario

LOGGING
☑ Audit trail de todas las acciones
☑ No loguear contraseñas o tokens
☑ Mantener logs por 90 días
☑ Alertas para acciones sospechosas

PRIVACIDAD
☑ GDPR: derecho al olvido implementado
☑ Consentimiento explícito guardado
☑ Datos anonimizados en reportes
☑ Segregación de datos por tenant
```

---

## 8. DEPLOYMENT CHECKLIST

```
PRE-PRODUCCIÓN
☑ Todos los tests pasando
☑ Code review completado
☑ Security audit realizado
☑ Performance testing ok
☑ Backup strategy definida
☑ Monitoring configurado
☑ Error tracking (Sentry)
☑ CDN configurado

INFRAESTRUCTURA
☑ DNS apuntado
☑ SSL/TLS certificado
☑ Database backups automáticos
☑ Redis persistencia
☑ Logs centralizados (CloudWatch/ELK)
☑ Health checks configurados
☑ Auto-scaling rules

DOCUMENTACIÓN
☑ README actualizado
☑ API docs en Swagger
☑ Setup guide para onboarding
☑ Troubleshooting guide
☑ Runbook para incidents
☑ Database schema documentado

MONITOREO
☑ Dashboard Grafana creado
☑ Alertas en Slack configuradas
☑ Uptime monitoring
☑ Cost monitoring AWS
☑ Database query performance
☑ API response times
```

---

## 9. PRÓXIMOS COMANDOS

```bash
# 1. Crear estructura del proyecto
mkdir -p chatbot-saas/{backend,frontend}
cd chatbot-saas

# 2. Inicializar repositorio
git init
git add .
git commit -m "Initial commit"

# 3. Backend setup
cd backend
npm init -y
npm install express typescript ts-node @types/node @types/express
npm install pg redis bcryptjs jsonwebtoken zod
npm install openai stripe sendgrid-mail twilio
npm install dotenv winston
npm install -D vitest @testing-library/react playwright

# 4. Frontend setup  
cd ../frontend
npx create-next-app@latest --typescript --tailwind
npm install axios redux @reduxjs/toolkit react-query

# 5. Docker setup
docker-compose up -d

# 6. Deploy
git push origin main
# ... pipeline automático ejecuta tests y deploy
```

---

**¿Quieres que inicie la implementación de alguna sección específica?**

Ejemplo: "Implementa el backend con autenticación JWT"
