-- ============================================================
-- SCHEMA B2B CHATBOT SaaS - PostgreSQL 15+
-- Optimizado para multi-tenant, seguridad y escalabilidad
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- para full-text search

-- ============================================================
-- 1. ESQUEMA DE USUARIOS Y AUTENTICACIÓN
-- ============================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'owner', 'agent', 'client');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'blocked', 'pending_email');
CREATE TYPE empresa_plan AS ENUM ('free', 'starter', 'professional', 'enterprise');
CREATE TYPE empresa_status AS ENUM ('active', 'trial', 'suspended', 'cancelled');

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol user_role NOT NULL DEFAULT 'agent',
  estado user_status NOT NULL DEFAULT 'pending_email',
  avatar_url VARCHAR(500),
  telefono VARCHAR(20),
  ultimo_login TIMESTAMP WITH TIME ZONE,
  email_verificado BOOLEAN DEFAULT false,
  fecha_verificacion_email TIMESTAMP WITH TIME ZONE,
  token_2fa_secret VARCHAR(32),
  mfa_habilitado BOOLEAN DEFAULT false,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  eliminado_en TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_usuarios_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  logo_url VARCHAR(500),
  website VARCHAR(500),
  telefono_principal VARCHAR(20),
  email_contacto VARCHAR(255),
  
  -- Plan y suscripción
  plan empresa_plan NOT NULL DEFAULT 'free',
  estado empresa_status NOT NULL DEFAULT 'active',
  limite_contactos INTEGER NOT NULL DEFAULT 100,
  limite_mensajes_mes INTEGER NOT NULL DEFAULT 1000,
  limite_whatsapp_conexiones INTEGER NOT NULL DEFAULT 1,
  limite_agentes INTEGER NOT NULL DEFAULT 2,
  
  -- Facturación
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  fecha_proximo_pago TIMESTAMP WITH TIME ZONE,
  
  -- Período de prueba
  fecha_inicio_trial TIMESTAMP WITH TIME ZONE,
  dias_trial_restantes INTEGER DEFAULT 14,
  
  -- Datos de negocio
  horario_atencion_inicio TIME,
  horario_atencion_fin TIME,
  dias_atencion VARCHAR(7) DEFAULT '1111100', -- lun-dom
  timezone VARCHAR(50) DEFAULT 'UTC',
  pais VARCHAR(100),
  ciudad VARCHAR(100),
  moneda VARCHAR(3) DEFAULT 'USD',
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  eliminado_en TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE sesiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL,
  token_refresh VARCHAR(500) NOT NULL,
  ip_address INET,
  user_agent VARCHAR(500),
  fecha_vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
  activa BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ============================================================
-- 2. GESTIÓN DE SERVICIOS
-- ============================================================

CREATE TABLE servicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  precio DECIMAL(10, 2),
  moneda VARCHAR(3) DEFAULT 'USD',
  duracion_minutos INTEGER,
  imagen_url VARCHAR(500),
  icono_emoji VARCHAR(10),
  
  -- Restricciones de disponibilidad
  reservable BOOLEAN DEFAULT true,
  requiere_pago BOOLEAN DEFAULT false,
  max_clientes_simultaneos INTEGER DEFAULT 1,
  
  -- Opciones avanzadas
  precio_dinamico BOOLEAN DEFAULT false,
  comision_porcentaje DECIMAL(5, 2),
  
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_servicios_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT precio_positivo CHECK (precio IS NULL OR precio >= 0)
);

CREATE TABLE horarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  servicio_id UUID,
  
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=domingo
  hora_apertura TIME NOT NULL,
  hora_cierre TIME NOT NULL,
  intervalo_reserva_minutos INTEGER NOT NULL DEFAULT 30,
  agentes_disponibles INTEGER NOT NULL DEFAULT 1,
  
  es_feriado BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_horarios_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_horarios_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

