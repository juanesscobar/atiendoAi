// =====================================
// DETECTOR DE INTENCIONES
// =====================================

/**
 * Detectar la intención del mensaje
 * @param {string} text - Texto del mensaje
 * @returns {Object} - Objeto con intención detectada
 */
function detectIntent(text) {
  const lowerText = text.toLowerCase().trim();

  // Intención: Información
  if (matchesPattern(lowerText, ["precio", "costo", "cuanto", "cuesta", "valor", "tarifa"])) {
    return { type: "pricing", confidence: 0.9 };
  }

  // Intención: Agendar cita
  if (matchesPattern(lowerText, ["agendar", "cita", "reserva", "horario", "disponible", "cuando", "booking"])) {
    return { type: "appointment", confidence: 0.95 };
  }

  // Intención: Información general
  if (matchesPattern(lowerText, ["que", "cuales", "cuáles", "servicios", "oferta", "informacion", "información"])) {
    return { type: "info", confidence: 0.85 };
  }

  // Intención: Consulta de estado
  if (matchesPattern(lowerText, ["estado", "pedido", "orden", "como va", "cuando llega"])) {
    return { type: "status", confidence: 0.8 };
  }

  // Intención: Quejas/Problemas
  if (matchesPattern(lowerText, ["problema", "error", "queja", "no funciona", "reclamo", "insatisfecho"])) {
    return { type: "complaint", confidence: 0.9 };
  }

  // Intención: Saludo
  if (matchesPattern(lowerText, ["hola", "buenos dias", "buenas tardes", "buenos noches", "hey", "hi", "ola"])) {
    return { type: "greeting", confidence: 0.95 };
  }

  // Intención: Despedida
  if (matchesPattern(lowerText, ["adios", "hasta luego", "chao", "bye", "gracias", "thanks"])) {
    return { type: "farewell", confidence: 0.9 };
  }

  // Intención: Por defecto
  return { type: "general", confidence: 0.5 };
}

/**
 * Verificar si el texto coincide con patrones
 * @param {string} text - Texto a verificar
 * @param {Array<string>} patterns - Patrones a buscar
 * @returns {boolean}
 */
function matchesPattern(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

/**
 * Extraer información de contacto del mensaje
 * @param {string} text - Texto del mensaje
 * @returns {Object} - Información extraída
 */
function extractContactInfo(text) {
  const extracted = {};

  // Buscar número de teléfono
  const phoneRegex = /(\d{7,12})/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0];
  }

  // Buscar email
  const emailRegex = /([^\s@]+@[^\s@]+\.[^\s@]+)/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }

  // Buscar nombre (palabras capitalizadas)
  const nameRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/;
  const nameMatch = text.match(nameRegex);
  if (nameMatch) {
    extracted.name = nameMatch[0];
  }

  return extracted;
}

/**
 * Calcular confianza general del mensaje
 * @param {Object} intent - Objeto de intención
 * @param {string} text - Texto del mensaje
 * @returns {number} - Porcentaje de confianza
 */
function calculateConfidence(intent, text) {
  let confidence = intent.confidence;

  // Aumentar confianza si el mensaje es claro
  if (text.length > 10 && text.length < 200) {
    confidence += 0.05;
  }

  // Reducir si hay mucha incertidumbre
  if (text.includes("?") && intent.type === "general") {
    confidence -= 0.1;
  }

  return Math.min(confidence, 1);
}

module.exports = {
  detectIntent,
  matchesPattern,
  extractContactInfo,
  calculateConfidence,
};
