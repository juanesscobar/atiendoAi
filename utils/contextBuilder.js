// =====================================
// CONSTRUCTOR DE CONTEXTO
// =====================================
const businessConfig = require("../config/business.json");

/**
 * Construir contexto enriquecido para procesar mensaje
 * @param {Object} params - Parámetros
 * @returns {Object} - Contexto completo
 */
function buildContext(params) {
  const {
    userPhone,
    userName,
    userMessage,
    intent,
    conversationHistory = [],
    userHistory = {},
  } = params;

  return {
    // Información del usuario
    user: {
      phone: userPhone,
      name: userName || "Visitante",
      firstMessage: !userHistory.lastMessageAt,
      totalMessages: (userHistory.totalMessages || 0) + 1,
      lastMessageAt: userHistory.lastMessageAt,
    },

    // Información del negocio
    business: {
      name: businessConfig.name,
      services: businessConfig.services,
      schedule: businessConfig.schedule,
    },

    // Información de la conversación
    conversation: {
      currentMessage: userMessage,
      intent: intent,
      messageCount: conversationHistory.length,
      history: conversationHistory.slice(-5), // Últimos 5 mensajes
    },

    // Información contextual
    context: {
      isBusinessHours: isBusinessHours(),
      dayOfWeek: getDayOfWeek(),
      time: new Date().toLocaleTimeString("es-ES"),
    },
  };
}

/**
 * Verificar si es horario comercial
 * @returns {boolean}
 */
function isBusinessHours() {
  const now = new Date();
  const hours = now.getHours();
  const dayName = getDayOfWeek();

  const schedule = require("../config/business.json").schedule;
  const [startHour] = schedule.businessHours.start.split(":").map(Number);
  const [endHour] = schedule.businessHours.end.split(":").map(Number);

  const isWorkDay = !schedule.offDays.includes(dayName);
  const isWorkHours = hours >= startHour && hours < endHour;

  return isWorkDay && isWorkHours;
}

/**
 * Obtener día de la semana en español
 * @returns {string}
 */
function getDayOfWeek() {
  const days = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  return days[new Date().getDay()];
}

/**
 * Construir contexto de disponibilidad
 * @returns {Object}
 */
function buildAvailabilityContext() {
  const schedule = businessConfig.schedule;
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  return {
    today: {
      day: getDayOfWeek(),
      date: today.toLocaleDateString("es-ES"),
      hours: schedule.businessHours,
      available: isBusinessHours(),
    },
    tomorrow: {
      day: getDayOfWeek(),
      date: tomorrow.toLocaleDateString("es-ES"),
      hours: schedule.businessHours,
      available: true,
    },
  };
}

/**
 * Construir contexto de servicios disponibles
 * @returns {Array}
 */
function buildServicesContext() {
  return businessConfig.services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: `$${service.price}`,
    duration: `${service.duration} ${service.durationUnit}`,
  }));
}

/**
 * Enriquecer contexto con sugerencias
 * @param {Object} context - Contexto base
 * @returns {Object} - Contexto enriquecido
 */
function enrichContext(context) {
  return {
    ...context,
    suggestions: generateSuggestions(context.conversation.intent),
    availability: buildAvailabilityContext(),
    services: buildServicesContext(),
  };
}

/**
 * Generar sugerencias basadas en intención
 * @param {Object} intent - Objeto de intención
 * @returns {Array}
 */
function generateSuggestions(intent) {
  const suggestions = {
    pricing: [
      "Ver todos nuestros servicios",
      "Agendar una consulta",
      "Conocer nuestras ofertas",
    ],
    appointment: [
      "Ver disponibilidad",
      "Confirmar datos",
      "Recibir recordatorio",
    ],
    info: [
      "Ver servicios",
      "Consultar precios",
      "Agendar cita",
    ],
    complaint: [
      "Hablar con un ejecutivo",
      "Recibir seguimiento",
      "Devolver producto",
    ],
    greeting: [
      "¿En qué puedo ayudarte?",
      "Explorar nuestros servicios",
      "Agendar cita",
    ],
    general: [
      "Ver servicios",
      "Contáctanos",
      "Agendar",
    ],
  };

  return suggestions[intent?.type] || suggestions.general;
}

module.exports = {
  buildContext,
  isBusinessHours,
  getDayOfWeek,
  buildAvailabilityContext,
  buildServicesContext,
  enrichContext,
  generateSuggestions,
};
