# 🤖 WhatsApp Bot con IA Integrada

Bot de WhatsApp inteligente con integración de OpenAI para atención al cliente automatizada.

## 📋 Características

✅ **Respuestas Inteligentes con IA** - Usa GPT-4 mini para conversaciones naturales  
✅ **Detección Automática de Intenciones** - Identifica qué necesita el cliente  
✅ **Contexto del Negocio** - Configuración flexible de servicios y horarios  
✅ **Historial de Conversaciones** - Memoria de contexto para mejor experiencia  
✅ **Fácil Integración** - Solo necesitas tu cuenta de WhatsApp  

## 🚀 Configuración Inicial

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# OpenAI API Key (obtén en https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-tu-api-key-aqui

# Información del negocio
BUSINESS_NAME=Mi Negocio
BUSINESS_TIMEZONE=America/Mexico_City

# Base de datos
DATABASE_PATH=./data/chatbot.db
```

### 3. Editar Configuración del Negocio
Abre `config/business.json` y personaliza:
- Nombre y descripción del negocio
- Servicios ofrecidos y precios
- Horarios de atención
- Políticas de cancelación
- Métodos de pago

**Ejemplo:**
```json
{
  "name": "Mi Negocio",
  "services": [
    {
      "id": 1,
      "name": "Consulta Inicial",
      "price": 0,
      "duration": 30,
      "durationUnit": "minutos"
    }
  ]
}
```

### 4. Obtener Clave OpenAI

1. Ve a [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Inicia sesión o crea una cuenta
3. Genera una nueva clave API
4. Cópiala en tu `.env` como `OPENAI_API_KEY`

### 5. Ejecutar el Bot
```bash
node chatbot.js
```

Verás un QR Code. **Escanéalo con WhatsApp** para conectar tu cuenta.

## 📁 Estructura del Proyecto

```
chatbot1/
├── chatbot.js                   # Archivo principal
├── package.json
├── .env                         # Variables de entorno
│
├── config/
│   └── business.json           # Configuración del negocio
│
├── services/
│   └── aiService.js            # Integración con OpenAI
│
├── utils/
│   ├── intentDetector.js        # Detecta intención del mensaje
│   └── contextBuilder.js        # Construye contexto enriquecido
│
└── data/
    └── chatbot.db              # Base de datos SQLite (se crea automáticamente)
```

## 🧠 Cómo Funciona

```
Usuario envía mensaje WhatsApp
         ↓
Bot detecta intención (pregunta, cita, venta, etc)
         ↓
Construye contexto con info del negocio
         ↓
Envía a OpenAI con prompt personalizado
         ↓
IA genera respuesta inteligente
         ↓
Guarda en historial
         ↓
Envía respuesta a WhatsApp
```

## 🎯 Intenciones Detectadas

El bot identifica automáticamente:
- 🛍️ **Preguntas sobre precios** → Muestra servicios y tarifas
- 📅 **Solicitudes de cita** → Guía agendamiento
- ℹ️ **Información general** → Responde con contexto del negocio
- 📦 **Estado de pedidos** → Consultas de seguimiento
- 😞 **Quejas/Problemas** → Ofrece soluciones
- 👋 **Saludos/Despedidas** → Respuestas amables

## ⚙️ Personalización

### Agregar Nuevos Servicios
Edita `config/business.json`:
```json
{
  "services": [
    {
      "id": 4,
      "name": "Servicio Premium Plus",
      "description": "Soporte 24/7",
      "price": 999,
      "duration": 1,
      "durationUnit": "mes"
    }
  ]
}
```

### Cambiar Modelo de IA
En `config/business.json`:
```json
{
  "aiConfig": {
    "model": "gpt-4",  // Cambia a gpt-4, gpt-3.5-turbo, etc
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

### Agregar Nuevas Intenciones
En `utils/intentDetector.js`, agrega patrones:
```javascript
if (matchesPattern(lowerText, ["refund", "devolver", "reembolso"])) {
  return { type: "refund", confidence: 0.9 };
}
```

## 💰 Costos Estimados

| Concepto | Precio |
|----------|--------|
| OpenAI GPT-4 mini | ~$0.001-0.003 por mensaje |
| Hosting (Railway) | $5-20/mes |
| Base de datos | Gratis (SQLite) |

**Ejemplo**: 1000 mensajes/mes ≈ $3-10 en IA

## 🔐 Seguridad

- ✅ Variables sensibles en `.env` (nunca en Git)
- ✅ Encriptación de datos en BD (fase 2)
- ✅ Rate limiting (fase 2)
- ✅ Validación de mensajes

## 📚 Próximos Pasos (Fase 2)

- [ ] Base de datos SQLite para persistencia
- [ ] Sistema de citas automáticas
- [ ] Recordatorios por WhatsApp
- [ ] Integración de pagos (Stripe/MercadoPago)
- [ ] Dashboard de reportes
- [ ] CRM integrado
- [ ] Respuestas por voz

## 🐛 Troubleshooting

### "Error: OPENAI_API_KEY is not set"
→ Verifica que `.env` esté en la raíz y tenga la clave correcta

### "WhatsApp desconectado"
→ Escanea el QR Code nuevamente

### "Respuestas lentas"
→ Revisa tu conexión a internet o reduce `maxTokens` en config

## 📞 Soporte

Para errores o preguntas:
1. Revisa los logs en consola
2. Verifica tu API key de OpenAI
3. Comprueba que `.env` esté configurado

## 📄 Licencia

MIT

---

**¡Listo para empezar! Escanea el QR Code y comienza a atender clientes con IA 🚀**