-- ============================================================
-- 3. GESTIÓN DE CLIENTES Y CONTACTOS
-- ============================================================

CREATE TYPE tipo_contacto AS ENUM ('cliente', 'prospecto', 'cliente_vip', 'bloqueado', 'competencia');
CREATE TYPE fuente_contacto AS ENUM ('whatsapp', 'telefono', 'email', 'manual', 'importacion', 'campana');

CREATE TABLE contactos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  
  -- Información personal
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  numero_whatsapp VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  telefono VARCHAR(20),
  
  -- Clasificación
  tipo tipo_contacto NOT NULL DEFAULT 'prospecto',
  fuente fuente_contacto NOT NULL DEFAULT 'whatsapp',
  etiquetas VARCHAR(100)[], -- tags para segmentación
  
  -- Datos demográficos
  ciudad VARCHAR(100),
  pais VARCHAR(100),
  genero VARCHAR(20),
  cumpleaños DATE,
  edad INTEGER,
  
  -- Scoring y comportamiento
  score_potencial INTEGER DEFAULT 0 CHECK (score_potencial >= 0 AND score_potencial <= 100),
  interes_nivel VARCHAR(20),
  
  -- Comunicación
  permite_marketing BOOLEAN DEFAULT true,
  permite_whatsapp BOOLEAN DEFAULT true,
  permite_sms BOOLEAN DEFAULT false,
  permite_email BOOLEAN DEFAULT true,
  
  -- Estadísticas
  total_conversaciones INTEGER DEFAULT 0,
  total_gastos DECIMAL(10, 2) DEFAULT 0,
  ultima_compra_fecha DATE,
  
  -- Relación
  agente_asignado_id UUID,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_contacto TIMESTAMP WITH TIME ZONE,
  eliminado_en TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_contactos_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_contactos_agente FOREIGN KEY (agente_asignado_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_contactos_empresa_whatsapp ON contactos(empresa_id, numero_whatsapp);
CREATE INDEX idx_contactos_empresa_email ON contactos(empresa_id, email);
CREATE INDEX idx_contactos_tipo ON contactos(empresa_id, tipo);
CREATE INDEX idx_contactos_etiquetas ON contactos USING GIN(etiquetas);

-- ============================================================
-- 4. CONVERSACIONES Y MENSAJES
-- ============================================================

CREATE TYPE tema_conversacion AS ENUM ('venta', 'soporte', 'consulta', 'queja', 'info_servicio', 'pago', 'otro');
CREATE TYPE estado_conversacion AS ENUM ('abierta', 'en_progreso', 'cerrada', 'archivada', 'spam');
CREATE TYPE tipo_mensaje AS ENUM ('texto', 'imagen', 'archivo', 'ubicacion', 'template', 'sistema');

CREATE TABLE conversaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  contacto_id UUID NOT NULL,
  numero_whatsapp VARCHAR(20) NOT NULL,
  
  tema tema_conversacion NOT NULL DEFAULT 'consulta',
  estado estado_conversacion NOT NULL DEFAULT 'abierta',
  prioridad INTEGER DEFAULT 0 CHECK (prioridad >= -2 AND prioridad <= 2),
  
  agente_asignado_id UUID,
  agente_anterior_id UUID,
  
  etiquetas VARCHAR(50)[],
  notas TEXT,
  
  -- Estadísticas
  mensajes_count INTEGER DEFAULT 0,
  mensajes_sin_leer INTEGER DEFAULT 0,
  tiempo_respuesta_promedio_seg INTEGER,
  
  -- Métricas
  intento_reserva BOOLEAN DEFAULT false,
  intento_compra BOOLEAN DEFAULT false,
  compra_realizada BOOLEAN DEFAULT false,
  monto_reserva DECIMAL(10, 2),
  monto_compra DECIMAL(10, 2),
  
  -- Resolución
  resuelto BOOLEAN DEFAULT false,
  razon_cierre VARCHAR(100),
  calificacion_cliente INTEGER CHECK (calificacion_cliente IS NULL OR (calificacion_cliente >= 1 AND calificacion_cliente <= 5)),
  feedback_cliente TEXT,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cerrado_en TIMESTAMP WITH TIME ZONE,
  ultimo_mensaje TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_conversaciones_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_conversaciones_contacto FOREIGN KEY (contacto_id) REFERENCES contactos(id),
  CONSTRAINT fk_conversaciones_agente FOREIGN KEY (agente_asignado_id) REFERENCES usuarios(id),
  CONSTRAINT fk_conversaciones_agente_ant FOREIGN KEY (agente_anterior_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_conversaciones_empresa ON conversaciones(empresa_id, estado);
CREATE INDEX idx_conversaciones_contacto ON conversaciones(contacto_id);
CREATE INDEX idx_conversaciones_agente ON conversaciones(agente_asignado_id);
CREATE INDEX idx_conversaciones_creado ON conversaciones(empresa_id, creado_en DESC);

CREATE TABLE mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversacion_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  
  -- Remitente
  remitente_tipo VARCHAR(20) NOT NULL, -- 'cliente', 'bot', 'agente', 'sistema'
  remitente_id UUID,
  remitente_nombre VARCHAR(100),
  
  -- Contenido
  contenido TEXT NOT NULL,
  tipo_mensaje tipo_mensaje NOT NULL DEFAULT 'texto',
  url_archivo VARCHAR(500),
  
  -- Intención detectada (IA)
  intension_detectada VARCHAR(100),
  confianza_intencion DECIMAL(3, 2),
  entidades_detectadas JSONB, -- JSON con entidades extraídas
  
  -- IA Metrics
  tokens_utilizados INTEGER DEFAULT 0,
  tiempo_procesamiento_ms INTEGER,
  modelo_ia_usado VARCHAR(50),
  
  -- Estado
  leido BOOLEAN DEFAULT false,
  fecha_lectura TIMESTAMP WITH TIME ZONE,
  enviado_correctamente BOOLEAN DEFAULT true,
  error_envio VARCHAR(500),
  id_whatsapp_externo VARCHAR(255), -- para sincronización
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_mensajes_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id),
  CONSTRAINT fk_mensajes_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_mensajes_remitente FOREIGN KEY (remitente_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_mensajes_conversacion ON mensajes(conversacion_id, creado_en DESC);
CREATE INDEX idx_mensajes_empresa ON mensajes(empresa_id, creado_en DESC);
CREATE INDEX idx_mensajes_intension ON mensajes(intension_detectada);
CREATE INDEX idx_mensajes_sin_leer ON mensajes(empresa_id, leido) WHERE leido = false;

-- ============================================================
-- 5. RESERVAS Y CITAS
-- ============================================================

CREATE TYPE estado_reserva AS ENUM ('confirmada', 'pendiente', 'cancelada', 'completada', 'no_presentado', 'reprogramada');

CREATE TABLE reservas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  contacto_id UUID NOT NULL,
  conversacion_id UUID,
  
  servicio_id UUID NOT NULL,
  agente_asignado_id UUID,
  
  fecha_reserva TIMESTAMP WITH TIME ZONE NOT NULL,
  duracion_minutos INTEGER NOT NULL,
  fecha_fin_estimada TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS 
    (fecha_reserva + INTERVAL '1 minute' * duracion_minutos) STORED,
  
  estado estado_reserva NOT NULL DEFAULT 'pendiente',
  
  -- Confirmaciones
  confirmada_por_cliente BOOLEAN DEFAULT false,
  fecha_confirmacion_cliente TIMESTAMP WITH TIME ZONE,
  recordatorio_enviado_24h BOOLEAN DEFAULT false,
  recordatorio_enviado_1h BOOLEAN DEFAULT false,
  
  -- Completación
  completada BOOLEAN DEFAULT false,
  duracion_real_minutos INTEGER,
  notas_interna TEXT,
  calificacion_cliente INTEGER CHECK (calificacion_cliente IS NULL OR (calificacion_cliente >= 1 AND calificacion_cliente <= 5)),
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_reservas_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_reservas_contacto FOREIGN KEY (contacto_id) REFERENCES contactos(id),
  CONSTRAINT fk_reservas_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id),
  CONSTRAINT fk_reservas_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id),
  CONSTRAINT fk_reservas_agente FOREIGN KEY (agente_asignado_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_reservas_empresa ON reservas(empresa_id, fecha_reserva);
CREATE INDEX idx_reservas_contacto ON reservas(contacto_id);
CREATE INDEX idx_reservas_agente ON reservas(agente_asignado_id);
CREATE INDEX idx_reservas_proximas ON reservas(empresa_id, fecha_reserva) 
  WHERE estado IN ('confirmada', 'pendiente', 'completada');

-- ============================================================
-- 6. PAGOS Y FACTURACIÓN
-- ============================================================

CREATE TYPE metodo_pago AS ENUM ('whatsapp_pay', 'mercadopago', 'stripe', 'transferencia_bancaria', 'efectivo', 'otro');
CREATE TYPE estado_pago AS ENUM ('pendiente', 'procesando', 'completado', 'fallido', 'reembolsado', 'disputado');

CREATE TABLE pagos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  contacto_id UUID NOT NULL,
  conversacion_id UUID,
  reserva_id UUID,
  
  monto DECIMAL(10, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'USD',
  
  metodo_pago metodo_pago NOT NULL,
  referencia_externa VARCHAR(255), -- ID de Stripe/MercadoPago/etc
  
  estado estado_pago NOT NULL DEFAULT 'pendiente',
  
  -- Confirmación
  recepcion_confirmada BOOLEAN DEFAULT false,
  fecha_confirmacion TIMESTAMP WITH TIME ZONE,
  comprobante_url VARCHAR(500),
  
  -- Reembolso
  reembolsado BOOLEAN DEFAULT false,
  monto_reembolso DECIMAL(10, 2),
  razon_reembolso TEXT,
  fecha_reembolso TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  descripcion_pago TEXT,
  referencia_interna VARCHAR(100),
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completado_en TIMESTAMP WITH TIME ZONE,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_pagos_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_pagos_contacto FOREIGN KEY (contacto_id) REFERENCES contactos(id),
  CONSTRAINT fk_pagos_conversacion FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id),
  CONSTRAINT fk_pagos_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(id),
  CONSTRAINT monto_positivo CHECK (monto > 0)
);

