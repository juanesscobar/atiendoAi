// =====================================
// SERVICIO DE IA (OpenAI)
// =====================================
const OpenAI = require("openai");
require("dotenv").config();

const businessConfig = require("../config/business.json");

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Construir el prompt del sistema con contexto del negocio
 */
const buildSystemPrompt = () => {
  const services = businessConfig.services
    .map(
      (s) =>
        `- ${s.name}: $${s.price} (${s.duration} ${s.durationUnit})`
    )
    .join("\n");

  return `Eres un agente de atención al cliente amable y profesional para "${businessConfig.name}".

📋 INFORMACIÓN DEL NEGOCIO:
${businessConfig.description}
Contacto: ${businessConfig.email} | ${businessConfig.phone}
Sitio web: ${businessConfig.website}

🛍️ SERVICIOS DISPONIBLES:
${services}

⏰ HORARIO DE ATENCIÓN:
Lunes a Viernes: ${businessConfig.schedule.businessHours.start} - ${businessConfig.schedule.businessHours.end}
Zona horaria: ${businessConfig.schedule.timezone}

📋 POLÍTICAS:
- Cancelación: ${businessConfig.policies.cancellation}
- Formas de pago: ${businessConfig.policies.paymentMethods.join(", ")}
- ${businessConfig.policies.warranty}

📌 INSTRUCCIONES:
1. Sé amable, profesional y conciso
2. Si el usuario pregunta sobre servicios, presenta las opciones disponibles
3. Si pide agendar cita, solicita: nombre completo, teléfono, servicio deseado y fecha/hora preferida
4. Si tiene dudas, resuelve con información clara o sugiere contacto directo
5. Responde siempre en español
6. No prometas cosas fuera de tu competencia
7. Si necesitas más información, pídela amablemente

Responde de forma natural y conversacional. Usa emojis ocasionalmente para hacer más amena la conversación.`;
};

/**
 * Obtener respuesta de IA
 * @param {string} userMessage - Mensaje del usuario
 * @param {Array} conversationHistory - Historial de la conversación
 * @returns {Promise<string>} - Respuesta de IA
 */
async function getAIResponse(userMessage, conversationHistory = []) {
  try {
    // Preparar mensajes para enviar a OpenAI
    const messages = [
      { role: "system", content: buildSystemPrompt() },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: businessConfig.aiConfig.model,
      messages: messages,
      temperature: businessConfig.aiConfig.temperature,
      max_tokens: businessConfig.aiConfig.maxTokens,
    });

    const aiMessage = response.choices[0].message.content;

    return aiMessage;
  } catch (error) {
    console.error("❌ Error al llamar a OpenAI:", error.message);
    
    // Respuesta de fallback si falla la IA
    return "Disculpa, tuve un problema procesando tu mensaje. Por favor intenta de nuevo o contacta directamente a " +
      businessConfig.email;
  }
}

/**
 * Procesar mensaje con intención y contexto
 * @param {Object} params - Parámetros
 * @returns {Promise<Object>} - Respuesta estructurada
 */
async function processMessage(params) {
  const {
    userMessage,
    userPhone,
    conversationHistory = [],
    userContext = {},
  } = params;

  try {
    // Obtener respuesta de IA
    const aiResponse = await getAIResponse(userMessage, conversationHistory);

    return {
      success: true,
      message: aiResponse,
      timestamp: new Date(),
      tokensUsed: null, // Se puede agregar tracking
    };
  } catch (error) {
    console.error("❌ Error en processMessage:", error);
    return {
      success: false,
      message: "Hubo un error procesando tu solicitud. Intenta más tarde.",
      error: error.message,
    };
  }
}

/**
 * Verificar si es una solicitud de cita
 */
function detectAppointmentRequest(message) {
  const keywords = [
    "agendar",
    "cita",
    "horario",
    "disponible",
    "cuando",
    "booking",
    "reserv",
  ];
  return keywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );
}

/**
 * Verificar si es una solicitud de información
 */
function detectInfoRequest(message) {
  const keywords = [
    "precio",
    "costo",
    "cual",
    "como",
    "que",
    "información",
    "servicio",
    "ofertas",
  ];
  return keywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );
}

module.exports = {
  getAIResponse,
  processMessage,
  detectAppointmentRequest,
  detectInfoRequest,
  buildSystemPrompt,
};
