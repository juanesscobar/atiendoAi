// =====================================
// EJEMPLO DE FLUJO DE CONVERSACIÓN
// =====================================

/**
 * Este archivo muestra cómo funciona el bot con ejemplos de conversaciones reales
 */

// =====================================
// EJEMPLO 1: CONSULTA DE PRECIOS
// =====================================

/* 
Usuario: "¿Cuál es el precio del servicio premium?"

Flujo:
1. detectIntent() → type: "pricing" (confidence: 0.9)
2. buildContext() → Obtiene servicios disponibles
3. aiService.processMessage() → Envía a OpenAI con contexto
4. OpenAI responde:
   "El Servicio Premium tiene un costo de $150 y tiene una duración de 1 hora. 
    Incluye acompañamiento personalizado y soporte en vivo. ¿Te gustaría agendarlo?"

Resultado: Respuesta inteligente con info completa
*/

// =====================================
// EJEMPLO 2: SOLICITUD DE CITA
// =====================================

/*
Usuario: "Quiero agendar una cita para mañana"

Flujo:
1. detectIntent() → type: "appointment" (confidence: 0.95)
2. buildContext() → Obtiene disponibilidad
3. extractContactInfo() → Intenta extraer teléfono/nombre
4. aiService.processMessage() con contexto de horarios
5. OpenAI responde:
   "¡Excelente! 📅 Con gusto te agendo una cita.
    
    Para confirmar necesito:
    ✓ Tu nombre completo
    ✓ Teléfono de contacto
    ✓ ¿Qué servicio deseas? (Consulta inicial, Premium, o Paquete mensual)
    ✓ ¿Qué hora prefieres? (Disponemos de 9:00 - 18:00)"

Resultado: Guía interactiva de agendamiento
*/

// =====================================
// EJEMPLO 3: PREGUNTA GENERAL
// =====================================

/*
Usuario: "¿Qué servicios ofrecen?"

Flujo:
1. detectIntent() → type: "info" (confidence: 0.85)
2. buildServicesContext() → Lista todos los servicios
3. aiService.processMessage() con contexto enriquecido
4. OpenAI responde:
   "Ofrecemos 3 servicios principales:
   
   1️⃣ Consulta Inicial
      • Gratis
      • Duración: 30 minutos
      • Ideal para conocernos
   
   2️⃣ Servicio Premium
      • $150
      • Duración: 1 hora
      • Incluye seguimiento
   
   3️⃣ Paquete Mensual
      • $500
      • Acceso ilimitado durante 30 días
      • Máxima flexibilidad
   
   ¿Cuál te interesa?"

Resultado: Catálogo formateado y profesional
*/

// =====================================
// EJEMPLO 4: FUERA DE HORARIO
// =====================================

/*
Usuario: "Hola, escribo a las 22:30" (fuera de horario)

Flujo:
1. detectIntent() → type: "greeting"
2. isBusinessHours() → false (está fuera de horario)
3. buildAvailabilityContext() → Muestra próximo horario disponible
4. aiService.processMessage() con contexto temporal
5. OpenAI responde:
   "¡Hola! 👋 Gracias por escribir.
   
   ⏰ Actualmente estamos fuera de horario.
   
   Nuestro horario de atención es:
   📅 Lunes a Viernes: 9:00 AM - 6:00 PM
   
   Responderemos tu mensaje mañana a primera hora.
   ¿Hay algo urgente que pueda ayudarte?"

Resultado: Respuesta empática y profesional
*/

// =====================================
// EJEMPLO 5: CONVERSACIÓN CON MEMORIA
// =====================================

/*
Historial:
Usuario: "Hola, quiero el servicio premium"
Bot: "Perfecto... ¿cuándo quieres agendarlo?"

Usuario: "El próximo lunes a las 10 AM"
Bot: "¿Puedes confirmarne tu nombre?"

Usuario: "Juan García"

Flujo en último mensaje:
1. conversationHistory = [
     { role: "user", content: "Hola, quiero el servicio premium" },
     { role: "assistant", content: "Perfecto... ¿cuándo...?" },
     { role: "user", content: "El próximo lunes..." },
     { role: "assistant", content: "¿Puedes confirmarne..." },
     { role: "user", content: "Juan García" }
   ]
2. detectIntent() → Entiende que es confirmación
3. aiService.processMessage() → Envía TODA la conversación a OpenAI
4. OpenAI responde con contexto completo:
   "Perfecto Juan, confirmamos tu cita:
   
   📋 Detalles:
   • Cliente: Juan García
   • Servicio: Premium ($150)
   • Fecha: Próximo lunes
   • Hora: 10:00 AM
   • Duración: 1 hora
   
   Te enviaremos un recordatorio el domingo a las 7 PM.
   ¿Hay algo más que necesites?"

Resultado: Contexto completo para respuestas coherentes
*/

// =====================================
// EJEMPLO 6: MANEJO DE ERRORES
// =====================================

/*
Usuario: "asdfjkl;qwerty" (mensaje sin sentido)

Flujo:
1. detectIntent() → type: "general" (confidence: 0.5)
2. aiService.processMessage() → OpenAI intenta entender
3. OpenAI responde inteligentemente:
   "Hola 👋 Parece que tu mensaje se envió de forma incompleta.
   
   ¿En qué puedo ayudarte?
   
   📌 Algunas cosas que puedo hacer:
   • 💰 Informarte sobre precios
   • 📅 Agendar una cita
   • ℹ️ Responder preguntas del negocio
   • 🎯 Ofrecerte soluciones personalizadas"

Resultado: Recuperación elegante de error
*/

module.exports = {
  examples: "Ver arriba para casos de uso reales"
};