CREATE INDEX idx_pagos_empresa ON pagos(empresa_id, creado_en DESC);
CREATE INDEX idx_pagos_contacto ON pagos(contacto_id);
CREATE INDEX idx_pagos_estado ON pagos(empresa_id, estado);
CREATE INDEX idx_pagos_referencia_externa ON pagos(referencia_externa);

-- ============================================================
-- 7. FACTURAS
-- ============================================================

CREATE TYPE tipo_documento AS ENUM ('factura', 'recibo', 'nota_credito', 'factura_electronica');

CREATE TABLE facturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  contacto_id UUID NOT NULL,
  pago_id UUID,
  
  numero_factura VARCHAR(50) UNIQUE NOT NULL,
  tipo_documento tipo_documento NOT NULL DEFAULT 'factura',
  
  -- Detalles
  subtotal DECIMAL(10, 2) NOT NULL,
  impuesto_porcentaje DECIMAL(5, 2),
  monto_impuesto DECIMAL(10, 2),
  descuento_porcentaje DECIMAL(5, 2),
  monto_descuento DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'USD',
  
  -- Contenido
  items JSONB NOT NULL, -- Array de items facturados
  condiciones_pago VARCHAR(100),
  notas TEXT,
  
  -- Estado
  emitida BOOLEAN DEFAULT true,
  enviada_cliente BOOLEAN DEFAULT false,
  fecha_envio TIMESTAMP WITH TIME ZONE,
  pagada BOOLEAN DEFAULT false,
  
  -- Datos fiscales
  numero_fiscal VARCHAR(50),
  cuit_empresa VARCHAR(20),
  cuit_cliente VARCHAR(20),
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_facturas_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_facturas_contacto FOREIGN KEY (contacto_id) REFERENCES contactos(id),
  CONSTRAINT fk_facturas_pago FOREIGN KEY (pago_id) REFERENCES pagos(id)
);

