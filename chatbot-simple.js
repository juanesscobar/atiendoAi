// =====================================
// CHATBOT WHATSAPP - VERSIÓN SIMPLIFICADA
// =====================================
require("dotenv").config();
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");

// Servicios
const aiService = require("./services/aiService");
const { detectIntent } = require("./utils/intentDetector");
const { buildContext } = require("./utils/contextBuilder");

// Log file
const LOG_FILE = "./chatbot-debug.log";

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + "\n");
}

log("🚀 Iniciando Chatbot...");

// =====================================
// CONFIGURACIÓN DEL CLIENTE
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
    ],
    timeout: 60000,
  },
});

// =====================================
// EVENTOS
// =====================================
client.on("qr", (qr) => {
  log("📲 QR Code generado");
  console.log("📲 Escanea el QR Code abajo:\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  log("✅ WhatsApp conectado correctamente");
});

client.on("disconnected", (reason) => {
  log(`⚠️ Desconectado: ${reason}`);
});

client.on("auth_failure", (msg) => {
  log(`❌ Error de autenticación: ${msg}`);
});

// =====================================
// DELAY
// =====================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// =====================================
// HISTORIAL DE CONVERSACIONES
// =====================================
const conversationHistory = {};

function getHistory(phone) {
  if (!conversationHistory[phone]) {
    conversationHistory[phone] = [];
  }
  return conversationHistory[phone];
}

function addHistory(phone, role, content) {
  if (!conversationHistory[phone]) {
    conversationHistory[phone] = [];
  }
  conversationHistory[phone].push({ role, content });
  if (conversationHistory[phone].length > 10) {
    conversationHistory[phone].shift();
  }
}

// =====================================
// MANEJADOR DE MENSAJES
// =====================================
client.on("message", async (msg) => {
  try {
    // Ignorar grupos
    if (!msg.from || msg.from.endsWith("@g.us")) return;
    
    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const userMessage = msg.body ? msg.body.trim() : "";
    const userPhone = msg.from;
    const userName = msg._data.notifyName || "Usuario";

    if (!userMessage) return;

    log(`📱 Mensaje de ${userName} (${userPhone}): ${userMessage}`);

    // Detectar intención
    const intent = detectIntent(userMessage);
    log(`🎯 Intención: ${intent.type} (${Math.round(intent.confidence * 100)}%)`);

    // Obtener historial
    const history = getHistory(userPhone);

    // Construir contexto
    const context = buildContext({
      userPhone,
      userName,
      userMessage,
      intent,
      conversationHistory: history,
    });

    // Mostrar escritura
    await delay(500);
    await chat.sendStateTyping();

    // Procesar con IA
    log("🤖 Enviando a IA...");
    const aiResponse = await aiService.processMessage({
      userMessage,
      userPhone,
      conversationHistory: history,
      userContext: context,
    });

    if (!aiResponse.success) {
      log(`❌ Error en IA: ${aiResponse.error}`);
      await client.sendMessage(
        msg.from,
        "Disculpa, tuve un problema. Por favor intenta de nuevo."
      );
      return;
    }

    // Guardar en historial
    addHistory(userPhone, "user", userMessage);
    addHistory(userPhone, "assistant", aiResponse.message);

    // Enviar respuesta
    await delay(1500);
    await client.sendMessage(msg.from, aiResponse.message);
    log(`✅ Respuesta enviada a ${userName}`);

  } catch (error) {
    log(`❌ Error: ${error.message}`);
    try {
      await client.sendMessage(
        msg.from,
        "Hubo un error. Por favor intenta más tarde."
      );
    } catch (e) {
      log(`❌ Error enviando respuesta de error: ${e.message}`);
    }
  }
});

// =====================================
// INICIALIZAR
// =====================================
log("Inicializando cliente WhatsApp...");
client.initialize().catch((error) => {
  log(`❌ Error al inicializar: ${error.message}`);
  process.exit(1);
});

// =====================================
// MANEJO DE ERRORES GLOBAL
// =====================================
process.on("unhandledRejection", (reason, promise) => {
  log(`❌ Promise rechazada: ${reason}`);
});

process.on("uncaughtException", (error) => {
  log(`❌ Error no capturado: ${error.message}`);
});

log("⏳ Esperando QR Code...");
