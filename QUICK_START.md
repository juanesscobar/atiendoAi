# 🚀 GUÍA RÁPIDA - COMIENZA EN 5 MINUTOS

## Paso 1: Obtén tu Clave OpenAI
1. Ve a: https://platform.openai.com/api-keys
2. Crea una cuenta (o inicia sesión)
3. Click en "Create new secret key"
4. Copia la clave

## Paso 2: Configura el `.env`
Abre o crea `.env` en la raíz del proyecto:

```env
OPENAI_API_KEY=sk-tu-clave-aqui
BUSINESS_NAME=Mi Negocio
BUSINESS_TIMEZONE=America/Mexico_City
```

## Paso 3: Personaliza tu Negocio
Edita `config/business.json`:
- Cambia el nombre
- Agrega tus servicios y precios
- Ajusta tu horario
- Actualiza teléfono y email

**Ejemplo completo:**
```json
{
  "name": "Peluquería Daniel",
  "email": "daniel@peluqueria.com",
  "phone": "+34612345678",
  "services": [
    {
      "id": 1,
      "name": "Corte de Cabello",
      "price": 25,
      "duration": 30,
      "durationUnit": "minutos"
    },
    {
      "id": 2,
      "name": "Tinte Completo",
      "price": 50,
      "duration": 2,
      "durationUnit": "horas"
    }
  ],
  "schedule": {
    "workDays": ["martes", "miércoles", "jueves", "viernes", "sábado"],
    "businessHours": {
      "start": "10:00",
      "end": "20:00"
    }
  }
}
```

## Paso 4: Instala Dependencias
```bash
npm install
```

## Paso 5: Ejecuta el Bot
```bash
node chatbot.js
```

Verás algo como esto:
```
✅ Tudo certo! WhatsApp conectado.
📲 Escaneie o QR Code abaixo:
████████████████████████████████
████████████████████████████████
```

## Paso 6: Escanea el QR Code
1. Abre **WhatsApp en tu teléfono**
2. Toca tu foto de perfil → **Dispositivos vinculados**
3. **Conectar dispositivo** 
4. **Escanea el QR** que aparece en la terminal

## ¡Listo! 🎉

Ahora:
- Envía un mensaje a tu número de WhatsApp desde otro teléfono
- El bot responderá con IA
- Prueba: "Hola", "¿Qué servicios tienen?", "Quiero agendar"

---

## 📝 Ejemplos de Conversaciones

**Usuario:** "Hola, ¿cuál es tu horario?"
**Bot:** "¡Hola! 👋 Nuestro horario es de lunes a sábado de 10:00 AM a 8:00 PM. ¿En qué puedo ayudarte?"

**Usuario:** "Quiero un corte de cabello el viernes"
**Bot:** "Perfecto, te agendo un corte de cabello para el viernes. 
Necesito confirmar:
✓ Tu nombre
✓ Teléfono
✓ ¿Qué hora prefieres? (Disponible de 10:00 a 20:00)"

**Usuario:** "¿Cuánto cuesta el tinte?"
**Bot:** "El tinte completo cuesta €50 y toma aproximadamente 2 horas..."

---

## 🔧 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "OPENAI_API_KEY not found" | Revisa que `.env` esté correcto |
| "WhatsApp desconectado" | Escanea nuevamente el QR |
| "Errores de módulos" | Ejecuta `npm install` de nuevo |
| "Respuestas lentas" | Verifica internet o cambia modelo a `gpt-3.5-turbo` |

---

## 📞 Testeando Localmente

Sin escanear QR (para test):
```bash
# En otra terminal:
node -e "
const aiService = require('./services/aiService');
aiService.processMessage({
  userMessage: '¿Hola qué servicios ofrecen?',
  userPhone: 'test',
  conversationHistory: []
}).then(r => console.log(r.message));
"
```

---

## 🎯 Próximas Mejoras Recomendadas

- [ ] Agregar más servicios
- [ ] Cambiar de `gpt-4-mini` a `gpt-4` (más inteligente)
- [ ] Crear BD SQLite para guardar citas
- [ ] Agregar recordatorios automáticos
- [ ] Integrar pagos (Stripe)

---

**¡Ya estás listo para automatizar atención al cliente! 🚀**