CREATE INDEX idx_facturas_empresa ON facturas(empresa_id, creado_en DESC);
CREATE INDEX idx_facturas_numero ON facturas(numero_factura);

-- ============================================================
-- 8. CONEXIONES WHATSAPP
-- ============================================================

CREATE TYPE proveedor_whatsapp AS ENUM ('whatsapp_web', 'api_official', 'twilio', 'messagebird');
CREATE TYPE estado_conexion AS ENUM ('activa', 'inactiva', 'desconectada', 'error', 'necesita_reauth');

CREATE TABLE whatsapp_conexiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  
  numero_whatsapp VARCHAR(20) UNIQUE NOT NULL,
  nombre_cuenta VARCHAR(100),
  
  proveedor proveedor_whatsapp NOT NULL DEFAULT 'whatsapp_web',
  estado estado_conexion NOT NULL DEFAULT 'inactiva',
  
  -- Credenciales (encriptadas)
  token_acceso VARCHAR(500) ENCRYPTED,
  token_refresh VARCHAR(500) ENCRYPTED,
  webhook_secret VARCHAR(255) ENCRYPTED,
  
  -- Información
  nombre_mostrado VARCHAR(100),
  foto_perfil_url VARCHAR(500),
  descripcion_cuenta TEXT,
  verificada BOOLEAN DEFAULT false,
  
  -- Métricas
  fecha_conexion TIMESTAMP WITH TIME ZONE,
  fecha_ultima_comunicacion TIMESTAMP WITH TIME ZONE,
  fecha_vencimiento_token TIMESTAMP WITH TIME ZONE,
  ultimo_heartbeat TIMESTAMP WITH TIME ZONE,
  
  -- Errores
  ultimo_error VARCHAR(500),
  fecha_ultimo_error TIMESTAMP WITH TIME ZONE,
  intentos_reconexion INTEGER DEFAULT 0,
  
  -- Configuración
  responder_grupos BOOLEAN DEFAULT false,
  responder_automaticos BOOLEAN DEFAULT true,
  horario_respuesta_automatica JSONB, -- horarios específicos
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  CONSTRAINT fk_whatsapp_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE INDEX idx_whatsapp_empresa ON whatsapp_conexiones(empresa_id);
CREATE INDEX idx_whatsapp_numero ON whatsapp_conexiones(numero_whatsapp);

