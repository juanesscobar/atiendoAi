// =====================================
// TEST DE SERVICIOS
// =====================================

console.log("🧪 Iniciando pruebas de servicios...\n");

// Test 1: Cargar servicios
console.log("1️⃣ Probando carga de módulos...");
try {
  const aiService = require("./services/aiService");
  console.log("   ✅ aiService cargado");
} catch (e) {
  console.log("   ❌ Error en aiService:", e.message);
}

try {
  const intentDetector = require("./utils/intentDetector");
  console.log("   ✅ intentDetector cargado");
} catch (e) {
  console.log("   ❌ Error en intentDetector:", e.message);
}

try {
  const contextBuilder = require("./utils/contextBuilder");
  console.log("   ✅ contextBuilder cargado");
} catch (e) {
  console.log("   ❌ Error en contextBuilder:", e.message);
}

console.log("\n2️⃣ Probando detección de intenciones...");
const { detectIntent } = require("./utils/intentDetector");
const testMessages = [
  "hola",
  "¿cuánto cuesta?",
  "quiero agendar",
  "información",
];

testMessages.forEach((msg) => {
  const intent = detectIntent(msg);
  console.log(`   "${msg}" → ${intent.type} (${Math.round(intent.confidence * 100)}%)`);
});

console.log("\n3️⃣ Probando IA (esto puede tardar 5-10 segundos)...");
const aiService = require("./services/aiService");

aiService
  .processMessage({
    userMessage: "Hola, ¿qué servicios tienen?",
    userPhone: "test123",
    conversationHistory: [],
  })
  .then((response) => {
    if (response.success) {
      console.log("   ✅ IA funcionando");
      console.log("   Respuesta:", response.message.substring(0, 100) + "...");
    } else {
      console.log("   ❌ Error en IA:", response.error);
    }
  })
  .catch((error) => {
    console.log("   ❌ Error llamando IA:", error.message);
  });

console.log("\n✅ Tests completados. Si todo está en verde, el bot debería funcionar.");
