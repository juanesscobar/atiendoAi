# 🎯 ESPECIFICACIONES B2B - PLAN DETALLADO

**Plataforma:** ChatBot SaaS Escalable  
**Tipo:** B2B SaaS multi-tenant  
**Industrias Target:** Servicios (restaurantes, spas, consultorios, salones, talleres)  
**Fecha:** 13 Enero 2026

---

## 📋 TABLA DE CONTENIDOS

1. [Características por Módulo](#características-por-módulo)
2. [Datos de Clientes (Esquema CRM)](#datos-de-clientes-esquema-crm)
3. [Reservas y Calendario](#reservas-y-calendario)
4. [Pagos y Facturación](#pagos-y-facturación)
5. [Estadísticas y Reportes](#estadísticas-y-reportes)
6. [Integraciones](#integraciones)

---

## 🔧 CARACTERÍSTICAS POR MÓDULO

### 1. GESTIÓN DE CONTACTOS (CRM Básico)

#### 1.1 Listado de Contactos

```
VISTA PRINCIPAL
├─ Tabla con búsqueda/filtros rápidos
├─ Ordenable por: nombre, fecha última contacto, gasto total
├─ Filtros: tipo (cliente/prospecto/VIP), ciudad, país, estado
├─ Acciones: editar, eliminar, asignar agente, etiquetar
└─ Exportar a CSV/Excel

INFORMACIÓN POR CONTACTO
├─ Nombre completo
├─ Número WhatsApp (validado)
├─ Email
├─ Teléfono
├─ Ciudad / País
├─ Cumpleaños (para marketing)
├─ Género (opcional)
├─ Tipo: Cliente / Prospecto / VIP / Bloqueado
├─ Score de potencial (0-100)
├─ Total conversaciones
├─ Total gastado
├─ Última compra (fecha)
├─ Preferences: permite marketing, WhatsApp, SMS, email
├─ Agente asignado
├─ Etiquetas personalizadas
└─ Notas internas
```

#### 1.2 Importación Masiva

```
FUNCIONALIDAD
├─ Upload CSV
├─ Detectar automáticamente columnas
├─ Validar formato WhatsApp
├─ Deduplicate automático
├─ Preview antes de confirmar
└─ Importación en background

CAMPOS SOPORTADOS
├─ nombre (requerido)
├─ apellido (opcional)
├─ numero_whatsapp (requerido)
├─ email (opcional)
├─ telefono (opcional)
├─ ciudad (opcional)
├─ pais (opcional)
├─ tipo (cliente/prospecto)
└─ etiquetas (comma-separated)
```

#### 1.3 Segmentación

```
CREAR SEGMENTOS
├─ Por tipo (cliente, prospecto, VIP)
├─ Por gasto (< $100, $100-500, >$500)
├─ Por frecuencia (hace X días no compra)
├─ Por ubicación (ciudad/país)
├─ Por comportamiento (abren mensajes, hacen clic)
├─ Por etiquetas personalizadas
└─ Por fecha de inscripción

ACCIONES POR SEGMENTO
├─ Enviar campaña WhatsApp
├─ Asignar a agentes
├─ Exportar datos
└─ Aplicar descuentos automáticos
```

#### 1.4 Historial Individual

```
TIMELINE PARA CADA CONTACTO
├─ Conversaciones (listado)
├─ Reservas (próximas y pasadas)
├─ Pagos (transacciones)
├─ Notas de agentes
├─ Cambios de estado
├─ Última actividad
├─ Scoring histórico
└─ Feedback/Calificaciones
```

---

### 2. CONVERSACIONES Y CHAT

#### 2.1 Bandeja de Conversaciones

```
VISTA PRINCIPAL - INBOX
├─ Conversaciones activas ordenadas por antigüedad
├─ No. de mensajes sin leer (por conversación)
├─ Avatar y nombre del cliente
├─ Último mensaje (preview)
├─ Última actividad (tiempo)
├─ Estado: Abierta / En progreso / Cerrada
├─ Tema: Venta / Soporte / Consulta / Queja
├─ Agente asignado
├─ Prioridad: Baja / Normal / Alta / Urgente
└─ Etiquetas

FILTROS Y BÚSQUEDA
├─ Por estado
├─ Por tema
├─ Por agente
├─ Por prioridad
├─ Por fecha
├─ Búsqueda full-text en mensajes
└─ Búsqueda por número WhatsApp
```

#### 2.2 Vista de Chat

```
PANEL CHAT
├─ Nombre cliente + número WhatsApp
├─ Información: tipo contacto, última compra, total gastado
├─ Historial de mensajes (scroll-able)
├─ Mensajes de cliente (burbuja azul derecha)
├─ Mensajes de bot (burbuja gris izquierda)
├─ Mensajes de agente (burbuja verde izquierda)
├─ Timestamps en cada mensaje
├─ Indicadores de intención detectada (pequeño badge)
├─ Estado de lectura (visto/no visto)

ACCIONES EN CHAT
├─ Escribir respuesta
├─ Enviar adjuntos (imágenes, PDF)
├─ Insertar plantillas predefinidas
├─ Marcar como resuelto
├─ Asignar a agente
├─ Cambiar tema/prioridad
├─ Agregar notas privadas
├─ Crear reserva desde chat
├─ Crear pago desde chat
└─ Bloquear contacto
```

#### 2.3 Intención Detectada

```
INFORMACIÓN MOSTRADA
├─ Badge con intención: "Solicitud de Precio"
├─ Confianza: 87%
├─ Entidades detectadas:
│  ├─ Producto/Servicio: "Corte de cabello"
│  ├─ Fecha mencionada: "mañana"
│  └─ Descripción: "quiero un corte moderno"

SUGERENCIAS DE IA
├─ "¿Quieres agendar para mañana?"
├─ "Este servicio cuesta $35"
├─ "Tenemos disponibilidad a las 3PM"
└─ Botones de acción rápida
```

#### 2.4 Plantillas de Respuesta

```
CREAR PLANTILLAS
├─ Nombre: "Bienvenida"
├─ Categoría: bienvenida/despedida/info/horarios
├─ Contenido: "Hola {{nombre}}, bienvenido a..."
├─ Variables: {{nombre}}, {{empresa}}, {{servicio}}, {{precio}}
├─ Casos de uso: "Primer contacto con prospecto"

USAR PLANTILLAS
├─ Escribir "/" en chat
├─ Aparece autocomplete de plantillas
├─ Seleccionar
├─ Variables se reemplazan automáticamente
└─ Editar antes de enviar
```

---

### 3. RESERVAS Y CALENDARIO

#### 3.1 Calendario Visual

```
VISTAS DISPONIBLES
├─ Mes (grid con días)
├─ Semana (línea de tiempo horizontal)
├─ Día (línea de tiempo vertical)
└─ Lista (tabla con detalles)

POR CADA DÍA/SLOT
├─ Reservas confirmadas (verde)
├─ Reservas pendientes (amarillo)
├─ Canceladas (rojo)
├─ Completadas (gris)
├─ Huecos disponibles (espacio vacío)

INFORMACIÓN MOSTRADA
├─ Nombre cliente
├─ Servicio a hacer
├─ Hora inicio - fin
├─ Duración
├─ Agente asignado
├─ Estado de confirmación
└─ Notas (truncadas)
```

#### 3.2 Crear Reserva

```
FLUJO AUTOMÁTICO (desde chat)
├─ Usuario pregunta: "¿Puedo agendar para mañana?"
├─ Bot responde con disponibilidad
├─ Cliente selecciona hora
├─ Se crea reserva automáticamente
├─ Confirmación automática por WhatsApp
└─ Recordatorios automáticos (24h, 1h)

FLUJO MANUAL (dashboard)
├─ Click en slot vacío del calendario
├─ Form: seleccionar servicio
├─ Form: seleccionar contacto (buscar)
├─ Form: confirmar hora
├─ Form: notas (opcional)
├─ Form: asignar agente
├─ Guardar → Enviar confirmación WhatsApp
└─ Sistema de recordatorios activado
```

#### 3.3 Gestión de Horarios

```
CONFIGURACIÓN DE HORARIOS
├─ Seleccionar días de atención (L-D)
├─ Hora de apertura
├─ Hora de cierre
├─ Intervalo de reserva (15, 30, 60 min)
├─ Agentes disponibles por horario
├─ Descansos internos (almuerzo, etc)
└─ Feriados (no disponible)

POR SERVICIO
├─ Duraciones específicas
├─ Agentes que pueden atender
├─ Max reservas simultáneas
└─ Tiempos de preparación entre citas

HORARIOS ESPECIALES
├─ Fin de semana (diferentes horas)
├─ Temporada alta/baja
├─ Asuetos y feriados
└─ Vacaciones (bloquear período)
```

#### 3.4 Confirmación y Recordatorios

```
FLUJO DE CONFIRMACIÓN
├─ 1. Reserva creada → Estado "Pendiente"
├─ 2. WhatsApp automático al cliente
├─ 3. Cliente confirma o rechaza (botones)
├─ 4. Estado cambia a "Confirmada" o "Cancelada"
└─ 5. Agente notificado en dashboard

RECORDATORIOS AUTOMÁTICOS
├─ 24 horas antes
│  └─ "Tu cita en {{empresa}} mañana a las {{hora}}"
├─ 1 hora antes
│  └─ "Recordatorio: en 1h tienes cita. ¿Algún cambio?"
└─ 15 min antes (opcional para próximos encuentros)

CLIENTE PUEDE
├─ Confirmar cita
├─ Cancelar cita
├─ Reprogramar (seleccionar nuevo horario)
└─ Hacer preguntas (abre chat)
```

---

### 4. PAGOS Y FACTURACIÓN

#### 4.1 Métodos de Pago Soportados

```
EN WHATSAPP
├─ Click en link de pago
├─ Opciones de pago presentadas
│  ├─ Stripe (tarjeta de crédito)
│  ├─ MercadoPago (billetera + tarjeta)
│  ├─ Transferencia bancaria
│  └─ Efectivo (confirmación manual)

FLUJO STRIPE
├─ Cliente recibe link
├─ Click → Abre Stripe checkout
├─ Ingresa datos de tarjeta
├─ Confirmación automática
└─ Factura por email

FLUJO MERCADOPAGO
├─ Cliente recibe link
├─ Click → Abre MercadoPago
├─ Múltiples opciones (tarjeta, transferencia, QR)
├─ Confirmación automática
└─ Factura por email

FLUJO EFECTIVO
├─ Agente marca como "pagado al presentarse"
├─ Cliente confirma en WhatsApp
├─ Sistema registra transacción
└─ Factura se genera manual
```

#### 4.2 Gestión de Pagos

```
LISTADO DE PAGOS
├─ Tabla con todos los pagos
├─ Filtro por estado (pendiente, completado, fallido)
├─ Filtro por método
├─ Filtro por período
├─ Búsqueda por cliente/ID pago
├─ Columnas: cliente, monto, método, estado, fecha
└─ Acciones: detalles, reembolso, enviar recibo

DETALLES DE PAGO
├─ ID pago
├─ Cliente
├─ Monto
├─ Moneda
├─ Método usado
├─ Referencia externa (ID Stripe/MercadoPago)
├─ Estado
├─ Comprobante (enlace)
├─ Fecha
├─ Notas
└─ Historial de cambios
```

#### 4.3 Facturación Automática

```
GENERACIÓN AUTOMÁTICA
├─ Cuando pago se completa
├─ Número secuencial (factura #001, #002, etc)
├─ Datos empresa
├─ Datos cliente
├─ Detalles de transacción
├─ Fecha
├─ Moneda y totales
├─ Impuestos (si aplica)
└─ Notas fiscales

ENVÍO AUTOMÁTICO
├─ Email al cliente
├─ PDF descargable
├─ Enlace de descarga en WhatsApp
├─ Copia en dashboard del cliente

GESTIÓN FACTURACIÓN
├─ Listar todas las facturas
├─ Descargar PDF
├─ Reenviar por email
├─ Marcar como pagada
├─ Agregar notas
└─ Exportar (contabilidad)

DATOS FISCALES (Opcional)
├─ CUIT empresa
├─ Domicilio fiscal
├─ Condición ante DGI
├─ Número de factura fiscal
└─ QR de código de autorización
```

#### 4.4 Reembolsos

```
CREAR REEMBOLSO
├─ Buscar pago a reembolsar
├─ Monto a reembolsar (parcial o total)
├─ Razón: "Cancelación", "Defecto", "Cliente lo solicita"
├─ Notas internas
└─ Confirmar

AUTOMÁTICO PARA
├─ Stripe: se devuelve a la tarjeta en 2-3 días
├─ MercadoPago: se devuelve a billetera
└─ Efectivo: se marca como reembolsado (manual)

NOTIFICACIÓN CLIENTE
├─ Email informando reembolso
├─ Referencia de transacción
├─ Monto
├─ Fecha esperada de recepción
└─ Enlace a factura de reembolso
```

---

### 5. ESTADÍSTICAS Y REPORTES

#### 5.1 Dashboard Principal

```
CARD MÉTRICAS (HOY)
┌──────────────────────────────────────┐
│  CONVERSACIONES    │  MENSAJES       │
│  45 nuevas         │  287 recibidos  │
│  ↑ 12% vs ayer     │  ↑ 5% vs ayer   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  RESERVAS          │  INGRESOS       │
│  12 confirmadas    │  $1,245         │
│  8 pendientes      │  ↑ 18% vs ayer  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  CONVERSIÓN        │  SATISFACCIÓN   │
│  25% (3 ventas)    │  4.6/5.0 ⭐     │
│  ↑ 5% vs ayer      │  12 reseñas     │
└──────────────────────────────────────┘

GRÁFICOS
├─ Mensajes vs Reservas (línea)
├─ Ingresos por día (columna)
├─ Top servicios (pie)
└─ Intenciones detectadas (donut)
```

#### 5.2 Reportes Detallados

```
REPORTE: CONVERSACIONES
├─ Total conversaciones (período)
├─ Por estado (abierta/cerrada/cancelada)
├─ Tiempo promedio de resolución
├─ Por tema (venta/soporte/consulta)
├─ Escalaciones a agentes (%)
├─ Conversaciones sin respuesta
├─ Satisfacción promedio
└─ Exportar a PDF/Excel

REPORTE: RESERVAS
├─ Total reservas (período)
├─ Confirmadas vs pendientes
├─ Tasa de no-presentismo
├─ Por servicio (top 10)
├─ Horas pico de demanda
├─ Ocupación promedio
├─ Cancelaciones (razones)
└─ Exportar a PDF/Excel

REPORTE: VENTAS
├─ Total transacciones
├─ Monto total
├─ Promedio por transacción
├─ Por método de pago
├─ Por cliente (top 10)
├─ Por servicio
├─ Tasa de conversión (intento → venta)
├─ Tendencia período a período
└─ Exportar a PDF/Excel

REPORTE: CLIENTES
├─ Clientes nuevos (período)
├─ Clientes activos
├─ Tasa de retención
├─ CAC (costo de adquisición)
├─ LTV (valor de cliente)
├─ Segmentación
├─ Churn analysis
└─ Exportar a PDF/Excel

REPORTE: IA
├─ Mensajes procesados
├─ Intenciones más comunes
├─ Confianza promedio de detección
├─ Tokens utilizados vs presupuesto
├─ Costo de IA (período)
├─ Escalaciones (% resueltas por IA)
├─ Tiempos de respuesta
└─ Exportar a PDF/Excel
```

#### 5.3 Gráficos y Visualizaciones

```
DISPONIBLES
├─ Líneas (evolución en tiempo)
├─ Columnas (comparación períodos)
├─ Barras (ranking)
├─ Pie/Donut (distribución)
├─ Scatter (correlación)
└─ Calendario (heatmap de actividad)

PERÍODOS
├─ Hoy
├─ Últimos 7 días
├─ Últimos 30 días
├─ Este mes
├─ Último mes
├─ Últimos 3 meses
├─ Último trimestre
├─ Este año
└─ Rango personalizado
```

#### 5.4 Comparativa Períodos

```
SELECCIONAR
├─ Período A: "Enero 2024"
├─ Período B: "Enero 2025"
└─ Métricas a comparar (multi-select)

VER
├─ Tabla lado-a-lado
├─ Diferencia absoluta ($)
├─ Diferencia relativa (%)
├─ Flecha indicador (↑↓)
├─ Gráfico de tendencia
└─ Exportar comparativa
```

---

### 6. SERVICIOS Y CONFIGURACIÓN

#### 6.1 Gestión de Servicios

```
CREAR SERVICIO
├─ Nombre: "Corte de cabello"
├─ Descripción: "Corte moderno con técnica..."
├─ Categoría: "Estética"
├─ Precio: $35
├─ Duración: 30 minutos
├─ Imagen: upload
├─ Emoji: "✂️"
├─ Reservable: Sí/No
├─ Requiere pago previo: Sí/No
├─ Stock: -1 (ilimitado)
├─ Prioridad (para mostrar en IA)
├─ Activo: Sí/No
└─ Guardar

LISTADO SERVICIOS
├─ Tabla editable
├─ Ordenable por precio, duración, actividad
├─ Filtros: categoría, estado
├─ Editar en línea
├─ Activar/desactivar
├─ Duplicar
└─ Eliminar
```

#### 6.2 Categorización

```
CREAR CATEGORÍAS
├─ Nombre
├─ Descripción
├─ Imagen/Icono
└─ Color (para UI)

ASIGNAR SERVICIOS
├─ Cada servicio a una categoría
├─ Ej: "Paquetes Premium", "Servicios Básicos", "Add-ons"

MOSTRAR EN IA
├─ IA menciona primero servicios populares
├─ Agrupa por categoría en respuestas
├─ Sugiere servicios relacionados
└─ Muestra precios desagregados
```

---

### 7. DATOS ORGANIZACIONALES

#### 7.1 Datos de la Empresa

```
PERFIL EMPRESA
├─ Nombre: "Milo's Shop"
├─ Tipo: "Auto SPA"
├─ Descripción: "Servicios de limpieza y cuidado automotriz"
├─ Imagen/Logo: upload
├─ Teléfono de contacto
├─ Email de contacto
├─ Sitio web
├─ Redes sociales (Instagram, Facebook, etc)
├─ Dirección
├─ Ciudad / País
└─ Zona horaria

DATOS OPERACIONALES
├─ Días de atención
├─ Horario general de apertura
├─ Horario general de cierre
├─ Moneda (USD, ARS, MXN, etc)
├─ Idioma de respuestas IA
├─ Persona de contacto principal
└─ Teléfono principal
```

#### 7.2 Configuración de IA

```
MODELO
├─ Seleccionar modelo: gpt-3.5-turbo / gpt-4 (si tienen acceso)
├─ Temperatura: 0.0-2.0 (creatividad)
├─ Max tokens por respuesta: 100-2000
├─ Presupuesto mensual de tokens: $ o cantidad
└─ Notificar cuando se alcance 80%

COMPORTAMIENTO
├─ Tono: Profesional / Amigable / Juguetón
├─ Idioma: Español / Inglés / Portugués / etc
├─ Emojis: Usar / No usar
├─ Respuestas automáticas: Habilitar / Deshabilitar
├─ Escalación a agentes automática: Sí / No
└─ Horario para respuestas automáticas: 24/7 o custom

CONTEXTO DEL NEGOCIO
├─ Instrucciones personalizadas (custom prompt)
├─ Políticas de la empresa
├─ Casos prohibidos (discriminación, etc)
└─ Ejemplos de respuestas ideales
```

#### 7.3 Preferencias de Comunicación

```
CANALES
├─ WhatsApp: Habilitado / Deshabilitado
├─ Email: Habilitado / Deshabilitado
├─ SMS: Habilitado / Deshabilitado
└─ Notificaciones in-app: Habilitado / Deshabilitado

HORARIOS DE RESPUESTA
├─ Respuestas automáticas 24/7: Sí / No
├─ Si NO:
│  ├─ Horario de respuesta automática
│  ├─ Mensaje fuera de horario
│  └─ Notar que responderemos en horario de atención

PRIVACIDAD Y CONSENTIMIENTO
├─ Consentimiento GDPR recolectado
├─ Derecho al olvido habilitado
├─ Retención de datos: 30/90/180 días
└─ Descargar datos del cliente: habilitado
```

---

### 8. INTEGRACIONES Y WEBHOOKS

#### 8.1 Integraciones Disponibles

```
CALENDARIO
├─ Google Calendar
│  └─ Sincronizar reservas en calendario personal
├─ Outlook / Microsoft 365
│  └─ Sincronizar reservas en calendario
└─ Calendly
    └─ Importar disponibilidad

CRM Y COMUNICACIÓN
├─ Slack
│  ├─ Notificaciones de nuevas conversaciones
│  ├─ Alertas de reservas confirmadas
│  └─ Resumen diario de métricas
├─ HubSpot
│  ├─ Sincronizar contactos
│  ├─ Crear deals de ventas
│  └─ Sincronizar conversaciones
└─ Pipedrive
    ├─ Sincronizar leads
    └─ Crear deals

EMAIL Y MARKETING
├─ Mailchimp
│  ├─ Suscribir leads a listas
│  ├─ Enviar campañas
│  └─ Sincronizar conversiones
└─ SendGrid
    ├─ Email transaccionales
    └─ Plantillas personalizadas

PAGOS
├─ Stripe (ya integrado)
└─ MercadoPago (ya integrado)

AUTOMATIZACIÓN
├─ Zapier
│  ├─ Conectar con 5000+ aplicaciones
│  ├─ Crear workflows complejos
│  └─ Automatizar tareas
└─ Make (ex-Integromat)
    ├─ Workflows más avanzados
    └─ Lógica condicional compleja

ANALYTICS
├─ Google Analytics 4
│  ├─ Rastrear conversiones
│  ├─ Análisis de comportamiento
│  └─ Reportes personalizados
└─ Amplitude
    ├─ Análisis de producto
    └─ Funnels y cohortes
```

#### 8.2 Webhooks Personalizados

```
CREAR WEBHOOK
├─ Nombre: "Notificar a sistema ERP"
├─ URL: https://mi-sistema.com/webhook
├─ Evento trigger:
│  ├─ "mensaje_recibido"
│  ├─ "reserva_confirmada"
│  ├─ "pago_completado"
│  └─ "contacto_creado"
├─ Headers personalizados
├─ Verificar firma (HMAC)
├─ Reintentos: Sí (exponential backoff)
└─ Activado: Sí/No

PAYLOAD EJEMPLO
```json
{
  "evento": "reserva_confirmada",
  "timestamp": "2026-01-13T14:30:00Z",
  "reserva": {
    "id": "res_123abc",
    "contacto": {
      "nombre": "Juan Pérez",
      "numero_whatsapp": "+5491123456789"
    },
    "servicio": "Corte de cabello",
    "fecha": "2026-01-14T15:00:00Z",
    "duracion_minutos": 30,
    "estado": "confirmada",
    "monto": 35.00
  }
}
```

#### 8.3 Trazabilidad de Integraciones

```
LISTADO DE INTEGRACIONES
├─ Nombre / Tipo
├─ Estado (conectada / desconectada / error)
├─ Último sync
├─ Errores recientes (si hay)
├─ Datos sincronizados (contador)
└─ Acciones: reconectar, desconectar, test

LOGS DE SINCRONIZACIÓN
├─ Últimas 100 transacciones
├─ Timestamp
├─ Acción (contacto creado, pago sync, etc)
├─ Resultado (éxito/error)
├─ Detalle (mensaje de error si aplica)
└─ Filtro por tipo de evento
```

---

## 📊 DATOS DE CLIENTES - ESQUEMA CRM

### Campos de Contacto

```
IDENTIFICACIÓN
├─ ID único
├─ Empresa_ID (para multi-tenant)
└─ Creado en (timestamp)

INFORMACIÓN PERSONAL
├─ Nombre completo (requerido)
├─ Apellido
├─ Número WhatsApp (único, requerido para soporte)
├─ Email
├─ Teléfono
├─ Género (Masculino/Femenino/No binario)
└─ Cumpleaños (fecha)

UBICACIÓN
├─ Ciudad
├─ Provincia/Estado
├─ País
└─ Código postal

CLASIFICACIÓN
├─ Tipo: Cliente / Prospecto / VIP / Bloqueado
├─ Fuente: WhatsApp / Manual / Importación / Campaña
├─ Etiquetas: array (librería personalizada)
├─ Agente asignado: user_id
├─ Interés nivel: Bajo / Medio / Alto
└─ Scoring de potencial: 0-100

COMPORTAMIENTO Y COMPRA
├─ Total conversaciones: número
├─ Total gastos: decimal
├─ Fecha última compra: date
├─ Fecha último contacto: timestamp
├─ Frecuencia de compra: cada X días
├─ Promedio por transacción: decimal
├─ Productos más comprados: array
└─ Comentarios/Feedback: texto

COMUNICACIÓN Y PRIVACIDAD
├─ Permite marketing: boolean
├─ Permite WhatsApp: boolean
├─ Permite SMS: boolean
├─ Permite email: boolean
├─ Consentimiento GDPR: boolean + timestamp
├─ Idioma preferido: es/en/pt
├─ Zona horaria: timezone string
└─ Notas privadas: texto

METADATA ADICIONAL
├─ Datos personalizados (JSON)
├─ Campos extra definidos por empresa
└─ Actualizado en: timestamp
```

### Relaciones y Métricas

```
UN CONTACTO TIENE MUCHAS
├─ Conversaciones (FK)
├─ Reservas (FK)
├─ Pagos (FK)
├─ Notas/Interacciones (1-a-n)
└─ Facturas (FK)

MÉTRICAS CALCULADAS
├─ NPS Score (0-10 si contestó)
├─ Tasa de satisfacción (promedio calificaciones)
├─ Días sin interacción (actual_date - last_contact)
├─ Valor de cliente (total_gastos)
├─ Frecuencia compra (total_transacciones / días_activo)
└─ Propensión a churn (si no compra en X días)
```

---

## 📅 RESERVAS Y CALENDARIO

### Modelo de Reserva

```
CAMPOS BÁSICOS
├─ ID único
├─ Empresa_ID (multi-tenant)
├─ Contacto_ID (FK)
├─ Servicio_ID (FK)
├─ Agente_ID (FK)
└─ Conversación_ID (FK, opcional)

DETALLES DE CITA
├─ Fecha y hora inicio
├─ Duración en minutos
├─ Fecha y hora fin (calculada)
├─ Estado: Confirmada / Pendiente / Cancelada / Completada / No presentado
├─ Prioridad: Normal / Urgente
└─ Notas privadas: texto

CONFIRMACIÓN Y RECORDATORIOS
├─ Confirmada por cliente: boolean + timestamp
├─ Recordatorio 24h enviado: boolean
├─ Recordatorio 1h enviado: boolean
├─ Cliente confirmó por: WhatsApp / Email / Link
└─ Respuesta cliente: "Confirmada" / "Reprogramar" / "Cancelar"

ACTUALIZACIÓN POST-CITA
├─ Duracion real en minutos
├─ Completada: boolean + timestamp
├─ Calificación cliente: 1-5 stars
├─ Comentarios cliente: texto
├─ Notas internas (agente): texto
└─ Servicios adicionales agregados: array
```

### Reglas de Disponibilidad

```
NIVEL GLOBAL (EMPRESA)
├─ Días de atención: L-V
├─ Horarios: 9 AM - 6 PM
├─ Intervalo de reserva: 30 minutos
├─ Agentes simultáneos: 2

NIVEL POR SERVICIO
├─ Duración mínima: 15 minutos
├─ Duración estándar: 30/60 minutos
├─ Max citas simultáneas: 1 (no solapadas)
├─ Descanso entre citas: 5 minutos
├─ Agentes que pueden hacer: array

EXCEPCIONES
├─ Feriados: no disponible (bloquear día)
├─ Vacaciones agente: no disponible (período)
├─ Mantenimiento: no disponible (bloquear slots)
└─ Evento especial: cerrado (bloquear día)

DISPONIBILIDAD MOSTRADA
├─ Próximos 30 días
├─ Solo horarios disponibles
├─ En orden cronológico
├─ Con agente asignado
└─ Con service info (precio, duración)
```

---

## 💳 PAGOS Y FACTURACIÓN

### Modelo de Pago

```
DATOS BASICOS
├─ ID único
├─ Empresa_ID
├─ Contacto_ID
├─ Conversacion_ID (opcional)
├─ Reserva_ID (optional)
└─ Factura_ID (FK)

TRANSACCIÓN
├─ Monto: decimal
├─ Moneda: ISO 4217 (USD, ARS, MXN, etc)
├─ Método: Stripe / MercadoPago / Transferencia / Efectivo
├─ Referencia externa: ID de Stripe/MercadoPago
└─ Descripción: texto

ESTADO
├─ Pendiente: en espera de confirmación
├─ Procesando: Stripe/MP procesando
├─ Completado: éxito
├─ Fallido: rechazado
├─ Reembolsado: dinero devuelto
└─ Disputado: cliente disputa cargo

CONFIRMACIÓN
├─ Recepción confirmada: boolean
├─ Fecha confirmación: timestamp
├─ Comprobante URL: enlace
└─ Notas de confirmación: texto

REEMBOLSO (si aplica)
├─ Reembolsado: boolean
├─ Monto reembolso: decimal
├─ Razón: "Cancelación" / "Defecto" / "Cliente solicita"
├─ Fecha reembolso: timestamp
└─ Referencia reembolso: ID Stripe/MP
```

### Modelo de Factura

```
DATOS FISCALES
├─ Número factura: único (001, 002, etc)
├─ Tipo documento: Factura / Recibo / Nota Crédito
├─ CUIT empresa: string
├─ Domicilio fiscal: dirección

ENCABEZADO
├─ Empresa_ID
├─ Contacto_ID
├─ Fecha: date
├─ Período: date_from - date_to (para periódicas)
└─ Pago_ID: FK

DETALLES
├─ Items (array):
│  ├─ Descripción servicio
│  ├─ Cantidad
│  ├─ Precio unitario
│  └─ Subtotal
├─ Subtotal: sum items
├─ Impuesto (%): decimal
├─ Monto impuesto: subtotal * impuesto%
├─ Descuento (%): decimal
├─ Monto descuento: subtotal * descuento%
├─ Total: subtotal ± impuesto ± descuesto
└─ Moneda

TÉRMINOS
├─ Condición de pago: "Inmediato" / "30 días" / "NET30"
├─ Notas: instrucciones de pago
├─ Datos bancarios (para transferencia)
└─ Referencias de pedido/contrato

ESTADO
├─ Emitida: boolean
├─ Enviada al cliente: boolean + timestamp
├─ Pagada: boolean
├─ PDF: URL del archivo
└─ Historial: array de cambios
```

---

## 📈 ESTADÍSTICAS Y REPORTES

### Métricas Clave (KPIs)

```
VOLUMEN
├─ Mensajes procesados (total, diarios)
├─ Conversaciones activas
├─ Contactos únicos
├─ Nuevos contactos (período)
├─ Tasa de crecimiento: mes/mes

CALIDAD
├─ Tiempo promedio respuesta: segundos
├─ Tasa de resolución IA: % (sin escalación)
├─ Escalaciones a agentes: % 
├─ Tasa de satisfacción: 0-5 estrellas
├─ NPS Score: -100 a +100

COMERCIAL
├─ Intento de reserva: contador
├─ Reservas completadas: contador
├─ Tasa de conversión reserva: % (intento/confirmada)
├─ Intento de pago: contador
├─ Pagos completados: contador
├─ Tasa de conversión pago: % (intento/completado)
├─ Ingresos totales: decimal
├─ Ingresos promedio por transacción: decimal
├─ Ticket promedio: decimal

UTILIZACIÓN
├─ Ocupación de agentes: %
├─ Disponibilidad horaria utilizada: %
├─ Servicios más reservados: ranking
├─ Horarios pico: list

OPERACIONAL
├─ Disponibilidad servicio: % uptime
├─ Latencia API: ms promedio
├─ Tasa de error: %
├─ Capacidad BD utilizada: %
└─ Tokens IA utilizados: vs presupuesto
```

### Reportes Personalizables

```
DIMENSIONES DISPONIBLES
├─ Período: Hoy, Semana, Mes, Trimestre, Año, Custom
├─ Grupo por: Día, Semana, Mes, Servicio, Cliente, Agente
├─ Filtro: Empresa, Agente, Servicio, Contacto, Estado
└─ Sorteo: Ascendente, Descendente

FORMATOS DE EXPORTACIÓN
├─ PDF (con gráficos)
├─ Excel (múltiples hojas)
├─ CSV (datos crudos)
├─ JSON (para procesamiento)
└─ Email automático (programar)

DASHBOARDS GUARDADOS
├─ Guardar dashboard personalizado
├─ Compartir con equipo
├─ Programar reportes vía email (diarios/semanales/mensuales)
└─ Alertas basadas en umbrales
```

---

## 🔌 INTEGRACIONES

### Google Calendar

```
QUÉ SINCRONIZA
├─ Reservas confirmadas → eventos calendario
├─ Cambios de estado → actualiza evento
├─ Cancelaciones → elimina evento
└─ Recordatorios configurados

DATOS MOSTRADOS
├─ Nombre cliente
├─ Servicio
├─ Agente
├─ Ubicación: dirección empresa
├─ Descripción: contacto cliente, notas
└─ Notificaciones: 24h y 1h antes

CONFIGURACIÓN
├─ Calendario destino: seleccionar
├─ Color de eventos: personalizable
├─ Incluir detalles sensibles: Sí/No
└─ Sincronización bidireccional: Sí/No (crear en Calendar → reserva)
```

### Slack

```
NOTIFICACIONES
├─ Nueva conversación: "Nueva consulta de Juan P."
├─ Reserva confirmada: "Reserva confirmada: Juan P. - Corte 15 Ene 3PM"
├─ Pago completado: "Pago $35 completado - Juan P."
├─ Cliente VIP: "⭐ Cliente VIP Juan P. escribió"
└─ Error crítico: "⚠️ Error en API: ..."

CANAL
├─ Todos los eventos → #general
├─ O canal personalizado por tipo de evento
└─ Thread con detalles completos + acciones

ACCIONES DESDE SLACK
├─ /reserva crear → formulario modal
├─ /cliente buscar → find contact
├─ /pago registrar → quick payment
└─ /agente asignar → assign interaction
```

### Zapier / Make

```
TRIGGERS DISPONIBLES
├─ Nueva conversación recibida
├─ Reserva confirmada
├─ Pago completado
├─ Cliente creado
├─ Mensaje recibido (con palabras clave)
└─ Métricas cruzan umbral

ACCIONES
├─ Crear contacto en HubSpot/Salesforce
├─ Crear deal de venta
├─ Enviar email personalizado
├─ Crear tarea en To-Do
├─ Guardar datos en Spreadsheet
├─ Enviar SMS
└─ Llamar webhook personalizado

EJEMPLO WORKFLOW
"Cuando cliente pague → Crear contacto en HubSpot + Crear deal + Enviar email bienvenida"
```

---

## 🎯 RESUMEN

```
MÓDULOS IMPLEMENTADOS
├─ CRM con 50+ campos
├─ Conversaciones con IA
├─ Reservas con calendario
├─ Pagos integrados
├─ Reportes completos
├─ Integraciones modernas
└─ Seguridad empresarial

DATOS SOPORTADOS
├─ 15 tablas PostgreSQL
├─ 400+ campos
├─ Multi-tenant from day 1
├─ RLS y encriptación
├─ Auditoría completa
└─ GDPR compliance

ESCALABILIDAD
├─ Soporta 1000+ clientes
├─ Millones de mensajes
├─ API con 60+ endpoints
├─ Webhooks personalizados
├─ Integraciones extensibles
└─ Performance optimizado
```

---

**¿Listo para comenzar la implementación?** 🚀

Este documento define exactamente qué construir. Los 3 documentos anteriores (PLAN_ESCALABILIDAD, ARQUITECTURA_TECNICA, ROADMAP_ACCIONABLE) te dicen cómo y cuándo.

Juntos forman un blueprint completo para tu SaaS.

---

*Creado: 13 Enero 2026*  
*Status: Especificaciones Finales*  
*Siguiente: Implementación*