-- ============================================================
-- 9. ESTADÍSTICAS Y MÉTRICAS
-- ============================================================

CREATE TABLE metricas_diarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  fecha DATE NOT NULL,
  
  -- Volumen
  mensajes_recibidos INTEGER DEFAULT 0,
  mensajes_respondidos INTEGER DEFAULT 0,
  conversaciones_nuevas INTEGER DEFAULT 0,
  conversaciones_activas INTEGER DEFAULT 0,
  contactos_unicos INTEGER DEFAULT 0,
  
  -- Calidad
  tiempo_respuesta_promedio_seg FLOAT DEFAULT 0,
  mensajes_sin_respuesta INTEGER DEFAULT 0,
  tasa_resolucion_ia DECIMAL(5, 2), -- % de respuestas por IA sin escalar
  escalaciones_agentes INTEGER DEFAULT 0,
  
  -- Comercial
  intentos_reserva INTEGER DEFAULT 0,
  reservas_completadas INTEGER DEFAULT 0,
  tasa_conversion_reserva DECIMAL(5, 2),
  intentos_pago INTEGER DEFAULT 0,
  pagos_completados INTEGER DEFAULT 0,
  tasa_conversion_pago DECIMAL(5, 2),
  ingresos_dia DECIMAL(10, 2) DEFAULT 0,
  
  -- IA
  tokens_utilizados INTEGER DEFAULT 0,
  tokens_presupuesto INTEGER,
  costo_ia_dia DECIMAL(10, 2) DEFAULT 0,
  
  -- Satisfacción
  calificaciones_recibidas INTEGER DEFAULT 0,
  satisfaccion_promedio DECIMAL(3, 2),
  
  -- Disponibilidad
  uptime_porcentaje DECIMAL(5, 2) DEFAULT 100,
  errores_total INTEGER DEFAULT 0,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_metricas_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT unique_metricas_fecha UNIQUE (empresa_id, fecha)
);

