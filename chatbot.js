// =====================================
// IMPORTAÇÕES
// =====================================
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");

// Servicios personalizados
const aiService = require("./services/aiService");
const { detectIntent, extractContactInfo } = require("./utils/intentDetector");
const { buildContext, enrichContext } = require("./utils/contextBuilder");

// =====================================
// CONFIGURAÇÃO DO CLIENTE
// =====================================
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-web-resources",
    ],
    timeout: 60000,
  },
  webVersion: "2.2412.50",
});

// =====================================
// QR CODE
// =====================================
client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

// =====================================
// WHATSAPP CONECTADO
// =====================================
client.on("ready", () => {
  console.log("✅ Tudo certo! WhatsApp conectado.");
  console.log("🤖 Bot listo para procesar mensajes");
});

// =====================================
// DESCONEXÃO
// =====================================
client.on("disconnected", (reason) => {
  console.log("⚠️ Desconectado:", reason);
  console.log("🔄 Intentando reconectar en 5 segundos...");
  setTimeout(() => {
    console.log("🔄 Reconectando...");
    client.initialize();
  }, 5000);
  process.exit(0);
});

// =====================================
// MANEJO DE ERRORES
// =====================================
client.on("error", (err) => {
  console.error("❌ Error en cliente WhatsApp:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promise rechazada no manejada:", reason);
});

// =====================================
// INICIALIZA
// =====================================
client.initialize();

// =====================================
// FUNÇÃO DE DELAY
// =====================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// =====================================
// ALMACENAMIENTO DE CONTEXTO (En memoria - producción usar BD)
// =====================================
const conversationHistory = {};

/**
 * Obtener historial de conversación del usuario
 */
function getConversationHistory(userPhone) {
  if (!conversationHistory[userPhone]) {
    conversationHistory[userPhone] = [];
  }
  return conversationHistory[userPhone];
}

/**
 * Agregar mensaje al historial
 */
function addToHistory(userPhone, role, content) {
  if (!conversationHistory[userPhone]) {
    conversationHistory[userPhone] = [];
  }
  conversationHistory[userPhone].push({ role, content });
  
  // Mantener últimos 10 mensajes para no exceder límites de tokens
  if (conversationHistory[userPhone].length > 10) {
    conversationHistory[userPhone].shift();
  }
}

// =====================================
// FUNIL DE MENSAJES (SOMENTE PRIVADO)
// =====================================
client.on("message", async (msg) => {
  try {
    // ❌ IGNORA GRUPOS
    if (!msg.from || msg.from.endsWith("@g.us")) return;

    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const userMessage = msg.body ? msg.body.trim() : "";
    const userPhone = msg.from;
    const userName = msg._data.notifyName || "Usuario";

    if (!userMessage) return;

    console.log(`📱 Mensaje de ${userName} (${userPhone}): ${userMessage}`);

    // 1. Detectar intención
    const intent = detectIntent(userMessage);
    console.log(`🎯 Intención detectada: ${intent.type} (${Math.round(intent.confidence * 100)}%)`);

    // 2. Obtener historial
    const history = getConversationHistory(userPhone);

    // 3. Construir contexto
    const context = buildContext({
      userPhone,
      userName,
      userMessage,
      intent,
      conversationHistory: history,
    });

    // 4. Mostrar indicador de escritura
    await delay(1000);
    await chat.sendStateTyping();

    // 5. Procesar con IA
    const aiResponse = await aiService.processMessage({
      userMessage,
      userPhone,
      conversationHistory: history,
      userContext: context,
    });

    if (!aiResponse.success) {
      console.error("❌ Error en IA:", aiResponse.error);
      await client.sendMessage(
        msg.from,
        "Disculpa, tuve un problema procesando tu mensaje. Por favor intenta de nuevo."
      );
      return;
    }

    // 6. Agregar a historial
    addToHistory(userPhone, "user", userMessage);
    addToHistory(userPhone, "assistant", aiResponse.message);

    // 7. Simular escritura y enviar
    await delay(2000);
    await client.sendMessage(msg.from, aiResponse.message);
    
    console.log(`✅ Respuesta enviada a ${userName}`);

  } catch (error) {
    console.error("❌ Erro no processamento da mensagem:", error.message);
    try {
      await client.sendMessage(
        msg.from,
        "Disculpa, ocurrió un error. Por favor intenta más tarde o contáctanos directamente."
      );
    } catch (sendError) {
      console.error("❌ Error enviando mensaje de error:", sendError.message);
    }
  }
});