CREATE INDEX idx_metricas_empresa_fecha ON metricas_diarias(empresa_id, fecha DESC);

-- Tabla agregada mensual
CREATE TABLE metricas_mensuales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  anno INTEGER NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  
  mensajes_total INTEGER DEFAULT 0,
  conversaciones_total INTEGER DEFAULT 0,
  contactos_nuevos INTEGER DEFAULT 0,
  
  reservas_total INTEGER DEFAULT 0,
  pagos_total INTEGER DEFAULT 0,
  ingresos_total DECIMAL(10, 2) DEFAULT 0,
  
  tiempo_respuesta_promedio_seg FLOAT DEFAULT 0,
  satisfaccion_promedio DECIMAL(3, 2),
  
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_metricas_m_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT unique_metricas_mes UNIQUE (empresa_id, anno, mes)
);

-- ============================================================
-- 10. AUDITORÍA Y LOGS
-- ============================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  usuario_id UUID,
  
  tabla_afectada VARCHAR(100) NOT NULL,
  accion VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE, SELECT (auditoría)
  registro_id UUID,
  
  datos_previos JSONB,
  datos_nuevos JSONB,
  cambios_resumido TEXT, -- resumen en texto legible
  
  -- Contexto
  ip_address INET,
  user_agent VARCHAR(500),
  metodo_http VARCHAR(10),
  endpoint VARCHAR(500),
  status_code INTEGER,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_audit_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  CONSTRAINT fk_audit_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_audit_empresa ON audit_log(empresa_id, creado_en DESC);
CREATE INDEX idx_audit_tabla ON audit_log(tabla_afectada, creado_en DESC);
CREATE INDEX idx_audit_usuario ON audit_log(usuario_id, creado_en DESC);

-- ============================================================
-- 11. CONFIGURACIÓN Y PLANTILLAS
-- ============================================================

CREATE TABLE plantillas_respuesta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50), -- bienvenida, despedida, info_servicio, etc
  
  contenido TEXT NOT NULL,
  variables_placeholder VARCHAR(50)[], -- {{nombre}}, {{servicio}}, etc
  
  casos_uso VARCHAR(100)[], -- cuándo usar esta plantilla
  
  activa BOOLEAN DEFAULT true,
  contador_uso INTEGER DEFAULT 0,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_plantillas_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

-- ============================================================
-- 12. INTEGRACIONES
-- ============================================================

CREATE TYPE tipo_integracion AS ENUM ('calendario', 'crm', 'pago', 'email', 'sms', 'notificacion', 'otro');
CREATE TYPE estado_integracion AS ENUM ('conectada', 'desconectada', 'error', 'requiere_reauthenticacion');

CREATE TABLE integraciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  
  tipo_integracion tipo_integracion NOT NULL,
  nombre VARCHAR(100) NOT NULL, -- 'Google Calendar', 'Stripe', etc
  
  estado estado_integracion NOT NULL DEFAULT 'desconectada',
  
  -- Credenciales (encriptadas)
  credenciales JSONB ENCRYPTED,
  
  -- Webhook
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255) ENCRYPTED,
  webhook_activo BOOLEAN DEFAULT true,
  
  -- Configuración
  configuracion JSONB DEFAULT '{}',
  
  -- Última actividad
  ultimo_sync TIMESTAMP WITH TIME ZONE,
  errores_recientes JSONB, -- último error
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_integraciones_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE INDEX idx_integraciones_empresa ON integraciones(empresa_id, tipo_integracion);

-- ============================================================
-- 13. WEBHOOKS PERSONALIZADOS
-- ============================================================

CREATE TYPE evento_webhook AS ENUM (
  'mensaje_recibido',
  'mensaje_respondido',
  'reserva_creada',
  'reserva_confirmada',
  'pago_completado',
  'contacto_creado',
  'conversacion_cerrada'
);

CREATE TABLE webhooks_personalizados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL,
  
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  
  url_destino VARCHAR(500) NOT NULL,
  evento_trigger evento_webhook NOT NULL,
  
  headers_personalizados JSONB, -- headers adicionales
  
  activo BOOLEAN DEFAULT true,
  requiere_autenticacion BOOLEAN DEFAULT true,
  
  -- Estadísticas
  intentos_total INTEGER DEFAULT 0,
  intentos_exitosos INTEGER DEFAULT 0,
  ultimo_intento TIMESTAMP WITH TIME ZONE,
  
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_webhooks_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

-- ============================================================
-- 14. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo (adaptar según tu lógica)
CREATE POLICY "usuarios_ven_su_empresa"
  ON usuarios FOR SELECT
  USING (empresa_id = current_setting('app.empresa_id')::uuid);

CREATE POLICY "contactos_solo_empresa"
  ON contactos FOR SELECT
  USING (empresa_id = current_setting('app.empresa_id')::uuid);

CREATE POLICY "conversaciones_solo_empresa"
  ON conversaciones FOR SELECT
  USING (empresa_id = current_setting('app.empresa_id')::uuid);

-- ============================================================
-- 15. FUNCIONES Y TRIGGERS
-- ============================================================

-- Trigger para actualizar actualizado_en
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_usuarios_timestamp
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_contactos_timestamp
  BEFORE UPDATE ON contactos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trigger_conversaciones_timestamp
  BEFORE UPDATE ON conversaciones
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp();

-- Función para recalcular métricas diarias
CREATE OR REPLACE FUNCTION recalcular_metricas_dia(p_empresa_id UUID, p_fecha DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO metricas_diarias (
    empresa_id, fecha,
    mensajes_recibidos, mensajes_respondidos,
    conversaciones_nuevas, contactos_unicos,
    ingresos_dia
  )
  SELECT
    p_empresa_id,
    p_fecha,
    COUNT(CASE WHEN remitente_tipo = 'cliente' THEN 1 END),
    COUNT(CASE WHEN remitente_tipo != 'cliente' THEN 1 END),
    COUNT(DISTINCT CASE WHEN c.creado_en::date = p_fecha THEN c.id END),
    COUNT(DISTINCT contacto_id),
    COALESCE(SUM(CASE WHEN p.estado = 'completado' THEN p.monto ELSE 0 END), 0)
  FROM mensajes m
  LEFT JOIN conversaciones c ON m.conversacion_id = c.id
  LEFT JOIN pagos p ON m.empresa_id = p.empresa_id AND p.creado_en::date = p_fecha
  WHERE m.empresa_id = p_empresa_id
    AND m.creado_en::date = p_fecha
  ON CONFLICT (empresa_id, fecha)
  DO UPDATE SET
    mensajes_recibidos = EXCLUDED.mensajes_recibidos,
    mensajes_respondidos = EXCLUDED.mensajes_respondidos,
    conversaciones_nuevas = EXCLUDED.conversaciones_nuevas,
    contactos_unicos = EXCLUDED.contactos_unicos,
    ingresos_dia = EXCLUDED.ingresos_dia;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 16. ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================================

-- Full-text search en mensajes
CREATE INDEX idx_mensajes_busqueda ON mensajes USING GIN(to_tsvector('spanish', contenido));

-- Búsqueda en contactos
CREATE INDEX idx_contactos_nombre ON contactos USING GIN(to_tsvector('spanish', nombre || ' ' || COALESCE(apellido, '')));

-- Índices para queries comunes
CREATE INDEX idx_reservas_proximas_no_completadas ON reservas(empresa_id, fecha_reserva)
  WHERE estado IN ('confirmada', 'pendiente');

CREATE INDEX idx_conversaciones_sin_asignar ON conversaciones(empresa_id, creado_en DESC)
  WHERE agente_asignado_id IS NULL;

CREATE INDEX idx_pagos_pendientes ON pagos(empresa_id)
  WHERE estado = 'pendiente';

-- ============================================================
-- 17. VISTAS ÚTILES
-- ============================================================

-- Vista: Conversaciones abiertas
CREATE VIEW vista_conversaciones_abiertas AS
SELECT
  c.id,
  c.empresa_id,
  ct.nombre,
  ct.numero_whatsapp,
  c.tema,
  c.estado,
  c.mensajes_count,
  c.mensajes_sin_leer,
  c.creado_en,
  c.ultimo_mensaje,
  u.nombre as agente_nombre
FROM conversaciones c
JOIN contactos ct ON c.contacto_id = ct.id
LEFT JOIN usuarios u ON c.agente_asignado_id = u.id
WHERE c.estado IN ('abierta', 'en_progreso');

-- Vista: Reservas próximas del día
CREATE VIEW vista_reservas_hoy AS
SELECT
  r.id,
  r.empresa_id,
  ct.nombre,
  ct.numero_whatsapp,
  s.nombre as servicio,
  r.fecha_reserva,
  r.duracion_minutos,
  r.estado,
  u.nombre as agente
FROM reservas r
JOIN contactos ct ON r.contacto_id = ct.id
JOIN servicios s ON r.servicio_id = s.id
LEFT JOIN usuarios u ON r.agente_asignado_id = u.id
WHERE DATE(r.fecha_reserva) = CURRENT_DATE
  AND r.estado IN ('confirmada', 'pendiente')
ORDER BY r.fecha_reserva;

-- Vista: Ingresos por período
CREATE VIEW vista_ingresos_periodo AS
SELECT
  empresa_id,
  DATE_TRUNC('month', creado_en)::DATE as mes,
  COUNT(*) as pagos_count,
  SUM(CASE WHEN estado = 'completado' THEN monto ELSE 0 END) as ingresos,
  SUM(monto) as monto_procesado
FROM pagos
WHERE estado IN ('completado', 'pendiente')
GROUP BY empresa_id, DATE_TRUNC('month', creado_en);

-- ============================================================
-- 18. SEED DATA (OPCIONAL)
-- ============================================================

-- Comentar/descomentar según necesidad

/*
INSERT INTO empresas (nombre, descripcion, plan, estado)
VALUES (
  'Milo\'s Shop',
  'Auto SPA - Servicios de limpieza y cuidado automotriz',
  'free',
  'active'
);

INSERT INTO usuarios (empresa_id, email, nombre, apellido, password_hash, rol, estado, email_verificado)
SELECT id, 'admin@milos.com', 'Admin', 'Usuario', '$2b$10$...', 'owner', 'active', true
FROM empresas WHERE nombre = 'Milo\'s Shop';

INSERT INTO servicios (empresa_id, nombre, descripcion, precio, duracion_minutos)
SELECT id, 'Consulta Inicial', 'Evaluación del vehículo', 0, 30
FROM empresas WHERE nombre = 'Milo\'s Shop';
*/

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
